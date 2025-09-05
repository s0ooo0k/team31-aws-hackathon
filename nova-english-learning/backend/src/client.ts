import {
  BedrockRuntimeClient,
  BedrockRuntimeClientConfig,
  InvokeModelWithBidirectionalStreamCommand,
  InvokeModelWithBidirectionalStreamInput,
} from "@aws-sdk/client-bedrock-runtime";
import {
  NodeHttp2Handler,
  NodeHttp2HandlerOptions,
} from "@smithy/node-http-handler";
import { Provider } from "@smithy/types";
import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { InferenceConfig } from "./types";
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import {
  DefaultAudioInputConfiguration,
  DefaultAudioOutputConfiguration,
  DefaultSystemPrompt,
  DefaultTextConfiguration
} from "./consts";

export interface NovaSonicBidirectionalStreamClientConfig {
  requestHandlerConfig?:
  | NodeHttp2HandlerOptions
  | Provider<NodeHttp2HandlerOptions | void>;
  clientConfig: Partial<BedrockRuntimeClientConfig>;
  inferenceConfig?: InferenceConfig;
}

export class StreamSession {
  private audioBufferQueue: Buffer[] = [];
  private maxQueueSize = 50; // 큐 크기 줄임
  private isProcessingAudio = false;
  private isActive = true;
  private processingDelay = 10; // 처리 지연 시간 추가

  constructor(
    private sessionId: string,
    private client: NovaSonicBidirectionalStreamClient
  ) { }

  public onEvent(eventType: string, handler: (data: any) => void): StreamSession {
    this.client.registerEventHandler(this.sessionId, eventType, handler);
    return this;
  }

  public async setupPromptStart(): Promise<void> {
    this.client.setupPromptStartEvent(this.sessionId);
  }

  public async setupSystemPrompt(
    textConfig: typeof DefaultTextConfiguration = DefaultTextConfiguration,
    systemPromptContent: string = DefaultSystemPrompt): Promise<void> {
    this.client.setupSystemPromptEvent(this.sessionId, textConfig, systemPromptContent);
  }

  public async setupStartAudio(
    audioConfig: typeof DefaultAudioInputConfiguration = DefaultAudioInputConfiguration
  ): Promise<void> {
    this.client.setupStartAudioEvent(this.sessionId, audioConfig);
  }

  public async streamAudio(audioData: Buffer): Promise<void> {
    if (this.audioBufferQueue.length >= this.maxQueueSize) {
      this.audioBufferQueue.shift();
      console.log("Audio queue full, dropping oldest chunk");
    }

    this.audioBufferQueue.push(audioData);
    this.processAudioQueue();
  }

  private async processAudioQueue() {
    if (this.isProcessingAudio || this.audioBufferQueue.length === 0 || !this.isActive) return;

    this.isProcessingAudio = true;
    try {
      let processedChunks = 0;
      const maxChunksPerBatch = 5;

      while (this.audioBufferQueue.length > 0 && processedChunks < maxChunksPerBatch && this.isActive) {
        const audioChunk = this.audioBufferQueue.shift();
        if (audioChunk) {
          await this.client.streamAudioChunk(this.sessionId, audioChunk);
          processedChunks++;
        }
      }
    } finally {
      this.isProcessingAudio = false;

      if (this.audioBufferQueue.length > 0 && this.isActive) {
        setTimeout(() => this.processAudioQueue(), this.processingDelay);
      }
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public async endAudioContent(): Promise<void> {
    if (!this.isActive) return;
    await this.client.sendContentEnd(this.sessionId);
  }

  public async endPrompt(): Promise<void> {
    if (!this.isActive) return;
    await this.client.sendPromptEnd(this.sessionId);
  }

  public async close(): Promise<void> {
    if (!this.isActive) return;

    this.isActive = false;
    this.audioBufferQueue = [];

    await this.client.sendSessionEnd(this.sessionId);
    console.log(`Session ${this.sessionId} close completed`);
  }
}

interface SessionData {
  queue: Array<any>;
  queueSignal: Subject<void>;
  closeSignal: Subject<void>;
  responseSubject: Subject<any>;
  toolUseContent: any;
  toolUseId: string;
  toolName: string;
  responseHandlers: Map<string, (data: any) => void>;
  promptName: string;
  inferenceConfig: InferenceConfig;
  isActive: boolean;
  isPromptStartSent: boolean;
  isAudioContentStartSent: boolean;
  audioContentId: string;
}

export class NovaSonicBidirectionalStreamClient {
  private bedrockRuntimeClient: BedrockRuntimeClient;
  private inferenceConfig: InferenceConfig;
  private activeSessions: Map<string, SessionData> = new Map();
  private sessionLastActivity: Map<string, number> = new Map();
  private sessionCleanupInProgress = new Set<string>();

  constructor(config: NovaSonicBidirectionalStreamClientConfig) {
    const nodeHttp2Handler = new NodeHttp2Handler({
      requestTimeout: 300000,
      sessionTimeout: 300000,
      disableConcurrentStreams: false,
      maxConcurrentStreams: 20,
      ...config.requestHandlerConfig,
    });

    if (!config.clientConfig.credentials) {
      throw new Error("No credentials provided");
    }

    this.bedrockRuntimeClient = new BedrockRuntimeClient({
      ...config.clientConfig,
      credentials: config.clientConfig.credentials,
      region: config.clientConfig.region || "us-east-1",
      requestHandler: nodeHttp2Handler
    });

    this.inferenceConfig = config.inferenceConfig ?? {
      maxTokens: 1024,
      topP: 0.9,
      temperature: 0.7,
    };
  }

  public isSessionActive(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    return !!session && session.isActive;
  }

  public getActiveSessions(): string[] {
    return Array.from(this.activeSessions.keys());
  }

  public getLastActivityTime(sessionId: string): number {
    return this.sessionLastActivity.get(sessionId) || 0;
  }

  private updateSessionActivity(sessionId: string): void {
    this.sessionLastActivity.set(sessionId, Date.now());
  }

  public createStreamSession(sessionId: string = randomUUID()): StreamSession {
    if (this.activeSessions.has(sessionId)) {
      throw new Error(`Stream session with ID ${sessionId} already exists`);
    }

    const session: SessionData = {
      queue: [],
      queueSignal: new Subject<void>(),
      closeSignal: new Subject<void>(),
      responseSubject: new Subject<any>(),
      toolUseContent: null,
      toolUseId: "",
      toolName: "",
      responseHandlers: new Map(),
      promptName: randomUUID(),
      inferenceConfig: this.inferenceConfig,
      isActive: true,
      isPromptStartSent: false,
      isAudioContentStartSent: false,
      audioContentId: randomUUID()
    };

    this.activeSessions.set(sessionId, session);
    return new StreamSession(sessionId, this);
  }

  public async initiateSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Stream session ${sessionId} not found`);
    }

    try {
      this.setupSessionStartEvent(sessionId);
      const asyncIterable = this.createSessionAsyncIterable(sessionId);

      console.log(`Starting bidirectional stream for session ${sessionId}...`);

      const response = await this.bedrockRuntimeClient.send(
        new InvokeModelWithBidirectionalStreamCommand({
          modelId: "amazon.nova-sonic-v1:0",
          body: asyncIterable,
        })
      );

      console.log(`Stream established for session ${sessionId}, processing responses...`);
      await this.processResponseStream(sessionId, response);

    } catch (error) {
      console.error(`Error in session ${sessionId}: `, error);
      this.dispatchEventForSession(sessionId, 'error', {
        source: 'bidirectionalStream',
        error
      });

      if (session.isActive) {
        this.closeSession(sessionId);
      }
    }
  }

  public setupPromptStartEvent(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;
    
    this.addEventToSessionQueue(sessionId, {
      event: {
        promptStart: {
          promptName: session.promptName,
          textOutputConfiguration: {
            mediaType: "text/plain",
          },
          audioOutputConfiguration: DefaultAudioOutputConfiguration,
        },
      }
    });
    session.isPromptStartSent = true;
  }

  public setupSystemPromptEvent(sessionId: string, textConfig: any, systemPromptContent: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;
    
    const textPromptID = randomUUID();
    this.addEventToSessionQueue(sessionId, {
      event: {
        contentStart: {
          promptName: session.promptName,
          contentName: textPromptID,
          type: "TEXT",
          interactive: true,
          role: "SYSTEM",
          textInputConfiguration: textConfig,
        },
      }
    });

    this.addEventToSessionQueue(sessionId, {
      event: {
        textInput: {
          promptName: session.promptName,
          contentName: textPromptID,
          content: systemPromptContent,
        },
      }
    });

    this.addEventToSessionQueue(sessionId, {
      event: {
        contentEnd: {
          promptName: session.promptName,
          contentName: textPromptID,
        },
      }
    });
  }

  public setupStartAudioEvent(sessionId: string, audioConfig: any): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    this.addEventToSessionQueue(sessionId, {
      event: {
        contentStart: {
          promptName: session.promptName,
          contentName: session.audioContentId,
          type: "AUDIO",
          interactive: true,
          role: "USER",
          audioInputConfiguration: audioConfig,
        },
      }
    });
    session.isAudioContentStartSent = true;
  }

  public async streamAudioChunk(sessionId: string, audioData: Buffer): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isActive || !session.audioContentId) {
      throw new Error(`Invalid session ${sessionId} for audio streaming`);
    }
    
    const base64Data = audioData.toString('base64');
    this.addEventToSessionQueue(sessionId, {
      event: {
        audioInput: {
          promptName: session.promptName,
          contentName: session.audioContentId,
          content: base64Data,
        },
      }
    });
  }

  public registerEventHandler(sessionId: string, eventType: string, handler: (data: any) => void): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    session.responseHandlers.set(eventType, handler);
  }

  private setupSessionStartEvent(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    this.addEventToSessionQueue(sessionId, {
      event: {
        sessionStart: {
          inferenceConfiguration: session.inferenceConfig
        }
      }
    });
  }

  private addEventToSessionQueue(sessionId: string, event: any): void {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isActive) return;

    this.updateSessionActivity(sessionId);
    session.queue.push(event);
    session.queueSignal.next();
  }

  private dispatchEventForSession(sessionId: string, eventType: string, data: any): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const handler = session.responseHandlers.get(eventType);
    if (handler) {
      try {
        handler(data);
      } catch (e) {
        console.error(`Error in ${eventType} handler for session ${sessionId}: `, e);
      }
    }
  }

  private createSessionAsyncIterable(sessionId: string): AsyncIterable<InvokeModelWithBidirectionalStreamInput> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    return {
      [Symbol.asyncIterator]: () => ({
        next: async () => {
          try {
            if (!session.isActive || !this.activeSessions.has(sessionId)) {
              return { value: undefined, done: true };
            }

            if (session.queue.length === 0) {
              try {
                await Promise.race([
                  firstValueFrom(session.queueSignal.pipe(take(1))),
                  firstValueFrom(session.closeSignal.pipe(take(1))).then(() => {
                    throw new Error("Stream closed");
                  })
                ]);
              } catch (error) {
                if (error instanceof Error && error.message === "Stream closed") {
                  return { value: undefined, done: true };
                }
              }
            }

            if (session.queue.length === 0 || !session.isActive) {
              return { value: undefined, done: true };
            }

            const nextEvent = session.queue.shift();
            return {
              value: {
                chunk: {
                  bytes: new TextEncoder().encode(JSON.stringify(nextEvent))
                }
              },
              done: false
            };
          } catch (error) {
            console.error(`Error in session ${sessionId} iterator: `, error);
            session.isActive = false;
            return { value: undefined, done: true };
          }
        }
      })
    };
  }

  private async processResponseStream(sessionId: string, response: any): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    try {
      for await (const event of response.body) {
        if (!session.isActive) break;
        
        if (event.chunk?.bytes) {
          this.updateSessionActivity(sessionId);
          const textResponse = new TextDecoder().decode(event.chunk.bytes);
          
          try {
            const jsonResponse = JSON.parse(textResponse);
            if (jsonResponse.event?.contentStart) {
              this.dispatchEventForSession(sessionId, 'contentStart', jsonResponse.event.contentStart);
            } else if (jsonResponse.event?.textOutput) {
              this.dispatchEventForSession(sessionId, 'textOutput', jsonResponse.event.textOutput);
            } else if (jsonResponse.event?.audioOutput) {
              this.dispatchEventForSession(sessionId, 'audioOutput', jsonResponse.event.audioOutput);
            } else if (jsonResponse.event?.contentEnd) {
              this.dispatchEventForSession(sessionId, 'contentEnd', jsonResponse.event.contentEnd);
            }
          } catch (e) {
            console.log(`Parse error for session ${sessionId}: `, textResponse);
          }
        }
      }

      console.log(`Response stream processing complete for session ${sessionId}`);
      this.dispatchEventForSession(sessionId, 'streamComplete', {
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`Error processing response stream for session ${sessionId}: `, error);
      this.dispatchEventForSession(sessionId, 'error', {
        source: 'responseStream',
        message: 'Error processing response stream',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  public async sendContentEnd(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isAudioContentStartSent) return;

    this.addEventToSessionQueue(sessionId, {
      event: {
        contentEnd: {
          promptName: session.promptName,
          contentName: session.audioContentId,
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  public async sendPromptEnd(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isPromptStartSent) return;

    this.addEventToSessionQueue(sessionId, {
      event: {
        promptEnd: {
          promptName: session.promptName
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  public async sendSessionEnd(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    this.addEventToSessionQueue(sessionId, {
      event: {
        sessionEnd: {}
      }
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    session.isActive = false;
    session.closeSignal.next();
    session.closeSignal.complete();
    this.activeSessions.delete(sessionId);
    this.sessionLastActivity.delete(sessionId);
    console.log(`Session ${sessionId} closed and removed from active sessions`);
  }

  public async closeSession(sessionId: string): Promise<void> {
    if (this.sessionCleanupInProgress.has(sessionId)) {
      console.log(`Cleanup already in progress for session ${sessionId}, skipping`);
      return;
    }
    this.sessionCleanupInProgress.add(sessionId);
    
    try {
      console.log(`Starting close process for session ${sessionId}`);
      await this.sendContentEnd(sessionId);
      await this.sendPromptEnd(sessionId);
      await this.sendSessionEnd(sessionId);
      console.log(`Session ${sessionId} cleanup complete`);
    } catch (error) {
      console.error(`Error during closing sequence for session ${sessionId}:`, error);
      
      const session = this.activeSessions.get(sessionId);
      if (session) {
        session.isActive = false;
        this.activeSessions.delete(sessionId);
        this.sessionLastActivity.delete(sessionId);
      }
    } finally {
      this.sessionCleanupInProgress.delete(sessionId);
    }
  }

  public forceCloseSession(sessionId: string): void {
    if (this.sessionCleanupInProgress.has(sessionId) || !this.activeSessions.has(sessionId)) {
      console.log(`Session ${sessionId} already being cleaned up or not active`);
      return;
    }

    this.sessionCleanupInProgress.add(sessionId);
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) return;

      console.log(`Force closing session ${sessionId}`);

      session.isActive = false;
      session.closeSignal.next();
      session.closeSignal.complete();
      this.activeSessions.delete(sessionId);
      this.sessionLastActivity.delete(sessionId);

      console.log(`Session ${sessionId} force closed`);
    } finally {
      this.sessionCleanupInProgress.delete(sessionId);
    }
  }
}
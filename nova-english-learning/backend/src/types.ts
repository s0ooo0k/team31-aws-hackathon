export interface InferenceConfig {
  readonly maxTokens: number;
  readonly topP: number;
  readonly temperature: number;
}

export type ContentType = "AUDIO" | "TEXT" | "TOOL";
export type AudioType = "SPEECH";
export type AudioMediaType = "audio/lpcm"
export type TextMediaType = "text/plain" | "application/json";

export interface AudioConfiguration {
  readonly audioType: AudioType;
  readonly mediaType: AudioMediaType;
  readonly sampleRateHertz: number;
  readonly sampleSizeBits: number;
  readonly channelCount: number;
  readonly encoding: string;
  readonly voiceId?: string;
}

export interface TextConfiguration {
  readonly mediaType: TextMediaType;
}

export interface ToolConfiguration {
  readonly toolUseId: string;
  readonly type: "TEXT";
  readonly textInputConfiguration: {
    readonly mediaType: "text/plain";
  };
}

// 영어 학습 서비스 타입 정의
export interface User {
  userId: string;
  email: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  preferredCategories: string[];
  createdAt: string;
}

export interface ImageData {
  imageId: string;
  s3Url: string;
  category: string;
  description: string;
  expectedVocabulary: string[];
  guidingQuestions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ConversationSession {
  sessionId: string;
  userId: string;
  imageId: string;
  category: string;
  startTime: string;
  endTime?: string;
  conversationHistory: ConversationMessage[];
  generatedImageUrl?: string;
  evaluation?: SessionEvaluation;
  status: 'active' | 'completed' | 'abandoned';
}

export interface ConversationMessage {
  speaker: 'user' | 'assistant';
  message: string;
  timestamp: string;
  audioUrl?: string;
}

export interface SessionEvaluation {
  descriptionQuality: 'low' | 'medium' | 'high';
  vocabularyDiversity: number;
  detailLevel: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    alternativeExpressions: string[];
  };
  score: number;
}
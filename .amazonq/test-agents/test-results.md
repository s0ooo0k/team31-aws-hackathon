# Agent 테스트 결과

## 테스트 #1: ProductManager

**명령어:** `@ProductManager 영어 초급자를 위한 이미지 기반 학습 시나리오를 3개 만들어주세요.`

**결과:**

### 시나리오 1: 카페에서 주문하기 (Ordering at a Cafe)

**학습 목표:** 기본적인 음식/음료 주문 표현 익히기
**난이도:** 초급 (A1-A2)

**이미지 설명:** 카페 카운터 앞에 서 있는 고객과 바리스타
**핵심 표현:**
- "I'd like a coffee, please."
- "Can I have a sandwich?"
- "How much is it?"
- "Thank you!"

**게임 요소:**
- 정확한 주문 완료 시 +10점
- 적절한 예의 표현 사용 시 +5점 보너스
- 3번의 기회 제공

**평가 기준:**
- 발음 정확도 (40%)
- 문법 정확성 (30%)
- 상황 적절성 (30%)

---

### 시나리오 2: 길 묻기 (Asking for Directions)

**학습 목표:** 위치 및 방향 관련 기본 표현 학습
**난이도:** 초급 (A1-A2)

**이미지 설명:** 거리에서 지도를 보고 있는 관광객
**핵심 표현:**
- "Excuse me, where is the subway station?"
- "How do I get to the museum?"
- "Is it far from here?"
- "Turn left/right"

**게임 요소:**
- 올바른 질문 형태 사용 시 +15점
- 예의 바른 시작/마무리 표현 시 +5점
- 힌트 기능 제공 (점수 -2점)

**평가 기준:**
- 의사소통 명확성 (50%)
- 어휘 사용 정확도 (25%)
- 발음 (25%)

---

### 시나리오 3: 자기소개하기 (Self Introduction)

**학습 목표:** 기본적인 개인 정보 소개 및 질문하기
**난이도:** 초급 (A1)

**이미지 설명:** 새로운 직장이나 학교에서 만나는 두 사람
**핵심 표현:**
- "Hi, I'm [name]. Nice to meet you."
- "I'm from Korea."
- "What's your name?"
- "Where are you from?"

**게임 요소:**
- 완전한 자기소개 완성 시 +20점
- 상대방에게 질문하기 +10점
- 자연스러운 대화 흐름 +5점 보너스

**평가 기준:**
- 정보 전달 완성도 (40%)
- 상호작용 적극성 (35%)
- 언어 정확성 (25%)

---

**공통 피드백 시스템:**
- 실시간 발음 교정 제안
- 더 자연스러운 표현 대안 제시
- 문화적 맥락 설명 포함
- 다음 레벨 학습 경로 안내

**진행 방식:**
1. 이미지 제시 및 상황 설명 (30초)
2. 학습자 응답 (60초)
3. AI 피드백 및 개선점 제시 (30초)
4. 재도전 기회 제공

---

**테스트 상태:** ✅ 완료

---

## 테스트 #2: Developer

**명령어:** `@Developer 음성 녹음 버튼이 있는 간단한 React 컴포넌트 코드를 작성해주세요.`

**결과:**

### VoiceRecorder 컴포넌트

```jsx
import React, { useState, useRef } from 'react';
import './VoiceRecorder.css';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        onRecordingComplete?.(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      // 타이머 시작
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('마이크 접근 실패:', error);
      alert('마이크 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setDuration(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-recorder">
      <div className="recorder-display">
        <div className="timer">{formatTime(duration)}</div>
        {isRecording && (
          <div className="recording-indicator">
            <span className="pulse">🔴</span> 녹음 중...
          </div>
        )}
      </div>

      <div className="recorder-controls">
        {!isRecording ? (
          <button 
            className="record-btn start" 
            onClick={startRecording}
            disabled={!!audioBlob}
          >
            🎤 녹음 시작
          </button>
        ) : (
          <button 
            className="record-btn stop" 
            onClick={stopRecording}
          >
            ⏹️ 녹음 중지
          </button>
        )}
        
        {audioBlob && (
          <button 
            className="record-btn reset" 
            onClick={resetRecording}
          >
            🔄 다시 녹음
          </button>
        )}
      </div>

      {audioBlob && (
        <div className="audio-preview">
          <audio controls src={URL.createObjectURL(audioBlob)} />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
```

### CSS 스타일 (VoiceRecorder.css)

```css
.voice-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #f9f9f9;
  max-width: 300px;
  margin: 0 auto;
}

.recorder-display {
  margin-bottom: 20px;
  text-align: center;
}

.timer {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d32f2f;
  font-weight: 500;
}

.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.recorder-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.record-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.record-btn.start {
  background: #4caf50;
  color: white;
}

.record-btn.start:hover {
  background: #45a049;
}

.record-btn.stop {
  background: #f44336;
  color: white;
}

.record-btn.stop:hover {
  background: #da190b;
}

.record-btn.reset {
  background: #2196f3;
  color: white;
}

.record-btn.reset:hover {
  background: #1976d2;
}

.record-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.audio-preview {
  width: 100%;
}

.audio-preview audio {
  width: 100%;
}
```

### 사용 예시

```jsx
import React from 'react';
import VoiceRecorder from './components/VoiceRecorder';

function App() {
  const handleRecordingComplete = (audioBlob) => {
    console.log('녹음 완료:', audioBlob);
    
    // Nova Sonic API로 전송하는 로직
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    // API 호출 예시
    // fetch('/api/process-audio', {
    //   method: 'POST',
    //   body: formData
    // });
  };

  return (
    <div className="App">
      <h1>Nova 영어 학습</h1>
      <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
    </div>
  );
}

export default App;
```

### 주요 기능

1. **마이크 권한 요청** - getUserMedia API 사용
2. **실시간 녹음 상태 표시** - 타이머 및 시각적 인디케이터
3. **녹음 제어** - 시작/중지/재녹음 버튼
4. **오디오 미리보기** - 녹음된 파일 재생 가능
5. **콜백 함수** - 녹음 완료 시 상위 컴포넌트로 데이터 전달

### 기술적 고려사항

- **브라우저 호환성**: MediaRecorder API 지원 확인 필요
- **HTTPS 필수**: 마이크 접근을 위해 보안 연결 필요
- **파일 형식**: WAV 형식으로 녹음 (Nova Sonic 호환)
- **메모리 관리**: 녹음 완료 후 스트림 정리
- **에러 처리**: 마이크 권한 거부 시 사용자 안내

**테스트 상태:** ✅ 완료

---

## 테스트 #3: CloudOps

**명령어:** `@CloudOps Lambda 함수에서 Nova Sonic을 호출하는 기본 구조를 설계해주세요.`

**결과:**

### AWS 아키텍처 설계

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Lambda        │
│   (React)       │───▶│   /process-audio │───▶│   AudioProcessor│
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   S3 Bucket     │    │   Amazon Bedrock │    │   DynamoDB      │
│   Audio Files   │◀───│   Nova Sonic     │    │   Session Data  │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Lambda 함수 구현

#### 1. 메인 핸들러 (index.js)

```javascript
const AWS = require('aws-sdk');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

// AWS 클라이언트 초기화
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));
        
        const { httpMethod, body, headers } = event;
        
        if (httpMethod !== 'POST') {
            return createResponse(405, { error: 'Method not allowed' });
        }
        
        // 멀티파트 폼 데이터 파싱
        const audioData = await parseMultipartData(body, headers['content-type']);
        
        if (!audioData) {
            return createResponse(400, { error: 'No audio data found' });
        }
        
        // 1. S3에 오디오 파일 저장
        const audioKey = await uploadAudioToS3(audioData);
        
        // 2. Nova Sonic으로 음성 처리
        const transcription = await processAudioWithNova(audioData);
        
        // 3. 세션 데이터 DynamoDB 저장
        await saveSessionData({
            sessionId: generateSessionId(),
            audioKey,
            transcription,
            timestamp: new Date().toISOString()
        });
        
        return createResponse(200, {
            success: true,
            transcription,
            audioKey,
            message: 'Audio processed successfully'
        });
        
    } catch (error) {
        console.error('Error processing audio:', error);
        return createResponse(500, {
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Nova Sonic 호출 함수
async function processAudioWithNova(audioBuffer) {
    try {
        const modelId = 'amazon.nova-micro-v1:0'; // Nova Sonic 모델 ID
        
        const requestBody = {
            inputAudio: {
                format: 'wav',
                source: {
                    bytes: audioBuffer.toString('base64')
                }
            },
            inferenceConfig: {
                maxTokens: 1000,
                temperature: 0.7
            }
        };
        
        const command = new InvokeModelCommand({
            modelId,
            contentType: 'application/json',
            body: JSON.stringify(requestBody)
        });
        
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        return {
            text: responseBody.output?.text || '',
            confidence: responseBody.confidence || 0,
            processingTime: responseBody.processingTimeMs || 0
        };
        
    } catch (error) {
        console.error('Nova Sonic processing error:', error);
        throw new Error(`Nova processing failed: ${error.message}`);
    }
}

// S3 업로드 함수
async function uploadAudioToS3(audioBuffer) {
    const key = `audio/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.wav`;
    
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: audioBuffer,
        ContentType: 'audio/wav',
        Metadata: {
            uploadTime: new Date().toISOString()
        }
    });
    
    await s3Client.send(command);
    return key;
}

// DynamoDB 저장 함수
async function saveSessionData(data) {
    const command = new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
            sessionId: { S: data.sessionId },
            audioKey: { S: data.audioKey },
            transcription: { S: JSON.stringify(data.transcription) },
            timestamp: { S: data.timestamp },
            ttl: { N: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) } // 7일 TTL
        }
    });
    
    await dynamoClient.send(command);
}

// 유틸리티 함수들
function createResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(body)
    };
}

function generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function parseMultipartData(body, contentType) {
    // 멀티파트 데이터 파싱 로직
    // 실제 구현에서는 multipart 라이브러리 사용 권장
    const boundary = contentType.split('boundary=')[1];
    const parts = body.split(`--${boundary}`);
    
    for (const part of parts) {
        if (part.includes('Content-Type: audio/')) {
            const audioStart = part.indexOf('\r\n\r\n') + 4;
            return Buffer.from(part.substring(audioStart), 'binary');
        }
    }
    return null;
}
```

#### 2. 환경 변수 설정

```bash
# Lambda 환경 변수
AWS_REGION=us-east-1
S3_BUCKET_NAME=nova-english-audio-bucket
DYNAMODB_TABLE_NAME=nova-sessions
BEDROCK_MODEL_ID=amazon.nova-micro-v1:0
MAX_AUDIO_SIZE=10485760  # 10MB
AUDIO_TIMEOUT=30000      # 30초
```

#### 3. IAM 역할 정책

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": "arn:aws:bedrock:*:*:model/amazon.nova-*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::nova-english-audio-bucket/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/nova-sessions"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

#### 4. CloudFormation 템플릿 (infrastructure.yaml)

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  # Lambda 함수
  AudioProcessorFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: nova-audio-processor
      Runtime: nodejs18.x
      Handler: index.handler
      Timeout: 30
      MemorySize: 512
      Environment:
        Variables:
          S3_BUCKET_NAME: !Ref AudioBucket
          DYNAMODB_TABLE_NAME: !Ref SessionTable
          AWS_REGION: !Ref AWS::Region
      Policies:
        - S3CrudPolicy:
            BucketName: !Ref AudioBucket
        - DynamoDBCrudPolicy:
            TableName: !Ref SessionTable
        - Statement:
            Effect: Allow
            Action: bedrock:InvokeModel
            Resource: 'arn:aws:bedrock:*:*:model/amazon.nova-*'
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /process-audio
            Method: post

  # S3 버킷
  AudioBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${AWS::StackName}-audio-bucket'
      LifecycleConfiguration:
        Rules:
          - Status: Enabled
            ExpirationInDays: 7
      CorsConfiguration:
        CorsRules:
          - AllowedHeaders: ['*']
            AllowedMethods: [GET, POST, PUT]
            AllowedOrigins: ['*']

  # DynamoDB 테이블
  SessionTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub '${AWS::StackName}-sessions'
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: sessionId
          AttributeType: S
      KeySchema:
        - AttributeName: sessionId
          KeyType: HASH
      TimeToLiveSpecification:
        AttributeName: ttl
        Enabled: true

Outputs:
  ApiEndpoint:
    Description: 'API Gateway endpoint URL'
    Value: !Sub 'https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/process-audio'
```

### 배포 및 모니터링

#### 배포 스크립트
```bash
#!/bin/bash
# deploy.sh

# SAM 빌드 및 배포
sam build
sam deploy --guided --stack-name nova-english-service

# 환경 변수 확인
aws lambda get-function-configuration --function-name nova-audio-processor
```

#### CloudWatch 모니터링
```javascript
// 메트릭 전송 함수
const cloudwatch = new AWS.CloudWatch();

async function sendMetrics(metricName, value, unit = 'Count') {
    const params = {
        Namespace: 'NovaEnglishService',
        MetricData: [{
            MetricName: metricName,
            Value: value,
            Unit: unit,
            Timestamp: new Date()
        }]
    };
    
    await cloudwatch.putMetricData(params).promise();
}
```

### 성능 최적화 고려사항

1. **Lambda 최적화**
   - 메모리: 512MB (Nova 처리용)
   - 타임아웃: 30초
   - 동시 실행: 100개 제한

2. **비용 관리**
   - S3 Lifecycle 정책 (7일 후 삭제)
   - DynamoDB TTL 설정
   - Lambda 예약 동시성 설정

3. **보안**
   - API Gateway에서 요청 크기 제한
   - IAM 최소 권한 원칙
   - VPC 엔드포인트 사용 (선택사항)

4. **확장성**
   - SQS를 통한 비동기 처리
   - Step Functions로 워크플로우 관리
   - CloudFront CDN 적용

**테스트 상태:** ✅ 완료
**다음 테스트:** QATester Agent
# API 명세서

## 1. API 개요

### 1.1 기본 정보
- **Base URL**: `https://api.nova-english.com/v1`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`
- **Rate Limit**: 100 requests/minute per user

### 1.2 공통 응답 형식

#### 성공 응답
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 2. 인증 API

### 2.1 사용자 로그인

#### POST /auth/login
사용자 로그인 처리

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "level": 2,
      "totalScore": 1250
    }
  }
}
```

### 2.2 토큰 갱신

#### POST /auth/refresh
JWT 토큰 갱신

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

## 3. 게임 API

### 3.1 게임 세션 시작

#### POST /game/start
새로운 게임 세션 시작

**Request Body:**
```json
{
  "level": "beginner",
  "category": "daily_life",
  "customPrompt": "A scene at a coffee shop"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session123",
    "imageUrl": "https://s3.amazonaws.com/images/generated123.jpg",
    "correctScript": "There is a red car parked in front of a blue house...",
    "hints": [
      "Describe the colors you see",
      "What objects are in the foreground?"
    ],
    "timeLimit": 300
  }
}
```

### 3.2 게임 세션 정보 조회

#### GET /game/session/{sessionId}
특정 게임 세션 정보 조회

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session123",
    "status": "in_progress",
    "imageUrl": "https://s3.amazonaws.com/images/generated123.jpg",
    "startTime": "2024-01-01T10:00:00Z",
    "conversation": [
      {
        "type": "user",
        "message": "I see a red car",
        "timestamp": "2024-01-01T10:01:00Z"
      },
      {
        "type": "ai",
        "message": "What color is the house behind the car?",
        "timestamp": "2024-01-01T10:01:05Z"
      }
    ]
  }
}
```

### 3.3 게임 완료

#### POST /game/session/{sessionId}/complete
게임 세션 완료 및 점수 계산

**Request Body:**
```json
{
  "finalResponse": "Complete description of the image..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session123",
    "finalScore": 85,
    "breakdown": {
      "grammar": 80,
      "vocabulary": 90,
      "fluency": 85,
      "completeness": 85
    },
    "feedback": {
      "strengths": ["Good vocabulary usage", "Clear pronunciation"],
      "improvements": ["Work on past tense", "Add more details"],
      "nextLevel": "intermediate"
    },
    "achievements": ["First Perfect Score", "Grammar Master"]
  }
}
```

## 4. 대화 API

### 4.1 메시지 전송

#### POST /conversation/message
사용자 메시지 전송 및 AI 응답 받기

**Request Body:**
```json
{
  "sessionId": "session123",
  "message": "I see a red car in front of a house",
  "messageType": "text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "aiResponse": "That's great! What color is the house?",
    "suggestions": [
      "The house is blue",
      "I can see a blue house",
      "There's a blue building"
    ],
    "feedback": {
      "grammar": "correct",
      "vocabulary": "good",
      "suggestions": ["Try using more descriptive words"]
    }
  }
}
```

### 4.2 대화 히스토리 조회

#### GET /conversation/history/{sessionId}
특정 세션의 대화 히스토리 조회

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session123",
    "messages": [
      {
        "id": "msg1",
        "type": "user",
        "content": "I see a red car",
        "timestamp": "2024-01-01T10:01:00Z",
        "analysis": {
          "grammar_score": 100,
          "vocabulary_level": "beginner"
        }
      },
      {
        "id": "msg2",
        "type": "ai",
        "content": "What color is the house?",
        "timestamp": "2024-01-01T10:01:05Z"
      }
    ]
  }
}
```

## 5. 사용자 API

### 5.1 사용자 프로필 조회

#### GET /user/profile
현재 사용자 프로필 정보 조회

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "username": "john_doe",
    "level": "intermediate",
    "totalScore": 2450,
    "gamesPlayed": 25,
    "averageScore": 78,
    "strengths": ["vocabulary", "pronunciation"],
    "weaknesses": ["grammar", "complex_sentences"],
    "achievements": [
      {
        "id": "first_game",
        "name": "First Steps",
        "description": "Complete your first game",
        "earnedAt": "2024-01-01T10:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "lastActive": "2024-01-01T15:30:00Z"
  }
}
```

### 5.2 사용자 프로필 업데이트

#### PUT /user/profile
사용자 프로필 정보 업데이트

**Request Body:**
```json
{
  "username": "new_username",
  "preferences": {
    "difficulty": "intermediate",
    "categories": ["daily_life", "travel", "business"],
    "notifications": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully"
  }
}
```

### 5.3 학습 통계 조회

#### GET /user/statistics
사용자 학습 통계 조회

**Query Parameters:**
- `period`: `week` | `month` | `year` | `all` (default: `month`)
- `category`: 특정 카테고리 필터링 (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalGames": 15,
    "totalTime": 450,
    "averageScore": 82,
    "scoreProgress": [
      {"date": "2024-01-01", "score": 75},
      {"date": "2024-01-02", "score": 78},
      {"date": "2024-01-03", "score": 82}
    ],
    "categoryPerformance": {
      "daily_life": 85,
      "travel": 78,
      "business": 72
    },
    "skillBreakdown": {
      "grammar": 80,
      "vocabulary": 88,
      "fluency": 75,
      "completeness": 85
    }
  }
}
```

## 6. 이미지 생성 API

### 6.1 커스텀 이미지 생성

#### POST /image/generate
사용자 맞춤형 이미지 생성

**Request Body:**
```json
{
  "prompt": "A busy street scene with people and cars",
  "level": "intermediate",
  "style": "realistic",
  "aspectRatio": "16:9"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageId": "img123",
    "imageUrl": "https://s3.amazonaws.com/images/custom123.jpg",
    "prompt": "A busy street scene with people and cars",
    "correctScript": "Generated description based on the image...",
    "estimatedDifficulty": "intermediate",
    "generatedAt": "2024-01-01T10:00:00Z"
  }
}
```

### 6.2 이미지 히스토리 조회

#### GET /image/history
사용자가 생성한 이미지 히스토리 조회

**Query Parameters:**
- `limit`: 결과 개수 제한 (default: 20, max: 100)
- `offset`: 페이지네이션 오프셋 (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "imageId": "img123",
        "imageUrl": "https://s3.amazonaws.com/images/custom123.jpg",
        "prompt": "A busy street scene",
        "createdAt": "2024-01-01T10:00:00Z",
        "usedInGames": 3,
        "averageScore": 78
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

## 7. 리더보드 API

### 7.1 글로벌 리더보드 조회

#### GET /leaderboard/global
전체 사용자 리더보드 조회

**Query Parameters:**
- `period`: `daily` | `weekly` | `monthly` | `all` (default: `weekly`)
- `limit`: 결과 개수 (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "weekly",
    "rankings": [
      {
        "rank": 1,
        "userId": "user456",
        "username": "top_player",
        "score": 2850,
        "gamesPlayed": 12,
        "averageScore": 95
      },
      {
        "rank": 2,
        "userId": "user789",
        "username": "english_master",
        "score": 2720,
        "gamesPlayed": 15,
        "averageScore": 91
      }
    ],
    "userRank": {
      "rank": 25,
      "score": 1850,
      "gamesPlayed": 8
    }
  }
}
```

## 8. 에러 코드

### 8.1 인증 관련 에러
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Invalid token format
- `AUTH_004`: User not found

### 8.2 게임 관련 에러
- `GAME_001`: Session not found
- `GAME_002`: Session already completed
- `GAME_003`: Invalid game level
- `GAME_004`: Image generation failed

### 8.3 대화 관련 에러
- `CONV_001`: Invalid message format
- `CONV_002`: AI service unavailable
- `CONV_003`: Message too long
- `CONV_004`: Rate limit exceeded

### 8.4 사용자 관련 에러
- `USER_001`: User not found
- `USER_002`: Invalid user data
- `USER_003`: Profile update failed
- `USER_004`: Permission denied

### 8.5 시스템 에러
- `SYS_001`: Internal server error
- `SYS_002`: Database connection failed
- `SYS_003`: External service unavailable
- `SYS_004`: Rate limit exceeded

## 9. 웹소켓 API

### 9.1 실시간 대화 연결

#### WebSocket Endpoint
`wss://api.nova-english.com/v1/ws/conversation`

#### 연결 인증
```json
{
  "type": "auth",
  "token": "jwt_token_here"
}
```

#### 메시지 전송
```json
{
  "type": "message",
  "sessionId": "session123",
  "content": "I see a red car",
  "timestamp": "2024-01-01T10:01:00Z"
}
```

#### AI 응답 수신
```json
{
  "type": "response",
  "sessionId": "session123",
  "content": "What color is the house?",
  "suggestions": ["The house is blue"],
  "timestamp": "2024-01-01T10:01:05Z"
}
```

## 10. SDK 사용 예시

### 10.1 JavaScript SDK

```javascript
import { NovaEnglishAPI } from 'nova-english-sdk';

const api = new NovaEnglishAPI({
  baseURL: 'https://api.nova-english.com/v1',
  token: 'your_jwt_token'
});

// 게임 시작
const session = await api.game.start({
  level: 'beginner',
  category: 'daily_life'
});

// 메시지 전송
const response = await api.conversation.sendMessage({
  sessionId: session.sessionId,
  message: 'I see a red car'
});

// 게임 완료
const result = await api.game.complete({
  sessionId: session.sessionId,
  finalResponse: 'Complete description...'
});
```

### 10.2 Python SDK

```python
from nova_english import NovaEnglishClient

client = NovaEnglishClient(
    base_url='https://api.nova-english.com/v1',
    token='your_jwt_token'
)

# 게임 시작
session = client.game.start(
    level='beginner',
    category='daily_life'
)

# 메시지 전송
response = client.conversation.send_message(
    session_id=session['sessionId'],
    message='I see a red car'
)

# 게임 완료
result = client.game.complete(
    session_id=session['sessionId'],
    final_response='Complete description...'
)
```
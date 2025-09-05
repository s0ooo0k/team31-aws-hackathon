# Nova 영어 학습 서비스 API 명세서

**작성자**: Developer Agent  
**작성일**: 2025년 1월  
**버전**: 1.0  
**Base URL**: `https://api.nova-english.com/v1`

---

## 1. API 개요

### 1.1 인증 방식
- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`
- **Token Expiry**: 24시간
- **Refresh Token**: 7일

### 1.2 공통 응답 형식
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

### 1.3 에러 응답 형식
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

---

## 2. 인증 API

### 2.1 사용자 등록
```http
POST /auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "홍길동",
  "preferredLanguage": "ko",
  "learningGoals": ["conversation", "business"],
  "currentLevel": "beginner"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456",
    "email": "user@example.com",
    "name": "홍길동",
    "emailVerificationRequired": true
  },
  "message": "User registered successfully"
}
```

### 2.2 사용자 로그인
```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400,
    "user": {
      "userId": "user_123456",
      "email": "user@example.com",
      "name": "홍길동",
      "level": "beginner"
    }
  },
  "message": "Login successful"
}
```

### 2.3 토큰 갱신
```http
POST /auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
}
```

---

## 3. 사용자 관리 API

### 3.1 프로필 조회
```http
GET /user/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456",
    "email": "user@example.com",
    "name": "홍길동",
    "profileImage": "https://cdn.nova-english.com/profiles/user_123456.jpg",
    "currentLevel": "intermediate",
    "totalScore": 1250,
    "streakDays": 7,
    "joinedAt": "2025-01-01T00:00:00Z",
    "preferences": {
      "language": "ko",
      "notifications": true,
      "learningGoals": ["conversation", "business"],
      "studyTime": "evening"
    },
    "statistics": {
      "totalSessions": 45,
      "totalStudyTime": 1800,
      "averageAccuracy": 85.5,
      "completedLessons": 23
    }
  }
}
```

### 3.2 프로필 업데이트
```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "홍길동",
  "preferences": {
    "language": "ko",
    "notifications": true,
    "learningGoals": ["conversation", "travel"],
    "studyTime": "morning"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456",
    "updatedFields": ["name", "preferences"],
    "updatedAt": "2025-01-15T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

## 4. 학습 세션 API

### 4.1 학습 세션 시작
```http
POST /learning/session/start
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sessionType": "image_description",
  "difficulty": "intermediate",
  "topic": "daily_life",
  "duration": 600
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_789012",
    "sessionType": "image_description",
    "startTime": "2025-01-15T10:30:00Z",
    "estimatedDuration": 600,
    "initialContent": {
      "imageUrl": "https://cdn.nova-english.com/generated/img_123.jpg",
      "prompt": "Describe what you see in this image",
      "expectedKeywords": ["kitchen", "cooking", "family"]
    }
  },
  "message": "Learning session started"
}
```

### 4.2 음성 처리 (Nova Sonic)
```http
POST /learning/session/{sessionId}/audio
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
audio: <audio_file.wav>
timestamp: 1642234567
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transcription": {
      "text": "I can see a family cooking together in the kitchen",
      "confidence": 0.95,
      "duration": 3.2
    },
    "analysis": {
      "accuracy": 88,
      "pronunciation": {
        "overall": 85,
        "issues": [
          {
            "word": "together",
            "expected": "/təˈɡeðər/",
            "actual": "/təˈɡezər/",
            "suggestion": "Focus on the 'th' sound"
          }
        ]
      },
      "grammar": {
        "score": 90,
        "suggestions": []
      },
      "vocabulary": {
        "score": 85,
        "usedWords": ["family", "cooking", "kitchen"],
        "missedKeywords": ["together", "preparing"]
      }
    },
    "aiResponse": {
      "text": "Great description! Can you tell me what they might be cooking?",
      "audioUrl": "https://cdn.nova-english.com/audio/response_456.mp3"
    },
    "score": 88
  }
}
```

### 4.3 이미지 생성 요청
```http
POST /learning/content/generate-image
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "A family having breakfast in a modern kitchen",
  "style": "realistic",
  "difficulty": "intermediate",
  "tags": ["family", "breakfast", "kitchen"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "imageId": "img_345678",
    "imageUrl": "https://cdn.nova-english.com/generated/img_345678.jpg",
    "thumbnailUrl": "https://cdn.nova-english.com/generated/thumb_345678.jpg",
    "metadata": {
      "prompt": "A family having breakfast in a modern kitchen",
      "style": "realistic",
      "generatedAt": "2025-01-15T10:30:00Z",
      "tags": ["family", "breakfast", "kitchen"],
      "expectedVocabulary": ["breakfast", "cereal", "milk", "table", "morning"]
    }
  },
  "message": "Image generated successfully"
}
```

### 4.4 학습 세션 종료
```http
POST /learning/session/{sessionId}/end
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "feedback": {
    "difficulty": "appropriate",
    "enjoyment": 4,
    "comments": "Great session, learned new vocabulary"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_789012",
    "endTime": "2025-01-15T10:40:00Z",
    "duration": 600,
    "summary": {
      "totalScore": 425,
      "averageAccuracy": 85,
      "wordsLearned": 8,
      "pronunciationImprovement": 12,
      "achievements": ["first_perfect_sentence", "vocabulary_master"]
    },
    "nextRecommendation": {
      "sessionType": "conversation",
      "topic": "restaurant",
      "difficulty": "intermediate"
    }
  },
  "message": "Session completed successfully"
}
```

---

## 5. 학습 진도 API

### 5.1 학습 진도 조회
```http
GET /learning/progress
Authorization: Bearer <token>
```

**Query Parameters:**
- `period`: `daily` | `weekly` | `monthly` (default: `weekly`)
- `startDate`: `2025-01-01` (optional)
- `endDate`: `2025-01-31` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "currentLevel": "intermediate",
    "overallProgress": {
      "totalScore": 1250,
      "streakDays": 7,
      "totalSessions": 45,
      "totalStudyTime": 1800,
      "averageAccuracy": 85.5
    },
    "skillBreakdown": {
      "pronunciation": {
        "level": "intermediate",
        "score": 82,
        "progress": 15
      },
      "vocabulary": {
        "level": "intermediate", 
        "score": 88,
        "progress": 22
      },
      "grammar": {
        "level": "beginner",
        "score": 75,
        "progress": 8
      },
      "conversation": {
        "level": "intermediate",
        "score": 90,
        "progress": 28
      }
    },
    "weeklyData": [
      {
        "date": "2025-01-08",
        "sessions": 3,
        "studyTime": 45,
        "score": 85,
        "accuracy": 88
      }
    ],
    "achievements": [
      {
        "id": "streak_7",
        "name": "Week Warrior",
        "description": "Study for 7 consecutive days",
        "earnedAt": "2025-01-15T10:30:00Z",
        "iconUrl": "https://cdn.nova-english.com/badges/streak_7.png"
      }
    ]
  }
}
```

### 5.2 학습 기록 조회
```http
GET /learning/history
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit`: `20` (default: 10, max: 100)
- `offset`: `0` (default: 0)
- `sessionType`: `image_description` | `conversation` | `pronunciation` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "sessionId": "session_789012",
        "sessionType": "image_description",
        "startTime": "2025-01-15T10:30:00Z",
        "endTime": "2025-01-15T10:40:00Z",
        "duration": 600,
        "score": 88,
        "accuracy": 85,
        "topic": "daily_life",
        "difficulty": "intermediate",
        "achievements": ["vocabulary_master"]
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

## 6. 콘텐츠 관리 API

### 6.1 추천 콘텐츠 조회
```http
GET /content/recommendations
Authorization: Bearer <token>
```

**Query Parameters:**
- `type`: `image` | `conversation` | `exercise` (optional)
- `difficulty`: `beginner` | `intermediate` | `advanced` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "contentId": "content_123",
        "type": "image_description",
        "title": "Restaurant Conversation",
        "description": "Practice ordering food at a restaurant",
        "difficulty": "intermediate",
        "estimatedTime": 10,
        "thumbnailUrl": "https://cdn.nova-english.com/thumbs/content_123.jpg",
        "tags": ["restaurant", "food", "ordering"],
        "matchScore": 0.95
      }
    ],
    "personalizedReason": "Based on your recent progress in conversation skills"
  }
}
```

### 6.2 파일 업로드
```http
POST /content/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <audio_or_image_file>
type: "audio" | "image"
purpose: "practice" | "profile"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "fileId": "file_456789",
    "url": "https://cdn.nova-english.com/uploads/user_123456/file_456789.wav",
    "type": "audio",
    "size": 1024000,
    "duration": 30.5,
    "uploadedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 7. 소셜 기능 API

### 7.1 친구 목록 조회
```http
GET /social/friends
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "friends": [
      {
        "userId": "user_234567",
        "name": "김영희",
        "profileImage": "https://cdn.nova-english.com/profiles/user_234567.jpg",
        "level": "intermediate",
        "currentStreak": 5,
        "lastActive": "2025-01-15T09:00:00Z",
        "isOnline": true
      }
    ],
    "totalCount": 12
  }
}
```

### 7.2 리더보드 조회
```http
GET /social/leaderboard
Authorization: Bearer <token>
```

**Query Parameters:**
- `period`: `daily` | `weekly` | `monthly` (default: `weekly`)
- `scope`: `friends` | `global` (default: `friends`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user_234567",
        "name": "김영희",
        "profileImage": "https://cdn.nova-english.com/profiles/user_234567.jpg",
        "score": 1580,
        "change": "+2"
      }
    ],
    "userRank": {
      "rank": 5,
      "score": 1250,
      "change": "+1"
    },
    "period": "weekly"
  }
}
```

---

## 8. 에러 코드

### 8.1 HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `429`: 요청 한도 초과
- `500`: 서버 오류

### 8.2 커스텀 에러 코드
```json
{
  "VALIDATION_ERROR": "입력 데이터 검증 실패",
  "AUTHENTICATION_FAILED": "인증 실패",
  "TOKEN_EXPIRED": "토큰 만료",
  "INSUFFICIENT_PERMISSIONS": "권한 부족",
  "RESOURCE_NOT_FOUND": "리소스를 찾을 수 없음",
  "RATE_LIMIT_EXCEEDED": "요청 한도 초과",
  "NOVA_API_ERROR": "Nova API 호출 실패",
  "AUDIO_PROCESSING_FAILED": "음성 처리 실패",
  "IMAGE_GENERATION_FAILED": "이미지 생성 실패",
  "SESSION_EXPIRED": "세션 만료",
  "INVALID_AUDIO_FORMAT": "지원하지 않는 오디오 형식",
  "FILE_TOO_LARGE": "파일 크기 초과",
  "QUOTA_EXCEEDED": "사용량 한도 초과"
}
```

---

## 9. 요청 제한

### 9.1 Rate Limiting
- **일반 API**: 100 requests/minute per user
- **음성 처리**: 20 requests/minute per user  
- **이미지 생성**: 10 requests/minute per user
- **파일 업로드**: 5 requests/minute per user

### 9.2 파일 크기 제한
- **오디오 파일**: 최대 10MB, 60초
- **이미지 파일**: 최대 5MB
- **프로필 이미지**: 최대 2MB

---

## 10. SDK 및 예제

### 10.1 JavaScript SDK 예제
```javascript
import NovaEnglishAPI from 'nova-english-sdk';

const client = new NovaEnglishAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.nova-english.com/v1'
});

// 학습 세션 시작
const session = await client.learning.startSession({
  sessionType: 'image_description',
  difficulty: 'intermediate'
});

// 음성 처리
const result = await client.learning.processAudio(
  session.sessionId, 
  audioFile
);
```

### 10.2 Python SDK 예제
```python
from nova_english import NovaEnglishClient

client = NovaEnglishClient(
    api_key='your-api-key',
    base_url='https://api.nova-english.com/v1'
)

# 사용자 프로필 조회
profile = client.user.get_profile()

# 학습 진도 조회
progress = client.learning.get_progress(period='weekly')
```

---

**문서 승인**: ProjectLead Agent 검토 필요  
**다음 문서**: 개발 가이드 작성
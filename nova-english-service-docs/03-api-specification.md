# Nova 영어 학습 서비스 API 명세서

**프로젝트명**: Nova English Learning Service  
**작성일**: 2025년 1월  
**버전**: 2.0  
**작성자**: Backend Developer

---

## 1. API 개요

### 1.1 기본 정보
```yaml
Base URL: https://api.nova-english.com
API Version: v1
Protocol: HTTPS
Authentication: JWT Bearer Token
Content-Type: application/json
```

### 1.2 인증 방식
```yaml
Authentication Type: JWT Bearer Token
Token Location: Authorization Header
Format: "Bearer <jwt_token>"
Token Expiry: 24 hours
Refresh Token: 30 days
```

### 1.3 응답 형식
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

### 1.4 오류 응답 형식
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

### 2.1 사용자 회원가입
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "profile": {
    "level": "beginner",
    "interests": ["travel", "business"],
    "goals": ["conversation", "pronunciation"],
    "timezone": "Asia/Seoul"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "message": "User registered successfully. Please verify your email."
}
```

### 2.2 사용자 로그인
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "userId": "user_123456789",
      "email": "user@example.com",
      "name": "John Doe",
      "profile": {
        "level": "beginner",
        "interests": ["travel", "business"]
      }
    }
  },
  "message": "Login successful"
}
```

### 2.3 토큰 갱신
```http
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### 2.4 로그아웃
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 3. 사용자 관리 API

### 3.1 사용자 프로필 조회
```http
GET /api/v1/users/profile
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "profile": {
      "level": "beginner",
      "interests": ["travel", "business"],
      "goals": ["conversation", "pronunciation"],
      "timezone": "Asia/Seoul",
      "dailyGoal": 30,
      "streakDays": 5
    },
    "stats": {
      "totalSessions": 25,
      "totalMinutes": 450,
      "averageScore": 78.5,
      "lastSessionAt": "2025-01-14T15:30:00Z"
    },
    "createdAt": "2025-01-01T10:00:00Z",
    "lastLoginAt": "2025-01-15T09:00:00Z"
  }
}
```

### 3.2 사용자 프로필 업데이트
```http
PUT /api/v1/users/profile
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "profile": {
    "level": "intermediate",
    "interests": ["travel", "business", "culture"],
    "goals": ["fluency", "business_english"],
    "dailyGoal": 45
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456789",
    "name": "John Smith",
    "profile": {
      "level": "intermediate",
      "interests": ["travel", "business", "culture"],
      "goals": ["fluency", "business_english"],
      "dailyGoal": 45
    },
    "updatedAt": "2025-01-15T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

## 4. 카테고리 및 이미지 API

### 4.1 카테고리 목록 조회
```http
GET /api/v1/categories
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "daily_life",
        "name": "Daily Life",
        "description": "Everyday situations and activities",
        "imageCount": 5,
        "icon": "🏠"
      },
      {
        "id": "travel",
        "name": "Travel",
        "description": "Travel and tourism scenarios",
        "imageCount": 5,
        "icon": "✈️"
      }
    ]
  }
}
```

### 4.2 카테고리별 이미지 조회
```http
GET /api/v1/categories/{category}/images
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "category": "daily_life",
    "images": [
      {
        "imageId": "daily_001",
        "title": "Family Morning Routine",
        "url": "https://nova-images.s3.amazonaws.com/daily_001.jpg",
        "description": "A busy family kitchen during morning rush hour",
        "conversationObjectives": [
          "Describe multiple simultaneous actions",
          "Use present continuous tense",
          "Family relationship vocabulary"
        ],
        "estimatedDuration": "10-15 minutes",
        "complexity": "intermediate"
      }
    ]
  }
}
```





---

## 5. 대화 세션 API

### 5.1 대화 세션 시작
```http
POST /api/v1/conversations/start
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "imageId": "daily_001",
  "category": "daily_life"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "sessionId": "conv_123456789",
    "imageId": "daily_001",
    "imageUrl": "https://nova-images.s3.amazonaws.com/daily_001.jpg",
    "imageTitle": "Family Morning Routine",
    "category": "daily_life",
    "startTime": "2025-01-15T10:30:00Z",
    "conversationObjectives": [
      "Describe multiple simultaneous actions",
      "Use present continuous tense"
    ],
    "websocketUrl": "wss://api.nova-english.com/ws/conversations/conv_123456789",
    "status": "active"
  },
  "message": "Conversation session started"
}
```





### 5.2 실시간 대화 (WebSocket)
```
WebSocket URL: wss://api.nova-english.com/ws/conversations/{sessionId}
Authorization: Bearer <access_token>
```

**Connection Message:**
```json
{
  "type": "start_conversation",
  "imageId": "daily_001",
  "userId": "user_123456789",
  "category": "daily_life"
}
```

**User Voice Message:**
```json
{
  "type": "user_voice",
  "audio": "base64_encoded_audio_data",
  "imageContext": {
    "imageId": "daily_001",
    "title": "Family Morning Routine"
  },
  "conversationHistory": [],
  "conversationStage": "opening"
}
```

**Nova Response Message:**
```json
{
  "type": "nova_message",
  "data": {
    "audioUrl": "https://nova-audio.s3.amazonaws.com/nova_resp_123.wav",
    "text": "What's the first thing you notice in this kitchen scene?",
    "transcription": "I see a family having breakfast",
    "nextQuestion": "Can you tell me more about what each person is doing?"
  },
  "timestamp": "2025-01-15T10:33:00Z"
}
```

### 5.3 대화 종료
```http
POST /api/v1/conversations/{sessionId}/complete
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "userFeedback": {
    "difficulty": "appropriate",
    "enjoyment": 4,
    "comments": "Great conversation, very natural flow"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "conv_123456789",
    "summary": {
      "duration": 900,
      "totalTurns": 12,
      "conversationQuality": 85,
      "highlights": [
        "Described scene with great detail",
        "Used varied vocabulary naturally",
        "Maintained conversation flow well"
      ],
      "nextRecommendations": [
        "Try travel category for new vocabulary",
        "Focus on past tense storytelling"
      ]
    },
    "achievements": {
      "conversationStreak": 5,
      "newVocabularyUsed": 8,
      "engagementLevel": "high"
    },
    "completedAt": "2025-01-15T10:45:00Z"
  }
}
```

---

## 6. 대화 진도 API

### 6.1 대화 통계 조회
```http
GET /api/v1/progress/stats
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
period: string (optional) - daily, weekly, monthly (default: weekly)
startDate: string (optional) - ISO 8601 date
endDate: string (optional) - ISO 8601 date
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "weekly",
    "dateRange": {
      "start": "2025-01-08T00:00:00Z",
      "end": "2025-01-15T23:59:59Z"
    },
    "summary": {
      "totalConversations": 12,
      "totalMinutes": 360,
      "averageEngagement": 85,
      "conversationStreak": 5,
      "completionRate": 92
    },
    "dailyStats": [
      {
        "date": "2025-01-15",
        "conversations": 2,
        "minutes": 45,
        "engagement": 88,
        "categories": ["daily_life", "travel"]
      }
    ],
    "categoryProgress": [
      {
        "category": "daily_life",
        "conversations": 8,
        "averageEngagement": 84,
        "improvement": 12
      }
    ],
    "conversationSkills": {
      "descriptiveDetail": {
        "current": 78,
        "change": 8,
        "trend": "improving"
      },
      "vocabularyDiversity": {
        "current": 85,
        "change": 15,
        "trend": "improving"
      },
      "conversationFlow": {
        "current": 82,
        "change": 6,
        "trend": "improving"
      },
      "engagement": {
        "current": 79,
        "change": 3,
        "trend": "stable"
      }
    }
  }
}
```

### 6.2 대화 기록 조회
```http
GET /api/v1/progress/history
Authorization: Bearer <access_token>
```

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 20)
category: string (optional)
startDate: string (optional)
endDate: string (optional)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "sessionId": "conv_123456789",
        "imageId": "daily_001",
        "imageTitle": "Family Morning Routine",
        "category": "daily_life",
        "startTime": "2025-01-15T10:30:00Z",
        "endTime": "2025-01-15T10:45:00Z",
        "duration": 900,
        "metrics": {
          "totalTurns": 12,
          "engagement": 85,
          "vocabularyDiversity": 78,
          "conversationFlow": 82
        },
        "highlights": [
          "Used 8 new vocabulary words",
          "Maintained natural conversation flow"
        ],
        "conversationUrl": "https://nova-audio.s3.amazonaws.com/conversations/conv_123456789.json"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

### 6.3 대화 목표 설정
```http
POST /api/v1/progress/goals
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "dailyMinutes": 30,
  "weeklyGoals": {
    "conversations": 10,
    "categories": ["daily_life", "travel", "business"]
  },
  "conversationTargets": {
    "engagement": 85,
    "vocabularyDiversity": 90,
    "conversationFlow": 88,
    "descriptiveDetail": 82
  },
  "targetDate": "2025-03-15T00:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "goalId": "goal_123456789",
    "dailyMinutes": 30,
    "weeklyGoals": {
      "conversations": 10,
      "categories": ["daily_life", "travel", "business"]
    },
    "conversationTargets": {
      "engagement": 85,
      "vocabularyDiversity": 90,
      "conversationFlow": 88,
      "descriptiveDetail": 82
    },
    "targetDate": "2025-03-15T00:00:00Z",
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "message": "Conversation goals set successfully"
}
```

---

## 7. 추천 시스템 API

### 7.1 개인화 추천 조회
```http
GET /api/v1/recommendations
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "nextSession": {
      "imageId": "img_987654321",
      "category": "travel",
      "difficulty": "beginner",
      "reason": "Based on your interest in travel vocabulary",
      "estimatedDuration": 15
    },
    "skillFocus": {
      "skill": "pronunciation",
      "reason": "Your pronunciation score can be improved",
      "recommendedExercises": [
        "Minimal pairs practice",
        "Stress pattern exercises"
      ]
    },
    "vocabularyExpansion": {
      "category": "daily_life",
      "newWords": ["grocery shopping", "household chores", "family activities"],
      "difficulty": "intermediate"
    },
    "weakAreas": [
      {
        "area": "past tense usage",
        "score": 65,
        "improvement": "Practice storytelling with past events"
      }
    ]
  }
}
```

### 7.2 유사한 사용자 추천
```http
GET /api/v1/recommendations/similar-users
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "similarUsers": [
      {
        "userId": "user_987654321",
        "name": "Jane Smith",
        "level": "beginner",
        "commonInterests": ["travel", "business"],
        "averageScore": 84,
        "studyStreak": 12
      }
    ],
    "popularContent": [
      {
        "imageId": "img_555666777",
        "title": "Airport Check-in",
        "category": "travel",
        "popularity": 95,
        "averageScore": 88
      }
    ]
  }
}
```

---

## 8. 관리자 API

### 8.1 시스템 상태 확인
```http
GET /api/v1/admin/health
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": "healthy",
      "s3": "healthy",
      "bedrock": "healthy",
      "cognito": "healthy"
    },
    "metrics": {
      "activeUsers": 1250,
      "activeSessions": 45,
      "apiResponseTime": 245,
      "errorRate": 0.02
    },
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

### 8.2 사용자 통계
```http
GET /api/v1/admin/users/stats
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 5000,
    "activeUsers": {
      "daily": 1200,
      "weekly": 3500,
      "monthly": 4800
    },
    "userLevels": {
      "beginner": 2500,
      "intermediate": 2000,
      "advanced": 500
    },
    "engagement": {
      "averageSessionTime": 18.5,
      "completionRate": 87,
      "retentionRate": 72
    }
  }
}
```

---

## 9. 오류 코드

### 9.1 HTTP 상태 코드
```yaml
200: OK - 요청 성공
201: Created - 리소스 생성 성공
202: Accepted - 비동기 작업 시작
400: Bad Request - 잘못된 요청
401: Unauthorized - 인증 실패
403: Forbidden - 권한 없음
404: Not Found - 리소스 없음
409: Conflict - 리소스 충돌
422: Unprocessable Entity - 유효성 검사 실패
429: Too Many Requests - 요청 제한 초과
500: Internal Server Error - 서버 오류
503: Service Unavailable - 서비스 이용 불가
```

### 9.2 애플리케이션 오류 코드
```yaml
AUTH_001: Invalid credentials
AUTH_002: Token expired
AUTH_003: Token invalid
AUTH_004: User not found
AUTH_005: Email not verified

USER_001: User already exists
USER_002: Invalid user data
USER_003: Profile update failed

SESSION_001: Session not found
SESSION_002: Session already completed
SESSION_003: Invalid session state
SESSION_004: Audio processing failed

IMAGE_001: Image not found
IMAGE_002: Image generation failed
IMAGE_003: Invalid image format

AI_001: Bedrock service unavailable
AI_002: Model processing failed
AI_003: Invalid audio format
AI_004: Text analysis failed

SYSTEM_001: Database connection failed
SYSTEM_002: S3 upload failed
SYSTEM_003: Rate limit exceeded
```

---

## 10. 요청 제한 (Rate Limiting)

### 10.1 API 요청 제한
```yaml
Authentication APIs:
  - Login: 5 requests/minute
  - Register: 3 requests/minute
  - Refresh: 10 requests/minute

Session APIs:
  - Create Session: 20 requests/hour
  - Submit Description: 100 requests/hour
  - Voice Upload: 50 requests/hour

Image APIs:
  - Random Image: 200 requests/hour
  - Generate Image: 10 requests/hour

General APIs:
  - Default: 1000 requests/hour
```

### 10.2 파일 업로드 제한
```yaml
Audio Files:
  - Max Size: 10MB
  - Formats: WAV, MP3, M4A
  - Max Duration: 5 minutes

Image Files:
  - Max Size: 5MB
  - Formats: JPG, PNG, WEBP
  - Max Resolution: 2048x2048
```

이 API 명세서는 Nova 영어 학습 서비스의 모든 엔드포인트와 데이터 형식을 정의하여 프론트엔드와 백엔드 개발자 간의 원활한 협업을 지원합니다.
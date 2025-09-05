# Nova 영어 학습 서비스 프롬프트 모음

**작성자**: ProductManager Agent + QATester Agent  
**작성일**: 2025년 1월  
**버전**: 1.0

---

## 1. 프롬프트 체계 개요

### 1.1 프롬프트 분류 체계
```
프롬프트 모음 (ECS Fargate 기반)
├── 음성 대화 프롬프트 (Nova Sonic - 주요 기능)
├── 대화 데이터 처리 프롬프트
├── 학습 평가 프롬프트
├── 피드백 생성 프롬프트
└── 컨테이너 모니터링 프롬프트
```

### 1.2 난이도 체계
- **Beginner (A1-A2)**: 기초 어휘, 단순 문장
- **Intermediate (B1-B2)**: 일상 대화, 복합 문장
- **Advanced (C1-C2)**: 전문 용어, 복잡한 표현

### 1.3 상황별 카테고리
- **Daily Life**: 일상생활 (식사, 쇼핑, 교통 등)
- **Travel**: 여행 (공항, 호텔, 관광지 등)
- **Business**: 비즈니스 (회의, 프레젠테이션, 네트워킹 등)
- **Academic**: 학업 (수업, 토론, 연구 등)
- **Social**: 사교 (파티, 친구 만남, 취미 등)

---

## 2. 대화 데이터 처리 프롬프트

### 2.1 일상생활 시나리오

#### 2.1.1 초급 (Beginner)
```json
{
  "category": "daily_life",
  "difficulty": "beginner",
  "scenarios": [
    {
      "id": "daily_001",
      "title": "아침 식사",
      "conversationContext": "Family breakfast scenario for English conversation practice",
      "expectedVocabulary": ["breakfast", "cereal", "milk", "toast", "family", "morning"],
      "learningObjectives": ["식사 관련 어휘", "가족 구성원 표현", "시간 표현"],
      "sampleQuestions": [
        "What are they eating for breakfast?",
        "Who is sitting at the table?",
        "What time of day is it?"
      ]
    },
    {
      "id": "daily_002", 
      "title": "슈퍼마켓 쇼핑",
      "prompt": "A person shopping in a supermarket, pushing a shopping cart filled with groceries. Show shelves with fruits, vegetables, bread, and milk. The person is reaching for apples. Bright store lighting, clean and organized layout.",
      "expectedVocabulary": ["shopping", "supermarket", "cart", "fruits", "vegetables", "apples"],
      "learningObjectives": ["쇼핑 관련 어휘", "식품 이름", "동작 표현"],
      "sampleQuestions": [
        "Where is this person?",
        "What is in the shopping cart?",
        "What is the person buying?"
      ]
    }
  ]
}
```

#### 2.1.2 중급 (Intermediate)
```json
{
  "category": "daily_life",
  "difficulty": "intermediate", 
  "scenarios": [
    {
      "id": "daily_101",
      "title": "요리하는 가족",
      "prompt": "A multi-generational family cooking together in a modern kitchen. Grandmother teaching a teenage girl how to make pasta while parents prepare salad. Show various cooking utensils, ingredients scattered on the counter, steam rising from pots. Warm, inviting atmosphere with natural lighting.",
      "expectedVocabulary": ["cooking", "recipe", "ingredients", "utensils", "preparation", "generations"],
      "learningObjectives": ["요리 과정 설명", "가족 관계 표현", "현재진행형 사용"],
      "sampleQuestions": [
        "What is the grandmother teaching?",
        "How many people are cooking?",
        "Describe the cooking process you see."
      ]
    }
  ]
}
```

### 2.2 여행 시나리오

#### 2.2.1 초급 (Beginner)
```json
{
  "category": "travel",
  "difficulty": "beginner",
  "scenarios": [
    {
      "id": "travel_001",
      "title": "공항 체크인",
      "prompt": "A traveler at an airport check-in counter talking to an airline staff member. Show the counter with computer screens, boarding passes, and luggage. The traveler is holding a passport and ticket. Modern airport terminal background with departure boards visible.",
      "expectedVocabulary": ["airport", "check-in", "passport", "ticket", "luggage", "flight"],
      "learningObjectives": ["공항 관련 어휘", "여행 절차", "기본 대화"],
      "sampleQuestions": [
        "Where is this person?",
        "What is the traveler holding?",
        "What is happening at the counter?"
      ]
    }
  ]
}
```

### 2.3 비즈니스 시나리오

#### 2.3.1 중급 (Intermediate)
```json
{
  "category": "business",
  "difficulty": "intermediate",
  "scenarios": [
    {
      "id": "business_101",
      "title": "회의실 프레젠테이션",
      "prompt": "A professional giving a presentation in a modern conference room. Show a presenter pointing at a large screen with charts and graphs, while 5-6 colleagues sit around a glass table taking notes. Laptops, coffee cups, and documents on the table. Professional lighting and corporate atmosphere.",
      "expectedVocabulary": ["presentation", "conference", "charts", "colleagues", "meeting", "professional"],
      "learningObjectives": ["비즈니스 어휘", "프레젠테이션 표현", "회의 상황"],
      "sampleQuestions": [
        "What is the person presenting about?",
        "How many people are in the meeting?",
        "Describe the meeting room setup."
      ]
    }
  ]
}
```

---

## 3. 음성 대화 프롬프트 (Nova Sonic)

### 3.1 시스템 프롬프트 템플릿

#### 3.1.1 기본 대화 시스템 프롬프트
```
You are Nova, an AI English conversation partner for Korean learners. Your role is to:

1. Engage in natural, encouraging conversations
2. Adapt your language level to the user's proficiency
3. Provide gentle corrections when needed
4. Ask follow-up questions to continue the conversation
5. Use the provided image context to guide the discussion

Current Context:
- User Level: {user_level}
- Scenario: {scenario_type}
- Image Description: {image_description}
- Learning Objectives: {learning_objectives}

Guidelines:
- Speak naturally but clearly
- Use vocabulary appropriate for {user_level} level
- Encourage the user to describe what they see
- Ask open-ended questions to promote speaking
- Provide positive reinforcement
- Gently correct major errors without interrupting flow
```

#### 3.1.2 레벨별 대화 스타일

**초급자용 (Beginner)**
```
Conversation Style for Beginner Level:
- Use simple, short sentences
- Speak slowly and clearly
- Use basic vocabulary (1000 most common words)
- Repeat key words for emphasis
- Ask yes/no questions and simple wh-questions
- Provide lots of encouragement
- Use present tense primarily

Example responses:
- "Good job! I can see a family too."
- "What color is the car?"
- "Yes, that's right! It's a big house."
```

**중급자용 (Intermediate)**
```
Conversation Style for Intermediate Level:
- Use varied sentence structures
- Introduce new vocabulary in context
- Ask more complex questions
- Encourage longer responses
- Use different tenses appropriately
- Provide explanations when needed

Example responses:
- "That's an interesting observation. Can you tell me more about what the people might be feeling?"
- "I notice you used the past tense there. In this situation, we might use the present continuous."
```

### 3.2 상황별 대화 시나리오

#### 3.2.1 레스토랑 주문 (초급)
```json
{
  "scenario": "restaurant_ordering",
  "level": "beginner",
  "system_prompt": "You are a friendly waiter in a casual restaurant. The user is a customer who wants to order food. Help them practice ordering by asking simple questions about their preferences. Use basic vocabulary and be patient.",
  "conversation_starters": [
    "Welcome to our restaurant! How can I help you today?",
    "Would you like to see our menu?",
    "What would you like to drink?"
  ],
  "key_phrases": [
    "I'd like...",
    "Can I have...?",
    "How much is...?",
    "The bill, please."
  ],
  "vocabulary_focus": ["food", "drinks", "menu", "order", "bill", "delicious"]
}
```

#### 3.2.2 직장 면접 (중급)
```json
{
  "scenario": "job_interview",
  "level": "intermediate",
  "system_prompt": "You are a professional interviewer conducting a job interview. Ask thoughtful questions about the candidate's experience, skills, and goals. Provide a supportive but professional atmosphere.",
  "conversation_starters": [
    "Thank you for coming today. Could you tell me a bit about yourself?",
    "What interests you about this position?",
    "Can you describe your previous work experience?"
  ],
  "key_phrases": [
    "I have experience in...",
    "My strengths include...",
    "I'm interested in this role because...",
    "In my previous job, I..."
  ],
  "vocabulary_focus": ["experience", "skills", "qualifications", "responsibilities", "achievements"]
}
```

---

## 4. 텍스트 생성 프롬프트 (Nova Pro)

### 4.1 ECS Fargate 기반 콘텐츠 생성

#### 4.1.1 대화 데이터 처리 프롬프트
```
Process conversation data for ECS Fargate backend:

Conversation Input:
- User Audio: {audio_transcription}
- Session Context: {session_data}
- User Level: {user_level}
- Container Instance: {ecs_task_id}

Generate response including:
1. Nova Sonic conversation response
2. Learning assessment scores
3. S3 storage metadata
4. Container performance metrics
5. Next conversation suggestions

Ensure response is optimized for:
- ECS Fargate container processing
- ALB health check compatibility
- Single AZ deployment efficiency
- S3 conversation storage format

Output format suitable for containerized microservice architecture.
```

#### 4.1.2 문법 설명 생성
```
Create a grammar explanation for Korean English learners:

Grammar Point: {grammar_topic}
User Level: {user_level}
Context: {learning_context}

Include:
1. Clear explanation of the grammar rule
2. 3 example sentences with different contexts
3. Common mistakes Korean learners make
4. Practice exercise (fill in the blank or transformation)
5. When to use vs. when not to use

Make it engaging and easy to understand for {user_level} students.
```

### 4.2 피드백 생성 프롬프트

#### 4.2.1 발음 피드백
```
Generate pronunciation feedback for an English learner:

User Input: "{user_transcription}"
Expected: "{target_text}"
User Level: {user_level}
Native Language: Korean

Analyze:
1. Pronunciation accuracy (0-100)
2. Specific sounds that need improvement
3. Korean-English pronunciation challenges
4. Encouraging feedback with specific tips
5. Practice suggestions

Provide feedback in a supportive, constructive manner that motivates continued learning.

Format:
- Overall Score: X/100
- Great job on: [specific sounds/words]
- Focus on improving: [specific areas]
- Tip: [practical advice]
- Practice: [specific exercise]
```

#### 4.2.2 문법 및 어휘 피드백
```
Provide grammar and vocabulary feedback:

User Response: "{user_input}"
Context: {conversation_context}
User Level: {user_level}

Evaluate:
1. Grammar accuracy
2. Vocabulary appropriateness
3. Sentence structure
4. Natural expression
5. Areas for improvement

Give constructive feedback that:
- Acknowledges what they did well
- Gently corrects major errors
- Suggests better alternatives
- Encourages continued practice
- Provides specific examples

Tone: Encouraging and supportive, like a patient teacher.
```

---

## 5. 학습 평가 프롬프트

### 5.1 종합 평가 시스템

#### 5.1.1 세션 종료 평가
```
Evaluate the user's learning session performance:

Session Data:
- Duration: {session_duration} minutes
- Responses: {total_responses}
- Accuracy Scores: {accuracy_scores}
- Vocabulary Used: {vocabulary_list}
- Grammar Points: {grammar_points}
- User Level: {current_level}

Generate a comprehensive evaluation including:

1. Overall Performance Score (0-100)
2. Skill Breakdown:
   - Pronunciation: X/100
   - Vocabulary: X/100  
   - Grammar: X/100
   - Fluency: X/100
   - Comprehension: X/100

3. Strengths Identified:
   - [List 2-3 specific strengths]

4. Areas for Improvement:
   - [List 2-3 specific areas with actionable advice]

5. Learning Milestones:
   - [Any progress markers reached]

6. Next Session Recommendations:
   - Suggested difficulty level
   - Recommended topics
   - Specific skills to focus on

7. Motivational Message:
   - Personalized encouragement based on progress

Format as a friendly, detailed report that celebrates progress while providing clear guidance for improvement.
```

### 5.2 진도 추적 프롬프트

#### 5.2.1 주간 진도 리포트
```
Generate a weekly progress report:

User Data:
- Sessions This Week: {weekly_sessions}
- Total Study Time: {total_minutes}
- Average Accuracy: {avg_accuracy}
- Streak Days: {streak_count}
- Topics Covered: {topics_list}
- Level Progress: {level_progress}

Create a motivating weekly summary:

1. Week Highlights:
   - Best performance moment
   - Most improved skill
   - Consistency achievement

2. Progress Metrics:
   - Visual progress indicators
   - Comparison with previous week
   - Goal achievement status

3. Learning Insights:
   - Patterns in performance
   - Optimal study times
   - Most effective activities

4. Next Week Goals:
   - Specific, achievable targets
   - Recommended focus areas
   - Challenge suggestions

5. Motivational Quote:
   - Personalized encouragement
   - Celebration of effort

Tone: Celebratory and forward-looking, emphasizing growth mindset.
```

---

## 6. 프롬프트 품질 검증 (QATester 작성)

### 6.1 프롬프트 테스트 기준

#### 6.1.1 기능적 테스트
```yaml
Prompt Quality Checklist:

Clarity:
  - ✅ Instructions are clear and unambiguous
  - ✅ Context is properly defined
  - ✅ Expected output format is specified
  - ✅ Variables are clearly marked

Effectiveness:
  - ✅ Generates appropriate responses for target level
  - ✅ Maintains educational focus
  - ✅ Encourages user engagement
  - ✅ Provides constructive feedback

Consistency:
  - ✅ Tone matches user level and context
  - ✅ Vocabulary is appropriate for difficulty
  - ✅ Response length is suitable
  - ✅ Format is consistent across similar prompts

Safety:
  - ✅ Content is appropriate for all ages
  - ✅ No biased or offensive language
  - ✅ Culturally sensitive
  - ✅ Promotes positive learning environment
```

#### 6.1.2 성능 테스트 메트릭
```json
{
  "prompt_performance_metrics": {
    "response_relevance": {
      "target": ">90%",
      "measurement": "Human evaluation of response appropriateness"
    },
    "educational_value": {
      "target": ">85%", 
      "measurement": "Learning objective achievement rate"
    },
    "user_engagement": {
      "target": ">80%",
      "measurement": "Session completion rate and user feedback"
    },
    "accuracy_consistency": {
      "target": "<5% variance",
      "measurement": "Response quality across multiple generations"
    },
    "response_time": {
      "target": "<3 seconds",
      "measurement": "Average API response time"
    }
  }
}
```

### 6.2 A/B 테스트 프레임워크

#### 6.2.1 프롬프트 변형 테스트
```json
{
  "ab_test_scenarios": [
    {
      "test_name": "conversation_starter_effectiveness",
      "variants": {
        "A": {
          "prompt": "Hello! Let's practice English together. What do you see in this image?",
          "style": "direct_question"
        },
        "B": {
          "prompt": "Hi there! I'm excited to chat with you today. This image looks interesting - what catches your eye first?",
          "style": "engaging_conversation"
        }
      },
      "success_metrics": [
        "user_response_length",
        "engagement_score", 
        "session_duration",
        "user_satisfaction"
      ],
      "test_duration": "2_weeks",
      "sample_size": "minimum_100_users_per_variant"
    }
  ]
}
```

### 6.3 품질 보증 프로세스

#### 6.3.1 프롬프트 검토 체크리스트
```markdown
## Prompt Review Checklist

### Pre-Deployment Review
- [ ] Educational objectives clearly defined
- [ ] Target audience appropriately identified  
- [ ] Language level consistency verified
- [ ] Cultural sensitivity reviewed
- [ ] Technical implementation tested
- [ ] Edge cases considered
- [ ] Fallback responses prepared

### Post-Deployment Monitoring
- [ ] User feedback collected and analyzed
- [ ] Performance metrics tracked
- [ ] Error rates monitored
- [ ] Response quality evaluated
- [ ] Continuous improvement implemented

### Quality Assurance Tests
- [ ] Automated testing for basic functionality
- [ ] Human evaluation for educational value
- [ ] User acceptance testing completed
- [ ] Accessibility compliance verified
- [ ] Performance benchmarks met
```

---

## 7. 프롬프트 버전 관리

### 7.1 버전 관리 시스템
```json
{
  "prompt_versioning": {
    "version_format": "v{major}.{minor}.{patch}",
    "change_types": {
      "major": "Breaking changes to prompt structure",
      "minor": "New features or significant improvements", 
      "patch": "Bug fixes and minor adjustments"
    },
    "approval_process": {
      "patch": "Developer review",
      "minor": "ProductManager + QATester review",
      "major": "Full team review + testing"
    }
  }
}
```

### 7.2 프롬프트 라이브러리 구조
```
prompts/
├── conversation/
│   ├── system_prompts/
│   ├── scenario_starters/
│   └── response_templates/
├── evaluation/
│   ├── feedback_generation/
│   ├── progress_assessment/
│   └── milestone_tracking/
├── content_generation/
│   ├── vocabulary_explanations/
│   ├── grammar_lessons/
│   └── exercise_creation/
└── conversation_data/
    ├── daily_life/
    ├── travel/
    └── business/
```

---

## 8. 사용 가이드라인

### 8.1 개발자를 위한 프롬프트 사용법
```typescript
// 프롬프트 사용 예시
import { PromptLibrary } from './prompts/PromptLibrary';

const promptLib = new PromptLibrary();

// 대화 데이터 프롬프트 가져오기
const conversationPrompt = promptLib.getConversationPrompt({
  category: 'daily_life',
  difficulty: 'beginner',
  scenario: 'breakfast'
});

// 대화 시스템 프롬프트 구성
const conversationPrompt = promptLib.buildConversationPrompt({
  userLevel: 'intermediate',
  scenario: 'restaurant',
  context: imageDescription
});

// 피드백 생성 프롬프트
const feedbackPrompt = promptLib.generateFeedbackPrompt({
  userInput: transcription,
  expectedResponse: targetText,
  userLevel: 'beginner'
});
```

### 8.2 ECS Fargate 기반 프롬프트 작성 가이드
```markdown
## ECS Fargate 컨테이너용 프롬프트 작성 가이드

### 1. 컨테이너 환경 고려사항
- ECS Fargate 메모리 제한 (1GB)
- ALB 헬스체크 호환성
- 단일 AZ 배포 최적화
- 컨테이너 시작 시간 최소화

### 2. 성능 최적화
- 짧고 효율적인 프롬프트 작성
- 컨텍스트 위도우 최소화
- 배치 처리 가능한 구조
- 캐시 친화적 응답 형식

### 3. 모니터링 및 로깅
- CloudWatch 메트릭 호환성
- 컨테이너 로그 최적화
- 에러 추적 가능한 구조
- 성능 지표 수집 지원

### 4. 스케일링 고려사항
- 자동 스케일링 친화적 설계
- 로드 밸런싱 최적화
- 리소스 효율적 사용
- 비용 최적화 고려
```

---

**문서 승인**: ProjectLead Agent 검토 필요  
**최종 검토**: 전체 문서 세트 완료
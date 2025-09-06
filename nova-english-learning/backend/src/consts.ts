import { AudioType, AudioMediaType, TextMediaType } from "./types";

export const DefaultInferenceConfiguration = {
  maxTokens: 1024,
  topP: 0.9,
  temperature: 0.7,
};

export const DefaultAudioInputConfiguration = {
  audioType: "SPEECH" as AudioType,
  encoding: "base64",
  mediaType: "audio/lpcm" as AudioMediaType,
  sampleRateHertz: 16000,
  sampleSizeBits: 16,
  channelCount: 1,
};

export const DefaultTextConfiguration = {
  mediaType: "text/plain" as TextMediaType,
};

export const DefaultAudioOutputConfiguration = {
  ...DefaultAudioInputConfiguration,
  sampleRateHertz: 24000,
  voiceId: "tiffany",
};

export const DefaultToolSchema = JSON.stringify({
  type: "object",
  properties: {},
  required: [],
});

export const WeatherToolSchema = JSON.stringify({
  type: "object",
  properties: {
    latitude: {
      type: "string",
      description: "Geographical WGS84 latitude of the location.",
    },
    longitude: {
      type: "string",
      description: "Geographical WGS84 longitude of the location.",
    },
  },
  required: ["latitude", "longitude"],
});

// 영어 학습용 시스템 프롬프트
export const EnglishTutorPrompt = `You are an English conversation tutor who helps users describe images in detail through spoken dialogue.

Your role:
- Ask ONE specific follow-up question at a time
- Focus on visual elements: colors, sizes, materials, emotions, atmosphere, people, objects, actions
- Guide them to use more descriptive vocabulary naturally
- Keep responses short (1-2 sentences maximum)
- Be encouraging and supportive
- Help them elaborate on details they mention

Guidelines:
- Start with encouragement about what they said
- Ask about specific visual details they haven't mentioned
- Encourage use of adjectives and descriptive language
- Help them describe spatial relationships (in front of, behind, next to)
- Ask about emotions, atmosphere, or mood when appropriate

Example conversation:
User: "I see a laptop"
You: "Great start! What color is the laptop?"

User: "It's silver"
You: "Nice! Where is the laptop placed, and what's around it?"

User: "It's on a wooden table in a coffee shop"
You: "Excellent details! How would you describe the atmosphere of the coffee shop?"`;

export const DefaultSystemPrompt = EnglishTutorPrompt;

// 증거 기반 평가를 위한 헬퍼 함수
export const createEvidenceBasedPrompt = (imageData: any, userText: string) => {
  return `${EvaluationPrompts.evidenceBasedEvaluation}

Reference Image Description:
${imageData.evaluationCriteria.detailedDescription}

Key Elements to Look For:
${imageData.evaluationCriteria.keyElements.join(", ")}

User's Description:
"${userText}"

Analyze what the user mentioned vs. what they missed, and provide specific evidence for each point.`;
};

// 카테고리별 이미지 데이터
export const ImageCategories = [
  {
    id: "animation",
    name: "Animation",
    description: "Animated characters and cartoon scenes",
    images: [
      {
        imageId: "animation_001",
        url: "https://contents-cdn.viewus.co.kr/image/2025/08/CP-2023-0089/image-49294418-b27c-4e2f-85e1-ad8842ac8047.png",
        description:
          "Three cartoon characters standing together near a window with trees and blue sky in the background.",
        expectedVocabulary: [
          "cartoon",
          "characters",
          "standing",
          "window",
          "trees",
          "sky",
          "colorful",
          "animated",
        ],
        guidingQuestions: [
          "How many characters do you see?",
          "What are they wearing?",
          "What can you see in the background?",
          "How would you describe the style?",
        ],
        evaluationCriteria: {
          keyElements: [
            "three",
            "cartoon characters",
            "standing",
            "close together",
            "glass window",
            "pink hoodie",
            "white top",
            "glasses",
            "yellow hat",
            "trees",
            "blue sky",
            "bright",
            "cheerful",
            "animated",
            "colorful",
          ],
          detailedDescription: `Three cartoon characters are standing close to each other. They are standing near a glass window. The character on the left is wearing a pink hoodie. The character in the middle is wearing a white top and glasses. The character on the right is wearing a yellow hat. Behind them, there are trees and a blue sky. The atmosphere is bright and cheerful.`,
        },
      },
    ],
  },
  {
    id: "k-pop",
    name: "K-Pop",
    description: "Korean pop culture and music scenes",
    images: [
      {
        imageId: "k-pop_001",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
        description:
          "A colorful concert stage with bright lights and performers.",
        expectedVocabulary: [
          "stage",
          "lights",
          "performers",
          "concert",
          "colorful",
          "music",
          "entertainment",
        ],
        guidingQuestions: [
          "What colors do you see on the stage?",
          "How would you describe the lighting?",
          "What is the atmosphere like?",
          "What kind of event is this?",
        ],
        evaluationCriteria: {
          keyElements: [
            "concert",
            "stage",
            "bright lights",
            "colorful",
            "performers",
            "music",
            "entertainment",
            "audience",
            "vibrant",
            "energetic",
            "spotlights",
          ],
          detailedDescription: `A vibrant concert stage with bright, colorful lights creating an energetic atmosphere. Multiple spotlights illuminate the performance area with various colors including pink, blue, and white. The stage setup suggests a K-pop or music performance with professional lighting equipment and staging.`,
        },
      },
    ],
  },
  {
    id: "animal",
    name: "Animal",
    description: "Animals and wildlife scenes",
    images: [
      {
        imageId: "animal_001",
        url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
        description:
          "A cute golden retriever dog sitting in a park with green grass and trees.",
        expectedVocabulary: [
          "dog",
          "golden retriever",
          "sitting",
          "park",
          "grass",
          "trees",
          "cute",
          "pet",
        ],
        guidingQuestions: [
          "What kind of animal do you see?",
          "What is the animal doing?",
          "Where is the animal located?",
          "How would you describe the animal's appearance?",
        ],
        evaluationCriteria: {
          keyElements: [
            "dog",
            "golden retriever",
            "sitting",
            "park",
            "green grass",
            "trees",
            "cute",
            "furry",
            "golden fur",
            "friendly",
            "outdoor",
            "nature",
          ],
          detailedDescription: `A beautiful golden retriever dog sitting peacefully in a park setting. The dog has golden, fluffy fur and appears friendly and well-groomed. The background shows green grass and trees, creating a natural outdoor environment perfect for pets and their owners.`,
        },
      },
    ],
  },
  {
    id: "AWS",
    name: "AWS",
    description: "Cloud computing and technology scenes",
    images: [
      {
        imageId: "aws_001",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500",
        description:
          "A modern data center with servers, cables, and blue lighting representing cloud infrastructure.",
        expectedVocabulary: [
          "servers",
          "data center",
          "technology",
          "cables",
          "computers",
          "cloud",
          "infrastructure",
        ],
        guidingQuestions: [
          "What technology equipment do you see?",
          "How would you describe the lighting?",
          "What is the purpose of this facility?",
          "What colors dominate the scene?",
        ],
        evaluationCriteria: {
          keyElements: [
            "data center",
            "servers",
            "technology",
            "cables",
            "blue lighting",
            "computers",
            "infrastructure",
            "modern",
            "digital",
            "cloud computing",
          ],
          detailedDescription: `A modern data center facility with rows of servers and computer equipment. Blue lighting illuminates the technological infrastructure, with numerous cables and server racks visible. The environment represents cloud computing and digital infrastructure typical of AWS and other cloud service providers.`,
        },
      },
    ],
  },
  {
    id: "social",
    name: "Social",
    description: "Social gatherings and interactions",
    images: [
      {
        imageId: "social_001",
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500",
        description:
          "Friends having dinner at a restaurant with food, drinks, and conversation.",
        expectedVocabulary: [
          "restaurant",
          "friends",
          "dinner",
          "food",
          "drinks",
          "conversation",
          "social",
        ],
        guidingQuestions: [
          "What kind of food do you see?",
          "How are the people interacting?",
          "What's the mood of the scene?",
          "How would you describe the restaurant setting?",
        ],
        evaluationCriteria: {
          keyElements: [
            "six people",
            "friends",
            "group",
            "sitting together",
            "concrete ledge",
            "arms around each other",
            "camaraderie",
            "friendship",
            "scenic viewpoint",
            "mountains",
            "cable car",
            "gondolas",
            "tourist spot",
            "landscape",
            "gray t-shirt",
            "blue cap",
            "tie-dye shirt",
            "white shirt",
            "red bag",
            "yellow shirt",
            "hats",
            "casual clothing",
            "relaxed",
            "enjoying view",
          ],
          detailedDescription: `Group of six people sitting closely together on concrete ledge at scenic viewpoint, arms around each other showing camaraderie and friendship. Background features picturesque landscape with mountains, cable car system with suspended gondolas, and partly cloudy sky. Tourist spot, possibly coastal area. People wearing casual attire: gray t-shirts, blue patterned cap, blue and yellow tie-dye shirt, white shirt, blue shirt with hat and red bag, yellow shirt with hat. Relaxed, enjoyable atmosphere suggesting late afternoon with soft, warm lighting. Strong sense of togetherness and friendship evident from body language and positioning.`,
        },
      },
    ],
  },
  {
    id: "nature",
    name: "Nature",
    description: "Natural landscapes and outdoor scenes",
    images: [
      {
        imageId: "nature_001",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500",
        description:
          "A peaceful forest path with green trees, natural lighting, and serene atmosphere.",
        expectedVocabulary: [
          "forest",
          "trees",
          "path",
          "nature",
          "outdoor",
          "peaceful",
          "green",
          "natural",
        ],
        guidingQuestions: [
          "What type of environment is this?",
          "How would you describe the trees?",
          "What does the path look like?",
          "What's the lighting like?",
        ],
        evaluationCriteria: {
          keyElements: [
            "forest",
            "woodland",
            "trees",
            "tall trees",
            "path",
            "dirt path",
            "narrow path",
            "green foliage",
            "leaves",
            "brown trunks",
            "rocks",
            "scattered rocks",
            "underbrush",
            "ground",
            "dirt",
            "sunlight",
            "dappled light",
            "shadows",
            "peaceful",
            "tranquil",
            "serene",
            "natural",
            "winding path",
            "canopy",
          ],
          detailedDescription: `A serene forest setting with narrow dirt path winding through dense woodland. Tall, slender trees with dark brown trunks and vibrant green foliage create tunnel-like canopy effect. No people visible - focus on natural environment. Path made of compacted dirt, curving as it disappears into forest. Scattered rocks of various sizes along path and among trees. Rich earthy color scheme: dark brown tree trunks, vibrant green leaves, brown and tan dirt path. Sunlight filters through trees creating dappled light on ground. Tranquil, undisturbed atmosphere suggesting midday lighting. Rough bark texture, uneven path surface, natural shadows add depth and realism.`,
        },
      },
    ],
  },
];

// 평가 기준 및 피드백 템플릿
export const EvaluationPrompts = {
  evidenceBasedEvaluation: `You are an expert English learning evaluator. Analyze the user's description and provide evidence-based feedback.

Evaluation Framework:
1. ✅ STRENGTHS - What the user did well (with specific evidence from their response)
2. 📈 IMPROVEMENTS - Areas for development (with specific examples of what was missing)
3. 💡 ALTERNATIVES - Better ways to express what they said (with concrete alternatives)

IMPORTANT: Every point must include specific evidence from the user's actual words or reference what they described/missed.

Provide response in this JSON format:
{
  "accuracy": 85,
  "completeness": 70,
  "vocabulary": 80,
  "detail": 75,
  "strengths": [
    {
      "point": "Good color description",
      "evidence": "You mentioned 'silver laptop' which shows attention to visual details"
    }
  ],
  "improvements": [
    {
      "point": "Describe people's actions",
      "evidence": "You saw people but didn't mention what they were doing (working, typing, drinking coffee)"
    }
  ],
  "alternatives": [
    {
      "original": "There are people",
      "better": "Customers are working on their laptops",
      "reason": "More specific and descriptive"
    }
  ],
  "feedback": "Overall assessment with specific examples"
}`,

  scoreCalculation: {
    accuracy: "How factually correct compared to reference image (0-100)",
    completeness: "How much of the key elements were covered (0-100)",
    vocabulary: "Quality and variety of vocabulary used (0-100)",
    detail: "Level of specific details provided (0-100)",
  },
};

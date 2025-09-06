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

export const DefaultTextConfiguration = { mediaType: "text/plain" as TextMediaType };

export const DefaultAudioOutputConfiguration = {
  ...DefaultAudioInputConfiguration,
  sampleRateHertz: 24000,
  voiceId: "tiffany",
};

export const DefaultToolSchema = JSON.stringify({
  "type": "object",
  "properties": {},
  "required": []
});

export const WeatherToolSchema = JSON.stringify({
  "type": "object",
  "properties": {
    "latitude": {
      "type": "string",
      "description": "Geographical WGS84 latitude of the location."
    },
    "longitude": {
      "type": "string",
      "description": "Geographical WGS84 longitude of the location."
    }
  },
  "required": ["latitude", "longitude"]
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
${imageData.evaluationCriteria.keyElements.join(', ')}

User's Description:
"${userText}"

Analyze what the user mentioned vs. what they missed, and provide specific evidence for each point.`;
};

// 카테고리별 이미지 데이터
export const ImageCategories = [
  {
    id: 'daily-life',
    name: 'Daily Life',
    description: 'Everyday activities and scenes',
    images: [
      {
        imageId: 'daily_001',
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500',
        description: 'A busy coffee shop with people working on laptops, warm lighting, and wooden tables.',
        expectedVocabulary: ['laptop', 'coffee shop', 'barista', 'customers', 'atmosphere', 'wooden table', 'warm lighting'],
        guidingQuestions: [
          'What color is the laptop?',
          'What are the people doing?',
          'How would you describe the atmosphere?',
          'What material is the table made of?'
        ],
        evaluationCriteria: {
          keyElements: [
            'coffee shop', 'café', 'barista', 'staff member', 'customer', 'person sitting',
            'laptop', 'computer', 'table', 'chair', 'counter', 'menu', 'chalkboard',
            'plants', 'lighting', 'industrial lights', 'warm atmosphere', 'cozy',
            'white chairs', 'colored cushions', 'wooden elements', 'modern design'
          ],
          detailedDescription: `A cozy, modern café with warm, welcoming ambiance. Two people visible: a barista in dark shirt behind counter, and a customer in dark jacket and cap sitting at table with laptop. White curved-back chairs with yellow, brown, and white cushions. White tables with modern design. Rustic counter with chalkboard menu. Large leafy plant in center, smaller potted plants on counter. Industrial-style hanging lights. Neutral color scheme with white, green plants, black chalkboard, warm cushion tones. Materials include wood (tables, chairs), metal (lighting fixtures), fabric (cushions), glass (bottles, jars). Relaxed, professional atmosphere suitable for work and socializing.`
        }
      },
      {
        imageId: 'daily_002',
        url: 'https://i.ibb.co/b5pgjy84/young-woman-arranging-her-cake-shop.jpg',
        description: 'A woman pouring tea in a cozy kitchen with wooden cabinets and warm lighting.',
        expectedVocabulary: ['woman', 'pouring', 'tea', 'kitchen', 'cabinets', 'counter', 'apron', 'cozy'],
        guidingQuestions: [
          'What is the woman doing?',
          'What is she wearing?',
          'What objects are on the counter?',
          'How would you describe the atmosphere?'
        ],
        evaluationCriteria: {
          keyElements: [
            'woman', 'pouring', 'hot water', 'glass cup', 'counter', 'white shirt', 'gray apron',
            'white cups', 'coffee filter', 'plate', 'dessert', 'wooden cabinets', 'kitchen items',
            'cozy', 'warm', 'soft lighting'
          ],
          detailedDescription: `A woman is pouring hot water into a glass cup on a counter. She is wearing a white shirt and a gray apron. The counter has a few white cups, a coffee filter, and a plate with a dessert. Behind her, there are wooden cabinets with various kitchen items. The atmosphere is cozy and warm, with soft lighting illuminating the scene.`
        }
      }
    ]
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Travel and vacation scenes',
    images: [
      {
        imageId: 'travel_001',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
        description: 'A peaceful park with green trees, walking paths, and people enjoying outdoor activities.',
        expectedVocabulary: ['park', 'trees', 'path', 'nature', 'outdoor', 'peaceful', 'green'],
        guidingQuestions: [
          'What activities are people doing?',
          'How would you describe the trees?',
          'What does the path look like?',
          'What\'s the weather like?'
        ],
        evaluationCriteria: {
          keyElements: [
            'forest', 'woodland', 'trees', 'tall trees', 'path', 'dirt path', 'narrow path',
            'green foliage', 'leaves', 'brown trunks', 'rocks', 'scattered rocks',
            'underbrush', 'ground', 'dirt', 'sunlight', 'dappled light', 'shadows',
            'peaceful', 'tranquil', 'serene', 'natural', 'winding path', 'canopy'
          ],
          detailedDescription: `A serene forest setting with narrow dirt path winding through dense woodland. Tall, slender trees with dark brown trunks and vibrant green foliage create tunnel-like canopy effect. No people visible - focus on natural environment. Path made of compacted dirt, curving as it disappears into forest. Scattered rocks of various sizes along path and among trees. Rich earthy color scheme: dark brown tree trunks, vibrant green leaves, brown and tan dirt path. Sunlight filters through trees creating dappled light on ground. Tranquil, undisturbed atmosphere suggesting midday lighting. Rough bark texture, uneven path surface, natural shadows add depth and realism.`
        }
      }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Office and work environments',
    images: [
      {
        imageId: 'business_001',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
        description: 'A modern office space with desks, computers, chairs, and people working.',
        expectedVocabulary: ['office', 'desk', 'computer', 'chair', 'modern', 'workspace', 'professional'],
        guidingQuestions: [
          'How would you describe the office design?',
          'What equipment do you see?',
          'What are the people wearing?',
          'How does the workspace look organized?'
        ],
        evaluationCriteria: {
          keyElements: [
            'office', 'corridor', 'modern', 'minimalist', 'cubicles', 'workspaces',
            'teal couch', 'wooden shelving', 'black refrigerator', 'microwave',
            'recessed lights', 'pendant lights', 'navy blue walls', 'light beige floor',
            'kitchenette', 'seating area', 'clean', 'organized', 'professional',
            'contemporary', 'bright lighting', 'empty', 'tranquil'
          ],
          detailedDescription: `Modern, minimalist office corridor stretching into distance with cubicles and workspaces on both sides. No people visible, emphasizing emptiness and tranquility. Long teal couch against left wall with wooden shelving unit beside it. Black refrigerator and integrated microwave on right side forming kitchenette area. Deep navy blue walls with light beige flooring. Recessed ceiling lights provide even illumination, with pendant lights hanging in distance. Minimalist color scheme focusing on neutral and dark tones. Materials include smooth painted walls, polished concrete-like flooring, wood shelving, teal fabric upholstery, metal and glass appliances. Calm, professional, modern atmosphere with sense of order and efficiency.`
        }
      },
      {
        imageId: 'business_002',
        url: 'https://images.unsplash.com/photo-1556910585-09baa3a3998e?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'A modern kitchen with wooden shelves, kitchen items, and organized countertop.',
        expectedVocabulary: ['kitchen', 'shelves', 'bowls', 'plates', 'sink', 'faucet', 'countertop', 'organized'],
        guidingQuestions: [
          'What items are on the shelves?',
          'What colors do you see?',
          'How is the kitchen organized?',
          'What materials can you identify?'
        ],
        evaluationCriteria: {
          keyElements: [
            'modern kitchen', 'wooden shelves', 'white wall', 'blue bowls', 'gray bowls',
            'plates', 'pots', 'black faucet', 'sink', 'stainless steel', 'countertop',
            'fruit bowl', 'red casserole dish', 'glass bottles', 'clean', 'organized',
            'functionality', 'simplicity'
          ],
          detailedDescription: `The image depicts a modern kitchen with wooden shelves mounted on a white wall. The shelves hold various kitchen items, including blue and gray bowls, plates, and pots. A black faucet is visible above a sink with a stainless steel finish. On the countertop, there is a bowl of fruit, a red casserole dish, and two clear glass bottles. The atmosphere is clean and organized, with a focus on functionality and simplicity.`
        }
      }
    ]
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Social gatherings and interactions',
    images: [
      {
        imageId: 'social_001',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500',
        description: 'Friends having dinner at a restaurant with food, drinks, and conversation.',
        expectedVocabulary: ['restaurant', 'friends', 'dinner', 'food', 'drinks', 'conversation', 'social'],
        guidingQuestions: [
          'What kind of food do you see?',
          'How are the people interacting?',
          'What\'s the mood of the scene?',
          'How would you describe the restaurant setting?'
        ],
        evaluationCriteria: {
          keyElements: [
            'six people', 'friends', 'group', 'sitting together', 'concrete ledge',
            'arms around each other', 'camaraderie', 'friendship', 'scenic viewpoint',
            'mountains', 'cable car', 'gondolas', 'tourist spot', 'landscape',
            'gray t-shirt', 'blue cap', 'tie-dye shirt', 'white shirt', 'red bag',
            'yellow shirt', 'hats', 'casual clothing', 'relaxed', 'enjoying view'
          ],
          detailedDescription: `Group of six people sitting closely together on concrete ledge at scenic viewpoint, arms around each other showing camaraderie and friendship. Background features picturesque landscape with mountains, cable car system with suspended gondolas, and partly cloudy sky. Tourist spot, possibly coastal area. People wearing casual attire: gray t-shirts, blue patterned cap, blue and yellow tie-dye shirt, white shirt, blue shirt with hat and red bag, yellow shirt with hat. Relaxed, enjoyable atmosphere suggesting late afternoon with soft, warm lighting. Strong sense of togetherness and friendship evident from body language and positioning.`
        }
      },
      {
        imageId: 'social_002',
        url: 'https://i.ibb.co/zHVCWJQ0/elegant-mother-with-cute-daughter.jpg',
        description: 'A girl and woman petting a golden retriever in a park with trees and grass.',
        expectedVocabulary: ['girl', 'woman', 'dog', 'petting', 'park', 'trees', 'grass', 'golden retriever'],
        guidingQuestions: [
          'Who are the people in the image?',
          'What are they doing?',
          'What kind of dog is it?',
          'Where are they located?'
        ],
        evaluationCriteria: {
          keyElements: [
            'girl', 'woman', 'petting', 'dog', 'golden retriever', 'park', 'white outfit',
            'red shoes', 'blue top', 'white pants', 'white shoes', 'green grass',
            'tall trees', 'house', 'brick wall', 'white roof', 'sunny', 'cheerful'
          ],
          detailedDescription: `In a park, a girl and a woman are petting a dog. The girl is wearing a white outfit and red shoes. The woman is wearing a blue top, white pants, and white shoes. The dog is a golden retriever. The park has green grass and tall trees. In the background, there is a house with a brick wall and a white roof. The atmosphere is sunny and cheerful.`
        }
      }
    ]
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Educational and learning environments',
    images: [
      {
        imageId: 'academic_001',
        url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
        description: 'A library with students studying, books, desks, and quiet atmosphere.',
        expectedVocabulary: ['library', 'students', 'books', 'studying', 'quiet', 'desk', 'academic'],
        guidingQuestions: [
          'What are the students doing?',
          'How would you describe the atmosphere?',
          'What study materials do you see?',
          'How is the space organized?'
        ],
        evaluationCriteria: {
          keyElements: [
            'library', 'bookstore', 'bookshelves', 'books', 'rows of shelves',
            'light bulbs', 'string lights', 'warm lighting', 'yellow glow',
            'different sized bulbs', 'dark floor', 'wood shelves', 'paper books',
            'metal fixtures', 'cozy', 'inviting', 'intellectual atmosphere',
            'evening lighting', 'soft shadows', 'perspective view'
          ],
          detailedDescription: `Library or bookstore section with multiple rows of bookshelves extending into background. No people visible - focus on books and lighting. Densely packed shelves with books of various sizes, colors, and genres. String of light bulbs suspended above shelves providing soft, warm yellow lighting. Bulbs are different sizes creating artistic touch. Dark wooden bookshelves with traditional appearance. Dark floor material, possibly wood or tile. Warm color scheme with yellow/orange light contrasting darker tones of shelves and books. Cozy, inviting, intellectual atmosphere. Evening/night time suggested by warm lighting against darker surroundings. Low angle perspective emphasizing shelf height and warm glow, with soft shadows adding depth.`
        }
      },
      {
        imageId: 'academic_002',
        url: 'https://i.ibb.co/bjP16wN5/young-lady-reading-near-bookshelf.jpg',
        description: 'A young woman reading a book while standing near bookshelves in a library.',
        expectedVocabulary: ['woman', 'reading', 'book', 'bookshelves', 'library', 'standing', 'quiet', 'studying'],
        guidingQuestions: [
          'What is the woman doing?',
          'What is she wearing?',
          'Where is she standing?',
          'How would you describe the environment?'
        ],
        evaluationCriteria: {
          keyElements: [
            'young woman', 'reading', 'book', 'standing', 'bookshelves', 'library',
            'white blouse', 'black skirt', 'wooden floor', 'books', 'quiet',
            'peaceful', 'studying', 'intellectual'
          ],
          detailedDescription: `A young woman is reading a book while standing near tall bookshelves in a library. She is wearing a white blouse and a black skirt. The bookshelves are filled with books of various sizes and colors. The wooden floor adds warmth to the scene. The atmosphere is quiet and peaceful, perfect for reading and studying.`
        }
      }
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Entertainment and pop culture scenes',
    images: [
      {
        imageId: 'entertainment_001',
        url: 'https://contents-cdn.viewus.co.kr/image/2025/08/CP-2023-0089/image-49294418-b27c-4e2f-85e1-ad8842ac8047.png',
        description: 'Three cartoon characters standing together near a window with trees and blue sky in the background.',
        expectedVocabulary: ['cartoon', 'characters', 'standing', 'window', 'trees', 'sky', 'colorful', 'animated'],
        guidingQuestions: [
          'How many characters do you see?',
          'What are they wearing?',
          'What can you see in the background?',
          'How would you describe the style?'
        ],
        evaluationCriteria: {
          keyElements: [
            'three', 'cartoon characters', 'standing', 'close together', 'glass window',
            'pink hoodie', 'white top', 'glasses', 'yellow hat', 'trees', 'blue sky',
            'bright', 'cheerful', 'animated', 'colorful'
          ],
          detailedDescription: `Three cartoon characters are standing close to each other. They are standing near a glass window. The character on the left is wearing a pink hoodie. The character in the middle is wearing a white top and glasses. The character on the right is wearing a yellow hat. Behind them, there are trees and a blue sky. The atmosphere is bright and cheerful.`
        }
      }
    ]
  }
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
    accuracy: 'How factually correct compared to reference image (0-100)',
    completeness: 'How much of the key elements were covered (0-100)', 
    vocabulary: 'Quality and variety of vocabulary used (0-100)',
    detail: 'Level of specific details provided (0-100)'
  }
};
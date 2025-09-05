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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  }
];
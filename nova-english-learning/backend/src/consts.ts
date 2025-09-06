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
    id: "k-pop",
    name: "K-Pop",
    description: "Korean pop culture and music scenes",
    images: [
      {
        imageId: "pic_1",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_1.png",
        description:
          "Three cartoon characters are standing close to each other. They are standing near a glass door. The character on the left has purple hair and is wearing a pink hoodie. The character in the middle has pink hair and is wearing a black cap and glasses. The character on the right has black hair and is wearing a yellow hat. Behind them, there are trees and a blue sky.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "three",
            "cartoon characters",
            "glass door",
            "purple hair",
            "pink hoodie",
            "pink hair",
            "black cap",
            "glasses",
            "black hair",
            "yellow hat",
            "trees",
            "blue sky",
          ],
          detailedDescription:
            "Three cartoon characters are standing close to each other. They are standing near a glass door. The character on the left has purple hair and is wearing a pink hoodie. The character in the middle has pink hair and is wearing a black cap and glasses. The character on the right has black hair and is wearing a yellow hat. Behind them, there are trees and a blue sky.",
        },
      },
      {
        imageId: "pic_6",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_6.jpeg",
        description:
          "The image shows three cartoon characters standing together. They are holding cups with straws and appear to be eating. The character on the left has pink hair and is wearing a black top. The middle character has purple hair and is wearing a yellow jacket. The character on the right has black hair and is wearing a black and white outfit. The background is purple and blue.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "three cartoon characters",
            "standing together",
            "cups with straws",
            "eating",
            "pink hair",
            "black top",
            "purple hair",
            "yellow jacket",
            "black hair",
            "black and white outfit",
            "purple background",
            "blue background",
          ],
          detailedDescription:
            "The image shows three cartoon characters standing together. They are holding cups with straws and appear to be eating. The character on the left has pink hair and is wearing a black top. The middle character has purple hair and is wearing a yellow jacket. The character on the right has black hair and is wearing a black and white outfit. The background is purple and blue.",
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
        imageId: "pic_2",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_2.png",
        description:
          "The image depicts a serene riverside village with traditional wooden houses. The houses are built on stilts, showcasing a unique architectural style. The river is calm, with several small boats floating on its green waters. Lush greenery surrounds the village, with trees and hills in the background. The sky is clear, indicating a sunny day. The overall atmosphere is peaceful and picturesque, highlighting the harmony between nature and human habitation.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "serene",
            "riverside village",
            "traditional wooden houses",
            "stilts",
            "architectural style",
            "calm river",
            "small boats",
            "green waters",
            "lush greenery",
            "trees",
            "hills",
            "clear sky",
            "sunny day",
            "peaceful",
            "picturesque",
          ],
          detailedDescription:
            "The image depicts a serene riverside village with traditional wooden houses. The houses are built on stilts, showcasing a unique architectural style. The river is calm, with several small boats floating on its green waters. Lush greenery surrounds the village, with trees and hills in the background. The sky is clear, indicating a sunny day. The overall atmosphere is peaceful and picturesque, highlighting the harmony between nature and human habitation.",
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
        imageId: "pic_3",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_3.png",
        description:
          "Four people are sitting on chairs in an outdoor area. The chairs are colorful, with one being pink and another being multicolored. A woman is holding a laptop on her lap. Another woman is wearing glasses and sneakers. A man is sitting on a chair with his legs crossed. Another man is holding his chin with his hand. The floor is made of tiles. The atmosphere is casual and relaxed.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "four people",
            "sitting",
            "chairs",
            "outdoor area",
            "colorful chairs",
            "pink",
            "multicolored",
            "woman",
            "laptop",
            "glasses",
            "sneakers",
            "man",
            "legs crossed",
            "chin",
            "hand",
            "tiles",
            "casual",
            "relaxed",
          ],
          detailedDescription:
            "Four people are sitting on chairs in an outdoor area. The chairs are colorful, with one being pink and another being multicolored. A woman is holding a laptop on her lap. Another woman is wearing glasses and sneakers. A man is sitting on a chair with his legs crossed. Another man is holding his chin with his hand. The floor is made of tiles. The atmosphere is casual and relaxed.",
        },
      },
      {
        imageId: "pic_4",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_4.jpeg",
        description:
          'The image shows a soccer match in progress. A player in a white jersey with the letters "AIA" is running towards the ball. He is surrounded by three opponents in black and red jerseys. The soccer field is green, and the ball is white with blue and purple accents. The background shows a crowd of spectators, some of whom are blurry due to the motion. The atmosphere is dynamic and competitive.',
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "soccer match",
            "player",
            "white jersey",
            "AIA",
            "running",
            "ball",
            "three opponents",
            "black and red jerseys",
            "green field",
            "white ball",
            "blue and purple accents",
            "crowd",
            "spectators",
            "blurry",
            "motion",
            "dynamic",
            "competitive",
          ],
          detailedDescription:
            'The image shows a soccer match in progress. A player in a white jersey with the letters "AIA" is running towards the ball. He is surrounded by three opponents in black and red jerseys. The soccer field is green, and the ball is white with blue and purple accents. The background shows a crowd of spectators, some of whom are blurry due to the motion. The atmosphere is dynamic and competitive.',
        },
      },
      {
        imageId: "pic_5",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_5.jpeg",
        description:
          "The image depicts a group of people dressed in traditional Korean attire, engaging in a performance on a grassy field. They are holding large, round, golden shields and swords. The participants wear red and blue costumes with white undergarments, black boots, and ornate hats. In the background, there are colorful flags and balloons, and a traditional Korean building with a curved roof. Spectators are watching from the side, creating a festive atmosphere.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "group of people",
            "traditional Korean attire",
            "performance",
            "grassy field",
            "golden shields",
            "swords",
            "red and blue costumes",
            "white undergarments",
            "black boots",
            "ornate hats",
            "colorful flags",
            "balloons",
            "traditional Korean building",
            "curved roof",
            "spectators",
            "festive atmosphere",
          ],
          detailedDescription:
            "The image depicts a group of people dressed in traditional Korean attire, engaging in a performance on a grassy field. They are holding large, round, golden shields and swords. The participants wear red and blue costumes with white undergarments, black boots, and ornate hats. In the background, there are colorful flags and balloons, and a traditional Korean building with a curved roof. Spectators are watching from the side, creating a festive atmosphere.",
        },
      },
      {
        imageId: "pic_11",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_11.jpeg",
        description:
          "A man is sitting in an office chair, wearing a denim shirt and glasses. He is typing on a keyboard with two monitors displaying code. The desk is made of white material, and there is a black mouse on it. The atmosphere is focused and professional, with the man concentrating on his work. The monitors show lines of code, indicating a technical or programming-related task. The background includes a glass window with natural light coming through.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "man",
            "office chair",
            "denim shirt",
            "glasses",
            "typing",
            "keyboard",
            "two monitors",
            "code",
            "white desk",
            "black mouse",
            "focused",
            "professional",
            "concentrating",
            "work",
            "lines of code",
            "technical",
            "programming",
            "glass window",
            "natural light",
          ],
          detailedDescription:
            "A man is sitting in an office chair, wearing a denim shirt and glasses. He is typing on a keyboard with two monitors displaying code. The desk is made of white material, and there is a black mouse on it. The atmosphere is focused and professional, with the man concentrating on his work. The monitors show lines of code, indicating a technical or programming-related task. The background includes a glass window with natural light coming through.",
        },
      },
      {
        imageId: "pic_13",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_13.jpeg",
        description:
          "The image shows a top-down view of a city street. The street is lined with buildings on the left and trees on the right. The buildings have red roofs and white walls. The street is empty, with no cars or people visible. The trees are lush and green, with some having circular structures on top. The sky is clear and blue.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "top-down view",
            "city street",
            "buildings",
            "trees",
            "red roofs",
            "white walls",
            "empty street",
            "no cars",
            "no people",
            "lush green trees",
            "circular structures",
            "clear sky",
            "blue sky",
          ],
          detailedDescription:
            "The image shows a top-down view of a city street. The street is lined with buildings on the left and trees on the right. The buildings have red roofs and white walls. The street is empty, with no cars or people visible. The trees are lush and green, with some having circular structures on top. The sky is clear and blue.",
        },
      },
    ],
  },

  {
    id: "animation",
    name: "Animation",
    description: "Animated characters and cartoon scenes",
    images: [
      {
        imageId: "pic_7",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_7.jpeg",
        description:
          "The image depicts a cartoon character in a room with a red carpet and red walls. The character is wearing a blue suit with a white shirt and a brown bow tie. He is giving a thumbs up with his right hand. There are two chairs with red cushions and a desk with a lamp. The room has a warm, cozy atmosphere with dim lighting. The walls are decorated with framed pictures and shelves with various items.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "cartoon character",
            "room",
            "red carpet",
            "red walls",
            "blue suit",
            "white shirt",
            "brown bow tie",
            "thumbs up",
            "right hand",
            "two chairs",
            "red cushions",
            "desk",
            "lamp",
            "warm",
            "cozy atmosphere",
            "dim lighting",
            "framed pictures",
            "shelves",
            "various items",
          ],
          detailedDescription:
            "The image depicts a cartoon character in a room with a red carpet and red walls. The character is wearing a blue suit with a white shirt and a brown bow tie. He is giving a thumbs up with his right hand. There are two chairs with red cushions and a desk with a lamp. The room has a warm, cozy atmosphere with dim lighting. The walls are decorated with framed pictures and shelves with various items.",
        },
      },
      {
        imageId: "pic_8",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_8.jpeg",
        description:
          "The image depicts a dynamic scene with several anime characters in action. The central figure, a boy with red hair, wields a large sword. Surrounding him are other characters, each with distinct appearances and weapons. The background is dark, with hints of a forest, suggesting a nighttime setting. The characters' expressions are intense, indicating a battle or confrontation. The colors are vibrant, with contrasting shades enhancing the dramatic atmosphere.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "dynamic scene",
            "anime characters",
            "action",
            "central figure",
            "boy",
            "red hair",
            "large sword",
            "surrounding characters",
            "distinct appearances",
            "weapons",
            "dark background",
            "forest",
            "nighttime setting",
            "intense expressions",
            "battle",
            "confrontation",
            "vibrant colors",
            "contrasting shades",
            "dramatic atmosphere",
          ],
          detailedDescription:
            "The image depicts a dynamic scene with several anime characters in action. The central figure, a boy with red hair, wields a large sword. Surrounding him are other characters, each with distinct appearances and weapons. The background is dark, with hints of a forest, suggesting a nighttime setting. The characters' expressions are intense, indicating a battle or confrontation. The colors are vibrant, with contrasting shades enhancing the dramatic atmosphere.",
        },
      },
      {
        imageId: "pic_9",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_9.png",
        description:
          "Three cartoon characters are standing close to each other. They are standing near a glass door. The character on the left has purple hair and is wearing a pink hoodie. The character in the middle has pink hair and is wearing glasses and a black cap. The character on the right is wearing a yellow hat. Behind them, there are trees and a blue sky.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "three cartoon characters",
            "standing close",
            "glass door",
            "purple hair",
            "pink hoodie",
            "pink hair",
            "glasses",
            "black cap",
            "yellow hat",
            "trees",
            "blue sky",
          ],
          detailedDescription:
            "Three cartoon characters are standing close to each other. They are standing near a glass door. The character on the left has purple hair and is wearing a pink hoodie. The character in the middle has pink hair and is wearing glasses and a black cap. The character on the right is wearing a yellow hat. Behind them, there are trees and a blue sky.",
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
        imageId: "pic_10",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_10.jpeg",
        description:
          "A person is sitting on the street, feeding a cat with a red and pink treat. The cat is eagerly reaching up with its mouth open. The person is wearing a gray hoodie and shorts. The cat is orange with a fluffy tail. In the background, there is a building with many windows and a parked car. The street is empty, and the sky is clear.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "person",
            "sitting",
            "street",
            "feeding",
            "cat",
            "red and pink treat",
            "eagerly reaching",
            "mouth open",
            "gray hoodie",
            "shorts",
            "orange cat",
            "fluffy tail",
            "building",
            "many windows",
            "parked car",
            "empty street",
            "clear sky",
          ],
          detailedDescription:
            "A person is sitting on the street, feeding a cat with a red and pink treat. The cat is eagerly reaching up with its mouth open. The person is wearing a gray hoodie and shorts. The cat is orange with a fluffy tail. In the background, there is a building with many windows and a parked car. The street is empty, and the sky is clear.",
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
        imageId: "pic_12",
        url: "https://d1d6oeec7imlh5.cloudfront.net/pic_12.jpeg",
        description:
          "Two men are standing next to each other in front of a white door. The man on the left is wearing an orange shirt and holding a laptop. The man on the right is wearing a black shirt and holding a can of Coca-Cola. Behind them is a projector screen and a whiteboard with a poster on it. The wall is painted in a light beige color.",
        guidingQuestions: [
          "What features do you notice in this scene?",
          "What colors can you see?",
          "How does this image make you feel?",
          "What stands out to you the most?",
        ],
        evaluationCriteria: {
          keyElements: [
            "two men",
            "standing",
            "white door",
            "orange shirt",
            "laptop",
            "black shirt",
            "Coca-Cola",
            "projector screen",
            "whiteboard",
            "poster",
            "light beige wall",
          ],
          detailedDescription:
            "Two men are standing next to each other in front of a white door. The man on the left is wearing an orange shirt and holding a laptop. The man on the right is wearing a black shirt and holding a can of Coca-Cola. Behind them is a projector screen and a whiteboard with a poster on it. The wall is painted in a light beige color.",
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

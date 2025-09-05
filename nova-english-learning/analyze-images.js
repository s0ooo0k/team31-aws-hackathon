const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { fromIni } = require('@aws-sdk/credential-providers');

// 이미지 URL 목록
const imageUrls = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500', // Coffee shop
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500', // Park
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500', // Office
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500', // Restaurant
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'  // Library
];

const categories = ['Coffee Shop', 'Park', 'Office', 'Restaurant', 'Library'];

async function analyzeImageWithNovaPro(imageUrl, category) {
  try {
    console.log(`\n🔍 Analyzing ${category} image...`);
    
    const client = new BedrockRuntimeClient({
      region: 'us-east-1',
      credentials: fromIni({ profile: 'bedrock-test' })
    });

    // 이미지를 base64로 변환
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    const prompt = `Please provide an extremely detailed description of this image. Include:

1. OVERALL SCENE: What type of location/setting is this?
2. PEOPLE: How many people, what are they doing, clothing, postures, interactions?
3. OBJECTS: Every visible object, furniture, equipment, decorations
4. COLORS: Dominant colors, color schemes, lighting effects
5. MATERIALS: What materials can you identify (wood, metal, fabric, etc.)
6. SPATIAL LAYOUT: How things are arranged, foreground/background elements
7. ATMOSPHERE: Mood, lighting quality, time of day, ambiance
8. DETAILS: Small details that make the scene unique or interesting

Be as specific and comprehensive as possible. This will be used as a reference answer for English learning evaluation.`;

    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-pro-v1:0',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt
              },
              {
                image: {
                  format: 'jpeg',
                  source: {
                    bytes: base64Image
                  }
                }
              }
            ]
          }
        ],
        inferenceConfig: {
          maxTokens: 2000,
          temperature: 0.1,
          topP: 0.9
        }
      })
    });

    const result = await client.send(command);
    const responseBody = JSON.parse(Buffer.from(result.body).toString('utf-8'));
    
    console.log(`\n📝 DETAILED DESCRIPTION FOR ${category.toUpperCase()}:`);
    console.log('=' .repeat(60));
    console.log(responseBody.output.message.content[0].text);
    console.log('=' .repeat(60));
    
    return responseBody.output.message.content[0].text;
    
  } catch (error) {
    console.error(`❌ Error analyzing ${category}:`, error.message);
    return null;
  }
}

async function analyzeAllImages() {
  console.log('🚀 Starting Nova Pro image analysis for English learning evaluation...\n');
  
  const results = {};
  
  for (let i = 0; i < imageUrls.length; i++) {
    const description = await analyzeImageWithNovaPro(imageUrls[i], categories[i]);
    if (description) {
      results[categories[i]] = description;
    }
    
    // API 호출 간격 조절
    if (i < imageUrls.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next analysis...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n✅ Analysis complete! You can use these detailed descriptions as reference answers for evaluation.');
  
  return results;
}

// 실행
analyzeAllImages().catch(console.error);
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { fromIni } = require('@aws-sdk/credential-providers');
const { writeFileSync } = require('fs');

const testNovaCanvas = async () => {
  try {
    console.log('Testing Nova Canvas...');
    
    const client = new BedrockRuntimeClient({
      region: 'us-east-1',
      credentials: fromIni({ profile: 'bedrock-test' })
    });

    const inferenceParams = {
      taskType: "TEXT_IMAGE",
      textToImageParams: {
        text: "a beautiful sunset over the ocean with orange and pink colors",
        negativeText: "blurry, low quality, distorted, ugly"
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        quality: "standard",
        width: 512,
        height: 512,
        cfgScale: 7.0,
        seed: Math.floor(Math.random() * 858993459)
      }
    };

    const command = new InvokeModelCommand({
      body: JSON.stringify(inferenceParams),
      modelId: 'amazon.nova-canvas-v1:0',
      accept: 'application/json',
      contentType: 'application/json'
    });

    console.log('Sending request to Nova Canvas...');
    const response = await client.send(command);
    
    if (!(response.body instanceof Uint8Array)) {
      throw new Error('Unexpected response format');
    }

    const responseBody = JSON.parse(Buffer.from(response.body).toString('utf-8'));
    
    if (responseBody.images && responseBody.images.length > 0) {
      const imageBase64 = responseBody.images[0];
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      
      writeFileSync('test-generated-image.png', imageBuffer);
      
      console.log('✅ Nova Canvas test successful!');
      console.log('📁 Image saved as: test-generated-image.png');
      console.log('🎨 Prompt:', inferenceParams.textToImageParams.text);
    } else {
      console.log('❌ No image generated in response');
    }
    
  } catch (error) {
    console.error('❌ Nova Canvas test failed:', error.message);
    if (error.name === 'UnauthorizedOperation') {
      console.log('💡 Check AWS credentials and Nova Canvas model access');
    }
  }
};

testNovaCanvas();
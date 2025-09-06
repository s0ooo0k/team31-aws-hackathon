const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const { fromIni } = require("@aws-sdk/credential-providers");
const fs = require("fs").promises;

// 이미지 URL 목록
const imageUrls = [
  "https://i.ibb.co/b5pgjy84/young-woman-arranging-her-cake-shop.jpg",
  "https://images.unsplash.com/photo-1556910585-09baa3a3998e?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://i.ibb.co/bjP16wN5/young-lady-reading-near-bookshelf.jpg",
  "https://i.ibb.co/zHVCWJQ0/elegant-mother-with-cute-daughter.jpg",
  "https://contents-cdn.viewus.co.kr/image/2025/08/CP-2023-0089/image-49294418-b27c-4e2f-85e1-ad8842ac8047.png",
];

const categories = ["Coffee Shop", "Restaurant", "Library", "Park", "Kpop"];

async function analyzeImageWithNovaPro(imageUrl, category) {
  try {
    console.log(`\n🔍 Analyzing ${category} image...`);

    const client = new BedrockRuntimeClient({
      region: "us-east-1",
      credentials: fromIni({ profile: "bedrock-test" }),
    });

    // 이미지를 base64로 변환
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Describe this image in exactly 7-8 concise sentences for English learning evaluation. Focus on main scene, people, key objects, colors, materials, and atmosphere. Write clear, descriptive sentences that English learners can compare their descriptions against.`;

    const command = new InvokeModelCommand({
      modelId: "amazon.nova-pro-v1:0",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt,
              },
              {
                image: {
                  format: imageUrl.toLowerCase().includes('.png') ? "png" : "jpeg",
                  source: {
                    bytes: base64Image,
                  },
                },
              },
            ],
          },
        ],
        inferenceConfig: {
          maxTokens: 300,
          temperature: 0.1,
          topP: 0.9,
        },
      }),
    });

    const result = await client.send(command);
    const responseBody = JSON.parse(Buffer.from(result.body).toString("utf-8"));

    console.log(`\n📝 DETAILED DESCRIPTION FOR ${category.toUpperCase()}:`);
    console.log("=".repeat(60));
    console.log(responseBody.output.message.content[0].text);
    console.log("=".repeat(60));

    return responseBody.output.message.content[0].text;
  } catch (error) {
    console.error(`❌ Error analyzing ${category}:`, error.message);
    return null;
  }
}

async function analyzeAllImages() {
  console.log(
    "🚀 Starting Nova Pro image analysis for English learning evaluation...\n"
  );

  const results = {};

  for (let i = 0; i < imageUrls.length; i++) {
    const description = await analyzeImageWithNovaPro(
      imageUrls[i],
      categories[i]
    );
    if (description) {
      results[categories[i]] = description;
    }

    // API 호출 간격 조절
    if (i < imageUrls.length - 1) {
      console.log("\n⏳ Waiting 2 seconds before next analysis...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // 결과를 JSON 파일로 저장
  await fs.writeFile(
    "image-analysis-results.json",
    JSON.stringify(results, null, 2)
  );
  console.log("\n💾 Results saved to: image-analysis-results.json");

  // consts.ts 업데이트용 코드 생성
  let constsUpdate = "\n// Generated image descriptions for consts.ts:\n";
  Object.entries(results).forEach(([category, description]) => {
    constsUpdate += `\n// ${category}:\ndetailedDescription: \`${description}\`,\n`;
  });

  await fs.writeFile("consts-update.txt", constsUpdate);
  console.log("💾 consts.ts update code saved to: consts-update.txt");

  console.log("\n✅ Analysis complete! Check the generated files.");

  return results;
}

// 실행
analyzeAllImages().catch(console.error);

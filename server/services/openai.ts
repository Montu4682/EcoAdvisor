import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ItemAnalysis {
  itemName: string;
  itemType: string;
  environmentalImpact: string;
  wasteCategory: string;
  confidence: number;
}

export interface EcoAlternative {
  name: string;
  description: string;
  co2Savings: number;
  pointsValue: number;
  availability: string;
}

export interface AnalysisResult {
  analysis: ItemAnalysis;
  alternatives: EcoAlternative[];
  totalCO2Savings: number;
  recommendedPoints: number;
}

export async function analyzeImage(base64Image: string): Promise<AnalysisResult> {
  try {
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an environmental expert AI that analyzes items for waste reduction. Analyze the image and identify disposable or wasteful items. Provide eco-friendly alternatives and calculate environmental impact. Respond with JSON in this exact format:
          {
            "analysis": {
              "itemName": "string",
              "itemType": "string", 
              "environmentalImpact": "string",
              "wasteCategory": "plastic|paper|metal|glass|electronic|textile|other",
              "confidence": number
            },
            "alternatives": [
              {
                "name": "string",
                "description": "string", 
                "co2Savings": number,
                "pointsValue": number,
                "availability": "string"
              }
            ],
            "totalCO2Savings": number,
            "recommendedPoints": number
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this item for environmental impact and suggest eco-friendly alternatives. Focus on waste reduction and sustainability."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(visionResponse.choices[0].message.content || "{}");
    return result as AnalysisResult;
  } catch (error) {
    console.error("OpenAI Vision API error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}

export async function generateEcoSuggestions(itemName: string): Promise<EcoAlternative[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an environmental sustainability expert. Given an item name, suggest 2-3 practical, affordable eco-friendly alternatives. Calculate realistic CO2 savings and assign appropriate point values (10-100 points based on environmental impact). Respond with JSON array in this format:
          [
            {
              "name": "string",
              "description": "string",
              "co2Savings": number,
              "pointsValue": number,
              "availability": "string"
            }
          ]`
        },
        {
          role: "user",
          content: `Suggest eco-friendly alternatives for: ${itemName}`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.alternatives || [];
  } catch (error) {
    console.error("OpenAI suggestions error:", error);
    throw new Error("Failed to generate eco suggestions. Please try again.");
  }
}

export async function calculateCO2Impact(disposableItem: string, reusableAlternative: string): Promise<number> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a carbon footprint calculation expert. Calculate the annual CO2 savings (in kg) when switching from a disposable item to a reusable alternative. Base calculations on realistic usage patterns and lifecycle assessments. Respond with JSON in this format:
          {
            "annualCO2Savings": number
          }`
        },
        {
          role: "user",
          content: `Calculate annual CO2 savings when switching from "${disposableItem}" to "${reusableAlternative}"`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.annualCO2Savings || 0;
  } catch (error) {
    console.error("CO2 calculation error:", error);
    return 0;
  }
}

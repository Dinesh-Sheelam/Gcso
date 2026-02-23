
import { GoogleGenAI, Type } from "@google/genai";

// Always use the API key directly from process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLaunchPlanMilestones = async (
  therapeuticArea: string,
  launchDate: string,
  region: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a pharmaceutical launch back-scheduling plan for a product in ${therapeuticArea} for the ${region} region, targeting a launch date of ${launchDate}. 
      Provide 8 key milestones with realistic dates leading up to the launch. 
      Consider regulatory submissions, manufacturing prep, marketing activation, and field team training.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              date: { type: Type.STRING, description: "ISO format date or YYYY-MM" },
              status: { type: Type.STRING, enum: ["Planned", "In Progress", "Completed"] },
              owner: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "date", "status", "owner"]
          }
        }
      }
    });

    // Access .text property directly as per guidelines.
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Error generating launch plan:", error);
    return [];
  }
};

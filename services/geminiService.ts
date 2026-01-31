
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendation = async (timeOfDay: string, area: string, history: string[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are TASTYRIDE AI assistant for Bangladesh village users. Recommend one popular local food item for ${timeOfDay} in ${area}. Previous orders: ${history.join(', ')}. Keep it short and friendly in Bangla. Example: "আজকের বৃষ্টির দিনে গরম খিচুড়ি আর ডিম ভাজি হতে পারে সেরা পছন্দ!"`,
      config: {
        systemInstruction: "You are a helpful Bangla food assistant. Always reply in friendly colloquial Bangla suitable for rural Bangladesh context.",
      },
    });
    return response.text || "আজকের জন্য বিরিয়ানি দারুণ হবে!";
  } catch (error) {
    console.error("AI Error:", error);
    return "আজকের স্পেশাল কাচ্চি বিরিয়ানি ট্রাই করুন!";
  }
};

export const chatWithAI = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are TastyRide Assistant. Help users choose food from a village context in Bangladesh. Use very simple Bangla. Only recommend foods found in local markets (Paratha, Dal, Biryani, Tehari, Khichuri, Singara, Samosa, etc.)",
      }
    });
    return response.text || "দুঃখিত, আমি বুঝতে পারিনি। আবার বলুন।";
  } catch (error) {
    return "নেটওয়ার্ক সমস্যা হচ্ছে, পরে চেষ্টা করুন।";
  }
};

export const getAdminInsights = async (orders: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these orders and tell which food will be in high demand tomorrow in Keraniganj: ${JSON.stringify(orders)}`,
      config: {
        systemInstruction: "Provide business insights in simple Bangla for a delivery app admin.",
      }
    });
    return response.text || "বিক্রি বাড়াতে কাল দুপুরের মেনুতে তেহারি রাখুন।";
  } catch (error) {
    return "উপাত্ত বিশ্লেষণে সমস্যা হচ্ছে।";
  }
};

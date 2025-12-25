
import { GoogleGenAI, Type } from "@google/genai";

// Always use a named parameter for apiKey and obtain it directly from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketingContent = async (productInfo: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Berikan konten pemasaran kreatif untuk produk berikut dalam Bahasa Indonesia: ${productInfo}.
      Berikan output dalam format JSON dengan field: tagline (pendek, catchy), caption (untuk media sosial), prompt (deskripsi visual untuk generator gambar), dan harga_saran (estimasi harga jika tidak disebutkan).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tagline: { type: Type.STRING },
            caption: { type: Type.STRING },
            prompt: { type: Type.STRING },
            harga_saran: { type: Type.STRING }
          },
          required: ["tagline", "caption", "prompt", "harga_saran"]
        }
      }
    });

    // Access text property directly and trim whitespace before parsing JSON.
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

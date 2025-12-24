
import { GoogleGenAI } from "@google/genai";

export const getSongAnalysis = async (trackTitle: string, artistName: string) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    console.warn("Gemini API Key missing or invalid.");
    return "Bu parça modern müziğin ritimlerini yansıtan harika bir kompozisyona sahip.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Müzik eleştirmeni olarak "${trackTitle}" by "${artistName}" şarkısı hakkında çok kısa, ilgi çekici ve Türkçe bir 'şarkı arkası' bilgisi ver (maksimum 2 cümle). Şarkı hakkında gerçek bir bilgi yoksa hayali ama profesyonel duran bir yorum yap.`,
    });
    return response.text || "Bu parçanın derinliklerinde saklı duygusal bir hikaye var.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bu parça, sanatçının kariyerindeki en dikkat çekici ve melodik yapıtlarından biri olarak öne çıkıyor.";
  }
}

export const getAIPlaylistName = async (mood: string) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey || apiKey === "undefined") return `${mood} Karışımı`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ruh hali "${mood}" olan bir müzik listesi için Türkçe, yaratıcı ve kısa bir Spotify çalma listesi adı öner. Sadece adı döndür.`,
    });
    return response.text?.trim() || `${mood} Mix`;
  } catch (error) {
    return `${mood} Ruhu`;
  }
};

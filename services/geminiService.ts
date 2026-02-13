import { GoogleGenAI, Type } from "@google/genai";
import { Listing } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to get a stable random image based on ID
const getImageUrl = (id: string, category: string) => {
  // Use a seed to ensure the same ID always gets the same image
  return `https://picsum.photos/seed/${id}/600/400`;
};

export const fetchListings = async (query: string, category: string = "all"): Promise<Listing[]> => {
  try {
    const prompt = `
      Generate 8 realistic classified ad listings for a French marketplace site like Bi3oo.
      
      Context:
      - Search Query: "${query || 'items récents'}"
      - Category: "${category}"
      
      Requirements:
      - Language: French
      - Currency: Euro (€)
      - Locations: Real French cities (Paris, Lyon, Marseille, Bordeaux, Lille, Nantes, etc.)
      - Dates: Relative dates like "Aujourd'hui, 14:30", "Hier, 09:15", etc.
      - Titles: Concise and catchy.
      - Descriptions: Detailed (2-3 sentences).
      - Prices: Realistic for the item.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              price: { type: Type.NUMBER },
              location: { type: Type.STRING },
              date: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              sellerName: { type: Type.STRING },
              isPro: { type: Type.BOOLEAN },
            },
            required: ["id", "title", "price", "location", "date", "category", "description", "sellerName", "isPro"]
          }
        }
      }
    });

    const rawListings = JSON.parse(response.text || "[]");

    // Augment with image URLs locally since the model can't generate real image URLs
    const listings: Listing[] = rawListings.map((item: any) => ({
      ...item,
      imageUrl: getImageUrl(item.id, item.category)
    }));

    return listings;

  } catch (error) {
    console.error("Error fetching listings from Gemini:", error);
    // Fallback data in case of error
    return [
      {
        id: "err-1",
        title: "Canapé Vintage",
        price: 150,
        location: "Paris 75011",
        date: "Aujourd'hui, 10:00",
        imageUrl: "https://picsum.photos/seed/err1/600/400",
        category: "Maison",
        description: "Très beau canapé vintage en velours vert. À venir chercher sur place.",
        sellerName: "Marie L.",
        isPro: false
      },
      {
        id: "err-2",
        title: "iPhone 13 - Parfait état",
        price: 550,
        location: "Lyon 69002",
        date: "Hier, 18:30",
        imageUrl: "https://picsum.photos/seed/err2/600/400",
        category: "Électronique",
        description: "iPhone 13 128Go, batterie neuve. Vendu avec coque.",
        sellerName: "Thomas B.",
        isPro: false
      }
    ];
  }
};

export const generateChatReply = async (listing: Listing, userMessage: string): Promise<string> => {
  try {
    const prompt = `
      You are playing the role of a seller on a French classifieds site called Bi3oo.
      You are selling: "${listing.title}" for ${listing.price}€.
      Description: "${listing.description}".
      
      The buyer just sent you this message: "${userMessage}"
      
      Write a short, realistic, and polite response in French. 
      If they ask if it's available, say yes.
      Keep it brief (1-2 sentences).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Bonjour, oui c'est toujours disponible !";
  } catch (e) {
    return "Bonjour, je suis disponible pour en discuter.";
  }
};
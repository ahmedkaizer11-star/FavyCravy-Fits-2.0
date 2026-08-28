import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. AI features will fallback gracefully.');
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-dev' });
  }
  return aiClient;
}

/**
 * AI Stylist consultation with Google Search Grounding for up-to-date fashion trends,
 * Bangladesh climate suggestions, and matching outfits.
 */
export async function getAiStylistAdvice(params: {
  userQuery: string;
  selectedProduct?: any;
  userOccasion?: string;
  userBudget?: number;
  availableProducts?: any[];
}) {
  try {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are "FCF Personal AI Stylist" for "Favy Cravy Fits 2.0", a premium modern menswear brand in Bangladesh.
Your goal is to provide sophisticated, practical, and highly tailored fashion advice for Bangladeshi men.
Consider the local sub-tropical climate (Dhaka, Chittagong, Sylhet), styling for events (casual hangouts in Banani/Gulshan/Dhanmondi, university/office, weddings, vacations, resort wear), fabric suitability (linen, 240+ GSM cotton, Oxford weaves, Mercerized knit), and color coordination.
When appropriate, use Google Search to fetch up-to-date fashion trends, weather contexts, or styling inspirations.
Recommend specific styling tips, shoes/accessories pairing (e.g. loafers, Chelsea boots, minimalist sneakers, leather straps), and tone recommendations.
Always maintain a refined, minimalist, confident, and respectful tone. Return clear, elegant markdown with markdown bullet points and headings.`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Customer Question: ${params.userQuery}
${params.userOccasion ? `Occasion / Setting: ${params.userOccasion}` : ''}
${params.userBudget ? `Budget Range: ৳${params.userBudget} BDT` : ''}
${params.selectedProduct ? `Currently viewing product: "${params.selectedProduct.name}" (${params.selectedProduct.category}, Material: ${params.selectedProduct.material || 'Premium woven'}, Price: ৳${params.selectedProduct.salePrice || params.selectedProduct.price})` : ''}
${params.availableProducts && params.availableProducts.length ? `Store inventory items available to reference:\n${params.availableProducts.map(p => `- ${p.name} (৳${p.salePrice || p.price}, ${p.category})`).join('\n')}` : ''}

Please provide top-tier styling recommendations and outfit pairing advice.`
          }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{ googleSearch: {} }] // Google Search Grounding
      }
    });

    const text = response.text || 'Here are our recommendations for your fit.';
    const searchGroundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return {
      text,
      groundingChunks: searchGroundingMetadata?.groundingChunks || [],
      webSearchQueries: searchGroundingMetadata?.webSearchQueries || []
    };
  } catch (error: any) {
    console.error('Gemini Search Stylist Error:', error);
    return {
      text: `For a versatile and sharp look, we recommend pairing structured Oxford shirts or Cuban resort shirts with our tailored single-pleat ankle-crop trousers or raw indigo selvedge denim. Complete the aesthetic with clean minimalist leather sneakers or suede loafers.`,
      groundingChunks: [],
      webSearchQueries: []
    };
  }
}

/**
 * AI Store Locator & Delivery Hub Assistant with Google Maps Grounding.
 * Locates nearby pickup hubs, Banani/Gulshan flagship store landmarks, delivery timelines across Dhaka/Bangladesh,
 * and nearby tailoring/fitting spots using Google Maps.
 */
export async function getAiStoreAndDeliveryInfo(params: {
  userQuery: string;
  userLocation?: string;
  latitude?: number;
  longitude?: number;
}) {
  try {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are the Store & Logistics AI Assistant for "Favy Cravy Fits 2.0" in Bangladesh.
Our flagship boutique is located at: Road 11, Block D, Banani, Dhaka 1213, Bangladesh (Near Kemal Ataturk Avenue).
We provide Free Home Delivery across all 64 districts of Bangladesh (Dhaka 24-48 hrs, Outside Dhaka 48-72 hrs via Steedfast/Pathao/eCourier).
Use Google Maps grounding to provide accurate real-world locations, routes, landmarks, travel tips, and verify districts, Banani landmarks, or nearby hubs for customers.
Be helpful, concise, and clear.`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Customer Query: ${params.userQuery}
${params.userLocation ? `Customer stated location: ${params.userLocation}` : ''}
${params.latitude && params.longitude ? `User coordinates: ${params.latitude}, ${params.longitude}` : ''}`
          }
        ]
      }
    ];

    const toolConfig: any = {};
    if (params.latitude && params.longitude) {
      toolConfig.retrievalConfig = {
        latLng: {
          latitude: params.latitude,
          longitude: params.longitude
        }
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.5,
        tools: [{ googleMaps: toolConfig }] // Google Maps Grounding
      }
    });

    const text = response.text || 'Our flagship boutique is located at Road 11, Block D, Banani, Dhaka.';
    const mapsGroundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return {
      text,
      groundingChunks: mapsGroundingMetadata?.groundingChunks || []
    };
  } catch (error: any) {
    console.error('Gemini Maps Assistant Error:', error);
    return {
      text: `Our flagship boutique is located at Road 11, Block D, Banani, Dhaka (Open Daily 11:00 AM - 10:00 PM). We also deliver freely to all 64 districts in Bangladesh with rapid 24-48 hour fulfillment in Dhaka.`,
      groundingChunks: []
    };
  }
}

import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Outfit, UserProfile } from '../types';
import { saveOutfitHistory } from './historyService';

// Per instructions, API key is in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const outfitSchema = {
    type: Type.OBJECT,
    properties: {
        styleTitle: {
            type: Type.STRING,
            description: "A catchy name for the style (e.g., 'Chic Casual', 'Elegant Evening')."
        },
        outfitDescription: {
            type: Type.STRING,
            description: "A detailed description covering the style, recommended colors, and fabrics."
        },
        colorPalette: {
            type: Type.ARRAY,
            description: "An array of key colors for the outfit. For each color, provide both its name and its corresponding HEX code.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the color." },
                    hex: { type: Type.STRING, description: "The hex code for the color (e.g., '#FFFFFF')." }
                },
                required: ['name', 'hex']
            }
        },
        occasionFit: {
            type: Type.ARRAY,
            description: "An array of suitable occasions (e.g., 'Daily Wear', 'Office', 'Party', 'Wedding').",
            items: { type: Type.STRING }
        },
        accessories: {
            type: Type.ARRAY,
            description: "An array of suggestions for accessories.",
            items: { type: Type.STRING }
        },
        imagePrompt: {
            type: Type.STRING,
            description: "A detailed, descriptive prompt for an image generation model. This prompt should describe ONLY the clothing items, accessories, and shoes for the outfit. Do not describe a person or a background."
        }
    },
    required: ['styleTitle', 'outfitDescription', 'colorPalette', 'occasionFit', 'accessories', 'imagePrompt']
};

const fashionAdviceSchema = {
    type: Type.ARRAY,
    description: "An array of three diverse and fashionable outfit recommendations based on the user's photo and profile.",
    items: outfitSchema
};


const buildFashionPrompt = (basePrompt: string, userProfile: UserProfile, filters?: string[]): string => {
    let promptText = basePrompt;

    const profileParts: string[] = [];
    if (userProfile.gender) {
        profileParts.push(`- Gender: ${userProfile.gender}`);
    }
    if (userProfile.bodyShape) {
        profileParts.push(`- Body Shape: ${userProfile.bodyShape}`);
    }
    if (userProfile.skinTone) {
        profileParts.push(`- Skin Tone: ${userProfile.skinTone}`);
    }
    if (userProfile.stylePreferences && userProfile.stylePreferences.length > 0) {
        profileParts.push(`- Preferred Styles: ${userProfile.stylePreferences.join(', ')}`);
    }
    if (userProfile.preferredColors) {
        profileParts.push(`- User likes these colors: ${userProfile.preferredColors}. Try to include them.`);
    }
    if (userProfile.dislikedColors) {
        profileParts.push(`- User dislikes these colors: ${userProfile.dislikedColors}. Avoid suggesting these.`);
    }

    if (profileParts.length > 0) {
        promptText += `\n\nTo make the recommendations even more personalized, consider the user's provided style profile:\n${profileParts.join('\n')}`;
    }

    if (filters && filters.length > 0) {
        promptText += `\n\nCrucially, the user is specifically looking for outfits that include the following items: ${filters.join(', ')}. Please prioritize generating outfits that contain these specific pieces.`;
    }

    return promptText;
};


export const analyzeImageForFashion = async (imageBase64: string, mimeType: string, userProfile: UserProfile): Promise<Outfit[]> => {
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType,
        },
    };

    const basePrompt = `You are an AI fashion stylist. First, check the user's gender from the provided profile. Based on this, analyze the uploaded photo and suggest the best outfit styles, colors, fabrics, and accessories.

For 'Male' -> recommend shirts, jeans, blazers, kurta, suits, etc. with suitable color palettes and accessories (watch, shoes, belts).

For 'Female' -> recommend dresses, sarees, kurtis, lehengas, skirts, gowns, etc. with color palettes, accessories (jewelry, handbags, footwear, makeup).

Provide three diverse outfit recommendations. Return the response as a JSON array of objects.`;

    const fullPrompt = buildFashionPrompt(basePrompt, userProfile);

    const textPart = { text: fullPrompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [imagePart, textPart] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: fashionAdviceSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        const outfits = JSON.parse(jsonText) as Outfit[];
        // Save each outfit to history
        for (const outfit of outfits) {
            await saveOutfitHistory(outfit);
        }
        return outfits;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The AI returned an invalid response. Please try again.");
    }
};

export const getMoreOutfits = async (imageBase64: string, mimeType: string, existingOutfits: Outfit[], userProfile: UserProfile, filters: string[] = []): Promise<Outfit[]> => {
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType,
        },
    };

    const existingOutfitsSummary = existingOutfits.map(o => 
        `- Style: "${o.styleTitle}". Description: ${o.outfitDescription}`
    ).join('\n');

    const basePrompt = `Based on the user's photo and profile, generate two more unique and creative outfit recommendations. These new outfits must be substantially different from the ones already provided.

Here are the outfits already suggested:
${existingOutfitsSummary}

Please ensure the new recommendations explore different clothing items, styles (e.g., if you provided casual, suggest something more formal or edgy), or color palettes. Be creative and avoid repetition. Return the response as a JSON array of two new, distinct outfit objects.`;
    
    const fullPrompt = buildFashionPrompt(basePrompt, userProfile, filters);

    const textPart = { text: fullPrompt };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [imagePart, textPart] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: fashionAdviceSchema, 
        },
    });

    const jsonText = response.text.trim();
    try {
        const outfits = JSON.parse(jsonText) as Outfit[];
        const newOutfits = outfits.slice(0, 2);
        for (const outfit of newOutfits) {
            await saveOutfitHistory(outfit);
        }
        return newOutfits;
    } catch (e) {
        console.error("Failed to parse JSON for more outfits:", jsonText);
        throw new Error("The AI returned an invalid response. Please try again.");
    }
};

export const generateOutfitImage = async (prompt: string, userImageBase64: string, userImageMimeType: string): Promise<string[]> => {
    try {
        const imagePart = {
            inlineData: {
                data: userImageBase64,
                mimeType: userImageMimeType,
            },
        };
        const textPart = {
            text: `Using the provided image of the person, realistically dress them in the following outfit, keeping their body shape and pose: ${prompt}. The background should be a neutral studio setting.`
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [imagePart, textPart]
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const images: string[] = [];
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    images.push(part.inlineData.data);
                }
            }
        }

        if (images.length > 0) {
            return images;
        } else {
            throw new Error("Image generation failed to return an image.");
        }
    } catch (e) {
        console.error("Error generating outfit image:", e);
        const error = e instanceof Error ? e.message : "An unknown error occurred during image generation.";
        throw new Error(error);
    }
};
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config.js";
import { clampText, safeArray } from "../utils.js";

export const buildFlyerPrompt = (payload) => {
  const contacts = safeArray(payload.contactNumbers).join(", ");
  return [
    "Create a polished event flyer poster.",
    `Club or organizer: ${payload.clubName || "General student club"}.`,
    `Theme: ${payload.theme || "Minimal academic event"}.`,
    `Style direction: ${payload.style || "clean, modern, minimal"}.`,
    `Event title: ${payload.eventTitle || "Untitled event"}.`,
    `Event details: ${clampText(payload.details || payload.summary || "No extra details provided.", 600)}.`,
    `Contact numbers to feature: ${contacts || "none provided"}.`,
    `Poster text hierarchy should prioritize title, date, venue, and registration CTA.`,
    "Use high contrast typography, balanced spacing, and college-event professionalism.",
    "Avoid clutter, low-contrast text, watermarks, or unrelated decorative elements.",
  ].join(" ");
};

export const generateFlyerConcept = async (payload) => {
  const prompt = buildFlyerPrompt(payload);

  if (!config.geminiApiKey) {
    return {
      prompt,
      provider: "gemini",
      status: "mocked",
      message: "Gemini API key not configured. Prompt generated successfully and is ready to send.",
      imageBase64: null,
    };
  }

  const client = new GoogleGenerativeAI(config.geminiApiKey);
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    {
      text: `Turn this into a structured creative brief for an image generation model. Keep it concise and production-ready.\n\n${prompt}`,
    },
  ]);

  return {
    prompt,
    provider: "gemini",
    status: "ready",
    creativeBrief: result.response.text(),
    imageBase64: null,
  };
};

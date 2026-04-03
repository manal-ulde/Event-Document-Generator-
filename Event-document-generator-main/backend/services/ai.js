import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config.js";
import { clampText } from "../utils.js";

const createProposalPrompt = (payload) => `
You are writing a formal college event proposal body.

Write 4 detailed professional paragraphs for an event proposal.
Keep the tone formal, administrative, and suitable for submission to college authorities.
Do not include headings, bullet points, signatures, salutations, or placeholders.
Use only the information provided below and expand it into polished proposal language.

College: ${payload.collegeName || "Pillai College of Engineering"}
Club: ${payload.clubName || "Student Club"}
Event title: ${payload.eventTitle || "Event"}
Event date: ${payload.eventDate || "To be announced"}
Venue: ${payload.venue || "College campus"}
Addressed to: ${payload.authorityName || "Respective authority"}
Subject: ${payload.subject || "Event proposal"}
Target audience: ${payload.targetAudience || "Students and faculty"}
Budget: ${payload.budget || "To be finalized"}
Objective: ${clampText(payload.objective || "", 700)}
Event summary: ${clampText(payload.eventSummary || "", 1200)}
Key points: ${(payload.keyPoints || []).join(", ")}
`.trim();

const fallbackProposalParagraphs = (payload) => [
  `This proposal is submitted on behalf of ${payload.clubName} for organizing the event "${payload.eventTitle}" at ${payload.venue || "the college venue"} on ${payload.eventDate || "the proposed date"}. The event is intended for ${payload.targetAudience || "students and faculty members"} and has been planned to create a structured and meaningful learning experience within the college environment.`,
  `The primary objective of the event is to ${payload.objective || "create a valuable academic and co-curricular experience for participants"}. Based on the details provided, the event will include ${payload.eventSummary || "well-coordinated activities, guided participation, and institution-aligned execution"} so that the intended outcomes are achieved in a professional and engaging manner.`,
  `The estimated budget for the event is ${payload.budget ? `Rs. ${Number(payload.budget).toLocaleString("en-IN")}` : "to be finalized"}. Administrative approval is requested for venue allocation, scheduling support, permissions, and any related logistics required for smooth execution. The organizing team will ensure that the event is conducted with discipline, proper coordination, and institutional compliance.`,
  `Through this event, ${payload.clubName} aims to contribute positively to student development and campus engagement. We therefore request approval to proceed with the proposed plan and assure that all arrangements, reporting, and post-event documentation will be carried out responsibly under faculty guidance.`,
];

export const generateProposalNarrative = async (payload) => {
  if (!config.geminiApiKey) {
    return {
      paragraphs: fallbackProposalParagraphs(payload),
      prompt: createProposalPrompt(payload),
      source: "template",
    };
  }

  try {
    const client = new GoogleGenerativeAI(config.geminiApiKey);
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = createProposalPrompt(payload);
    const result = await model.generateContent([{ text: prompt }]);
    const text = result.response.text().trim();
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 4);

    return {
      paragraphs: paragraphs.length > 0 ? paragraphs : fallbackProposalParagraphs(payload),
      prompt,
      source: "gemini",
    };
  } catch {
    return {
      paragraphs: fallbackProposalParagraphs(payload),
      prompt: createProposalPrompt(payload),
      source: "template",
    };
  }
};

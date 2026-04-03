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

const createReportPrompt = (payload) => {
  const numericAtt = payload.participantsAppeared ? String(payload.participantsAppeared) : "not available";
  const budgetApproved = payload.eventFee || payload.workshopFee ? `Rs. ${Number(payload.eventFee || payload.workshopFee).toLocaleString("en-IN")}` : "not provided";
  const feedback = payload.feedback ? `${payload.feedback}/10` : "not available";

  return `You are a professional event report automation engine for Pillai College of Engineering committee event documentation. Generate a comprehensive event report that spans at least 2-3 pages when formatted. Focus on creating an engaging, modern event report style rather than a traditional formal document.

## Pillai College of Engineering - Event Report

**Institution:** ${payload.collegeName || "Pillai College of Engineering"}
**Organizing Body:** ${payload.studentChapterName || payload.clubName || "Student Committee"}
**Event Title:** ${payload.eventName || "Event Title"}
**Date:** ${payload.eventDate || payload.workshopDate || "Event Date"}
**Location:** ${payload.eventVenue || payload.workshopVenue || "Campus Venue"}
**Event Coordinator:** ${payload.eventInstructor || payload.workshopInstructor || "Event Coordinator"}
**Student Event Head:** ${payload.studentEventHead || "Student Lead"}
**Faculty Event Head:** ${payload.facultyEventHead || "Faculty Supervisor"}

### Executive Overview
Provide a compelling 2-paragraph executive summary that highlights the workshop's success, learning outcomes, and key achievements. Make it engaging and results-focused.

### Event Vision & Objectives
- **Core Purpose:** Explain the fundamental goal and how it aligns with institutional objectives
- **Target Learning Outcomes:** Describe expected skills and knowledge gains for participants
- **Strategic Alignment:** How this event supports curriculum, career development, and institutional mission
- **Innovation Elements:** Any unique methodologies or modern approaches used

### Implementation & Execution
- **Planning Timeline:** Key preparation milestones and coordination phases
- **Resource Mobilization:** Coordinator/speaker coordination, material preparation, and logistics
- **Promotion Strategy:** ${payload.criteria || "Registration criteria and outreach methods"}
- **Execution Highlights:** Real-time coordination and adaptability during the event
- **Duration & Scale:** Event structure and session breakdown

### Participant Experience & Engagement
- **Total Registrations:** ${payload.participantsRegistered || "N/A"} participants registered
- **Actual Attendance:** ${payload.participantsAppeared || "N/A"} participants appeared
- **Engagement Metrics:** Participation levels, interaction quality, and event engagement
- **Demographic Insights:** Participant background and interest distribution
- **Experience Quality:** Factors contributing to participant satisfaction

### Financial Performance & Efficiency
- **Event Fee:** ${budgetApproved}
- **Cost per Participant:** ${payload.participantsAppeared && (payload.eventFee || payload.workshopFee) ? `Rs. ${(Number(payload.eventFee || payload.workshopFee) / Number(payload.participantsAppeared)).toFixed(2)}` : "N/A"}
- **Financial Insights:** Value delivery and cost-effectiveness analysis

### Event Content & Delivery
- **Topics Covered:** ${payload.topicsCovered || "Event curriculum and learning modules"}
- **Delivery Methodology:** Instructional approaches and delivery methods
- **Learning Materials:** Resources provided and reference materials
- **Practical Components:** Activities and hands-on sessions conducted
- **Assessment Methods:** Evaluation and feedback mechanisms used

### Outcomes & Achievements
- **Key Outcomes:** ${payload.description || "Skills and knowledge acquired"}
- **Success Indicators:** Quantitative and qualitative achievement measures
- **Impact Assessment:** Short-term and potential long-term effects
- **Participant Benefits:** Value delivered to attendees and their development

### Key Highlights & Success Stories
- **Outstanding Moments:** Memorable experiences and breakthroughs
- **Participant Achievements:** Notable accomplishments and outcomes
- **Delivery Excellence:** Effective approaches that worked well
- **Community Impact:** Influence on participant learning and culture

### Feedback Analysis & Quality Metrics
- **Overall Satisfaction:** ${payload.feedback || "Participant feedback summary"}
- **Strength Areas:** What worked exceptionally well
- **Improvement Opportunities:** Constructive feedback for future events
- **Quality Benchmarks:** How this event compares to similar engagements

### Operational Insights & Lessons Learned
- **Process Excellence:** What made the event execution smooth
- **Challenge Management:** Obstacles encountered and solutions implemented
- **Team Performance:** Coordination between coordinators, organizers, and support staff
- **Technology Integration:** Digital tools and platforms utilized effectively

### Documentation & Compliance
- **Attendance Records:** ${payload.attendanceForm || "Attendance tracking methods"}
- **Feedback Collection:** ${payload.feedbackFormLink || "Feedback mechanisms used"}
- **Photo Documentation:** ${payload.photos || "Visual records maintained"}

### Strategic Recommendations & Future Planning
1. **Content Enhancement:** Recommendations for improvement
2. **Delivery Optimization:** Better coordination and facilitation methods
3. **Scaling Potential:** How to expand successful elements
4. **Sustainability Measures:** Long-term planning for event series

### Conclusion & Next Steps
- **Event Legacy:** Lasting impact on participant development
- **Knowledge Transfer:** Lessons for future planning
- **Future Roadmap:** Immediate follow-up actions and vision
- **Recognition & Appreciation:** Acknowledging team excellence

**Report Generated:** ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
**Event Mode:** ${payload.mode || "Offline"}
**Prepared by:** ${payload.studentChapterName || payload.clubName || "Event Committee"}

IMPORTANT: Ensure the report is comprehensive (minimum 1500 words), uses engaging language, includes specific metrics and outcomes, and focuses on impact rather than just process. Make it professionally structured with clear sections.`;
};

const fallbackReportParagraphs = (payload) => {
  return [
    `Executive Summary: The ${payload.eventTitle} event by ${payload.clubName} at ${payload.venue || "the college"} on ${payload.eventDate || "the scheduled date"} delivered strong participation and met key objectives.`,
    `Event Details: Attendance was ${payload.totalAttendees || "N/A"} and target audience included ${payload.targetAudience || "students and faculty"}.`,
    `Objectives: ${payload.objective || "N/A"}.`,
    `Analytics: Budget was ${payload.totalBudget ? `Rs. ${Number(payload.totalBudget).toLocaleString("en-IN")}` : "N/A"}, actual spend ${payload.actualSpend ? `Rs. ${Number(payload.actualSpend).toLocaleString("en-IN")}` : "N/A"}; feedback score ${payload.feedbackScore || "N/A"}.`,
    `Insights & recommendations: Continue focusing on student involvement and tighten financial monitoring.`,
  ];
};

export const generateReportNarrative = async (payload) => {
  const prompt = createReportPrompt(payload);
  if (!config.mistralApiKey) {
    return {
      paragraphs: fallbackReportParagraphs(payload),
      prompt,
      source: "template",
      analytics: [],
    };
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.mistralApiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[Mistral] ${response.status} ${response.statusText}: ${errText}`);
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.message?.content || "";

    const cleaned = String(generatedText || "").trim();
    const paragraphs = cleaned
      .split(/\n{2,}/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) {
      throw new Error("Mistral response did not contain text");
    }

    const analytics = [
      payload.totalAttendees ? `Total attendees: ${payload.totalAttendees}` : null,
      payload.feedbackScore ? `Feedback score: ${payload.feedbackScore}/10` : null,
      payload.totalBudget ? `Approved budget: Rs. ${Number(payload.totalBudget).toLocaleString("en-IN")}` : null,
      payload.actualSpend ? `Actual spend: Rs. ${Number(payload.actualSpend).toLocaleString("en-IN")}` : null,
    ].filter(Boolean);

    return {
      paragraphs,
      prompt,
      source: "mistral",
      analytics,
    };
  } catch (error) {
    console.error("Mistral report generation error:", error);
    return {
      paragraphs: fallbackReportParagraphs(payload),
      prompt,
      source: "template",
      analytics: [],
    };
  }
};

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
    const model = client.getGenerativeModel({ model: "gemini-1.5-pro" });
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

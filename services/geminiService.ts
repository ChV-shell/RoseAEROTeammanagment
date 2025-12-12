import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_ROSE_AI } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateAIResponse = async (prompt: string, context?: string): Promise<string> => {
  if (!ai) {
    return "SECURE TERMINAL: API KEY NOT DETECTED. AI MODULE OFFLINE.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const fullPrompt = context ? `CONTEXT: ${context}\n\nQUERY: ${prompt}` : prompt;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_ROSE_AI,
        temperature: 0.3, // Low temperature for more deterministic/analytical responses
      }
    });

    return response.text || "NO DATA RECEIVED.";
  } catch (error) {
    console.error("AI Operations Error:", error);
    return "SYSTEM ERROR: UNABLE TO PROCESS REQUEST.";
  }
};

export const analyzeTaskRisk = async (taskDescription: string): Promise<string> => {
  return generateAIResponse(`Analyze the security and operational risks associated with this task. Provide a bulleted list of potential bottlenecks and a risk score (1-100). Task: ${taskDescription}`);
};

export const summarizeChat = async (chatLog: string): Promise<string> => {
  return generateAIResponse(`Provide a 60-second executive briefing summary of the following communication log. Highlight action items. Log: ${chatLog}`);
};

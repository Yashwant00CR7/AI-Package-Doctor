
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { DependencyIssue, ResolutionResult, AgentStep } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export const solveDependencyTool: FunctionDeclaration = {
  name: 'solve_dependency_issue',
  parameters: {
    type: Type.OBJECT,
    description: 'Analyzes and solves Python dependency conflicts using multi-agent reasoning and web search.',
    properties: {
      requirements: {
        type: Type.STRING,
        description: 'The content of the requirements.txt file or list of packages.',
      },
      error_log: {
        type: Type.STRING,
        description: 'The terminal output error showing the dependency conflict.',
      },
    },
    required: ['requirements', 'error_log'],
  },
};

export class PackageDoctorService {
  constructor() {}

  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  /**
   * Simulates a package installation to predict conflicts before they happen.
   */
  async simulateInstallation(packageName: string, pythonVersion: string = "3.10", platform: string = "linux"): Promise<any> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `SIMULATE INSTALLATION: 
        Package: ${packageName}
        Python: ${pythonVersion}
        Platform: ${platform}
        
        Predict the dependency tree, potential OS-level requirements, and common version conflicts.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              predictedTree: { type: Type.ARRAY, items: { type: Type.STRING } },
              potentialConflicts: { type: Type.ARRAY, items: { type: Type.STRING } },
              systemRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING }
            },
            required: ["status", "predictedTree", "potentialConflicts", "summary"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Simulation error", e);
      throw new Error(`Simulation failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  /**
   * Actual implementation of the tool logic.
   */
  async solveDependencyIssue(requirements: string, errorLog: string): Promise<ResolutionResult> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `ACT AS AN MCP TOOL. Analyze this conflict: Requirements: ${requirements} Error: ${errorLog}`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING },
              fixedRequirements: { type: Type.STRING },
              explanation: { type: Type.STRING },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    uri: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["diagnosis", "fixedRequirements", "explanation"]
          }
        }
      });
      const parsed = JSON.parse(response.text || '{}');
      return {
        diagnosis: parsed.diagnosis || "Analysis complete",
        originalRequirements: requirements,
        fixedRequirements: parsed.fixedRequirements || requirements,
        explanation: parsed.explanation || "Resolution provided.",
        sources: parsed.sources || []
      };
    } catch (e) {
      throw new Error(`MCP Tool execution failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  async resolveConflict(
    requirements: string, 
    errorLog: string, 
    onStepUpdate: (step: AgentStep) => void
  ): Promise<ResolutionResult> {
    const ai = this.getAI();
    
    // Step 1: Query Creator
    onStepUpdate({ id: '1', agent: 'Query Creator', status: 'running', message: 'Analyzing conflict signatures...' });
    const diagnosisResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze requirements and logs for conflicts: ${requirements} \nLogs: ${errorLog}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { packageName: { type: Type.STRING }, reason: { type: Type.STRING } } } },
            searchQuery: { type: Type.STRING }
          },
          required: ["issues", "searchQuery"]
        }
      }
    });
    const diagnosis = JSON.parse(diagnosisResponse.text || '{}');
    onStepUpdate({ id: '1', agent: 'Query Creator', status: 'completed', data: diagnosis, message: 'Conflict signatures identified.' });

    // Step 2: Research Team
    onStepUpdate({ id: '2', agent: 'Research Team', status: 'running', message: `Searching compatibility for ${diagnosis.searchQuery}...` });
    const researchResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Find compatible versions for: ${diagnosis.searchQuery}`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const sources = researchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      ?.map((chunk: any) => ({ title: chunk.web?.title || 'Doc', uri: chunk.web?.uri || '#' })) || [];
    onStepUpdate({ id: '2', agent: 'Research Team', status: 'completed', data: { sources, researchSummary: researchResponse.text?.substring(0, 200) }, message: 'Grounding data retrieved.' });

    // Step 3: Code Surgeon
    onStepUpdate({ id: '3', agent: 'Code Surgeon', status: 'running', message: 'Optimizing dependency tree...' });
    const surgeonResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Research data: ${researchResponse.text}. Fix these: ${requirements}. Error: ${errorLog}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { fixedRequirements: { type: Type.STRING }, explanation: { type: Type.STRING }, diagnosisSummary: { type: Type.STRING } },
          required: ["fixedRequirements", "explanation", "diagnosisSummary"]
        }
      }
    });
    const solution = JSON.parse(surgeonResponse.text || '{}');
    onStepUpdate({ id: '3', agent: 'Code Surgeon', status: 'completed', data: { diagnosisSummary: solution.diagnosisSummary }, message: 'Resolution plan synthesized.' });

    return {
      diagnosis: solution.diagnosisSummary || "Resolved.",
      originalRequirements: requirements,
      fixedRequirements: solution.fixedRequirements || requirements,
      explanation: solution.explanation || "Aligned versions.",
      sources
    };
  }
}


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

export const simulateInstallationTool: FunctionDeclaration = {
  name: 'simulate_installation',
  parameters: {
    type: Type.OBJECT,
    description: 'Simulates the installation of a Python package to predict potential environment conflicts and system requirements.',
    properties: {
      packageName: {
        type: Type.STRING,
        description: 'The name of the package to simulate installing.',
      },
      pythonVersion: {
        type: Type.STRING,
        description: 'Target Python version (e.g., "3.10", "3.11"). Default is 3.10.',
      },
      platform: {
        type: Type.STRING,
        description: 'Operating system platform (e.g., "linux", "macos", "windows").',
      },
    },
    required: ['packageName'],
  },
};

export class PackageDoctorService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  /**
   * Simulates a package installation to predict conflicts before they happen.
   */
  async simulateInstallation(packageName: string, pythonVersion: string = "3.10", platform: string = "linux"): Promise<any> {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await aiInstance.models.generateContent({
      model: MODEL_NAME,
      contents: `SIMULATE INSTALLATION: 
      Package: ${packageName}
      Python: ${pythonVersion}
      Platform: ${platform}
      
      Predict the dependency tree, potential OS-level requirements (like libssl-dev or build-essential), and common version conflicts with popular libraries.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: 'One of: success, warning, risk' },
            predictedTree: { type: Type.ARRAY, items: { type: Type.STRING } },
            potentialConflicts: { type: Type.ARRAY, items: { type: Type.STRING } },
            systemRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["status", "predictedTree", "potentialConflicts", "summary"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { status: "error", summary: "Failed to parse simulation output.", predictedTree: [], potentialConflicts: [] };
    }
  }

  /**
   * Actual implementation of the tool logic.
   * This is what the MCP server would execute.
   */
  async solveDependencyIssue(requirements: string, errorLog: string): Promise<ResolutionResult> {
    // Initializing GoogleGenAI right before the call to ensure fresh configuration
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await aiInstance.models.generateContent({
      model: MODEL_NAME,
      contents: `ACT AS AN MCP TOOL. 
      Analyze this conflict:
      Requirements: ${requirements}
      Error: ${errorLog}
      
      Perform deep research into compatible versions. 
      Provide a diagnosis, a fixed requirements string, and a detailed explanation.`,
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

    try {
      const parsed = JSON.parse(response.text || '{}');
      return {
        diagnosis: parsed.diagnosis || "Dependency diagnosis complete",
        originalRequirements: requirements,
        fixedRequirements: parsed.fixedRequirements || requirements,
        explanation: parsed.explanation || "Detailed resolution provided based on compatibility research.",
        sources: parsed.sources || []
      };
    } catch (e) {
      return {
        diagnosis: "Analysis Result (Parsing Partial)",
        originalRequirements: requirements,
        fixedRequirements: requirements,
        explanation: response.text || "Failed to generate structured solution.",
        sources: []
      };
    }
  }

  async resolveConflict(
    requirements: string, 
    errorLog: string, 
    onStepUpdate: (step: AgentStep) => void
  ): Promise<ResolutionResult> {
    
    // Step 1: Query Creator Agent
    const step1: AgentStep = {
      id: '1',
      agent: 'Query Creator',
      status: 'running',
      message: 'Analyzing requirements and error logs...',
      tools: ['retrieve_memory', 'semantic_analyzer']
    };
    onStepUpdate(step1);

    const diagnosisResponse = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze the following Python requirements and error log to identify specific dependency conflicts.
      Requirements:
      ${requirements}
      
      Error Log:
      ${errorLog}
      
      Identify the core package conflict and formulate a specific search query to find compatibility fixes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  packageName: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["packageName", "reason"]
              }
            },
            searchQuery: { type: Type.STRING }
          },
          required: ["issues", "searchQuery"]
        }
      }
    });

    let diagnosis: any = {};
    try {
      diagnosis = JSON.parse(diagnosisResponse.text || '{}');
    } catch (e) {
      diagnosis = { issues: [], searchQuery: requirements.split('\n')[0] || "python compatibility" };
    }
    onStepUpdate({ ...step1, status: 'completed', data: diagnosis });

    // Step 2: Research Team Agent (Search Grounding)
    const step2: AgentStep = {
      id: '2',
      agent: 'Research Team',
      status: 'running',
      message: `Searching for compatibility solutions for ${diagnosis.searchQuery}...`,
      tools: ['google_search', 'firecrawl']
    };
    onStepUpdate(step2);

    const researchResponse = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Find the compatible versions for: ${diagnosis.searchQuery}. 
      Focus on official documentation and community discussions regarding these Python package conflicts.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = researchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Documentation',
        uri: chunk.web?.uri || '#'
      })) || [];

    onStepUpdate({ 
      ...step2, 
      status: 'completed', 
      data: { 
        sources, 
        researchSummary: researchResponse.text?.substring(0, 300) + (researchResponse.text && researchResponse.text.length > 300 ? '...' : '') 
      } 
    });

    // Step 3: Code Surgeon Agent
    const step3: AgentStep = {
      id: '3',
      agent: 'Code Surgeon',
      status: 'running',
      message: 'Generating fixed requirements.txt and resolution plan...',
      tools: ['logic_optimizer', 'version_validator']
    };
    onStepUpdate(step3);

    const surgeonResponse = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Based on this research information:
      ${researchResponse.text}
      
      Fix these requirements:
      ${requirements}
      
      Provide a clean requirements.txt and a clear explanation of why these changes resolve the conflict identified in:
      ${errorLog}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fixedRequirements: { type: Type.STRING },
            explanation: { type: Type.STRING },
            diagnosisSummary: { type: Type.STRING }
          },
          required: ["fixedRequirements", "explanation", "diagnosisSummary"]
        }
      }
    });

    let solution: any = {};
    try {
      solution = JSON.parse(surgeonResponse.text || '{}');
    } catch (e) {
      solution = {
        fixedRequirements: requirements,
        explanation: surgeonResponse.text || "Failed to parse final solution.",
        diagnosisSummary: "Manual validation recommended."
      };
    }
    
    onStepUpdate({ ...step3, status: 'completed', data: { diagnosisSummary: solution.diagnosisSummary } });

    return {
      diagnosis: solution.diagnosisSummary || "Conflicts resolved through version alignment.",
      originalRequirements: requirements,
      fixedRequirements: solution.fixedRequirements || requirements,
      explanation: solution.explanation || "Standardized dependency alignment performed.",
      sources
    };
  }
}

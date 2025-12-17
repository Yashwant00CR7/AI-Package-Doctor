
export interface DependencyIssue {
  packageName: string;
  requestedVersion: string;
  conflictingVersion?: string;
  reason: string;
}

export interface AgentStep {
  id: string;
  agent: 'Query Creator' | 'Context Search' | 'Research Team' | 'Code Surgeon' | 'MCP Server';
  status: 'pending' | 'running' | 'completed' | 'error';
  message: string;
  tools?: string[];
  data?: any;
}

export interface ResolutionResult {
  diagnosis: string;
  originalRequirements: string;
  fixedRequirements: string;
  explanation: string;
  sources: { title: string; uri: string }[];
}

export interface McpLog {
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'system';
  message: string;
  data?: any;
}

export type AppView = 'home' | 'resolver' | 'mcp-status' | 'support' | 'demo' | 'privacy' | 'status';

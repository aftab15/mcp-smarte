// ChatGPT window.openai API types
export interface OpenAIGlobal {
  toolOutput?: any;
  locale?: string;
  sessionId?: string;
  triggerServerAction?: (action: string, payload?: any) => Promise<void>;
  sendFollowUp?: (message: string) => void;
  closeWidget?: () => void;
  requestLayout?: (layout: 'compact' | 'expanded') => void;
  persistState?: (state: any) => void;
  getPersistedState?: () => any;
}

declare global {
  interface Window {
    openai: OpenAIGlobal;
  }
}

// Tool output types from MCP server
export type ToolOutputType = 
  | 'contact_reveal'
  | 'account_reveal'
  | 'search_results'
  | 'data_insights'
  | 'error';

export interface ToolOutput {
  type: ToolOutputType;
  data: any;
}

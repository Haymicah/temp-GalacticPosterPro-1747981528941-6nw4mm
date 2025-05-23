export interface PromptHistory {
  id: string;
  prompt: string;
  type: string;
  timestamp: string | Date; // Can be either string (when stored) or Date (when used)
}

export interface HistoryGroup {
  date: string;
  prompts: PromptHistory[];
}
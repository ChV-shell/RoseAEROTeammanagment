export interface User {
  username: string;
  displayName: string;
  roleCallsign: string;
  realName: string;
  jobTitle: string;
  avatar?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string; // Callsign
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  progress: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  channel: string; // Added for channel separation
  isSystem?: boolean;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'CAD';
  securityLevel: 'Low' | 'Internal' | 'Restricted' | 'TopSecure';
  owner: string;
  date: string;
  size: string;
}

export interface AnalyticsData {
  name: string;
  value: number;
  dept?: string;
}

export type ViewState = 'dashboard' | 'tasks' | 'chat' | 'documents' | 'analytics';

export interface CloudConfig {
  apiUrl: string;
  apiKey: string;
  enabled: boolean;
}
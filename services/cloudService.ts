import { Task, ChatMessage, CloudConfig } from '../types';

// Bu servis, uygulamanın internet üzerinden veri alışverişi yapmasını sağlar.
// Supabase (PostgreSQL) veya herhangi bir REST API ile uyumludur.

export const syncTasksFromCloud = async (config: CloudConfig): Promise<Task[] | null> => {
  if (!config.enabled || !config.apiUrl) return null;

  try {
    const response = await fetch(`${config.apiUrl}/rest/v1/tasks?select=*`, {
      method: 'GET',
      headers: {
        'apikey': config.apiKey,
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data as Task[];
    }
  } catch (error) {
    console.error("Cloud Sync Error (Tasks):", error);
  }
  return null;
};

export const syncMessagesFromCloud = async (config: CloudConfig): Promise<ChatMessage[] | null> => {
  if (!config.enabled || !config.apiUrl) return null;

  try {
    const response = await fetch(`${config.apiUrl}/rest/v1/messages?select=*&order=timestamp.asc`, {
      method: 'GET',
      headers: {
        'apikey': config.apiKey,
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data as ChatMessage[];
    }
  } catch (error) {
    console.error("Cloud Sync Error (Messages):", error);
  }
  return null;
};

export const pushTaskToCloud = async (config: CloudConfig, task: Task) => {
  if (!config.enabled || !config.apiUrl) return;

  try {
    await fetch(`${config.apiUrl}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'apikey': config.apiKey,
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(task)
    });
  } catch (error) {
    console.error("Cloud Push Error (Task):", error);
  }
};

export const pushMessageToCloud = async (config: CloudConfig, message: ChatMessage) => {
  if (!config.enabled || !config.apiUrl) return;

  try {
    await fetch(`${config.apiUrl}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        'apikey': config.apiKey,
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(message)
    });
  } catch (error) {
    console.error("Cloud Push Error (Message):", error);
  }
};

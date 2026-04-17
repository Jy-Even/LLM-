import { WikiPage, ChatMessage, SearchResult } from '../types';

const API_BASE = '/api';

export const api = {
  // Wiki Pages
  async getWikiPages(): Promise<WikiPage[]> {
    const res = await fetch(`${API_BASE}/wiki`);
    return res.json();
  },

  async saveWikiPage(page: Partial<WikiPage>): Promise<{ status: string; id: string }> {
    const res = await fetch(`${API_BASE}/wiki`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    return res.json();
  },

  // Chat
  async getChatHistory(): Promise<ChatMessage[]> {
    const res = await fetch(`${API_BASE}/chat`);
    return res.json();
  },

  async sendChatMessage(msg: { role: string; content: string }): Promise<{ status: string; id: number }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    return res.json();
  },

  // Search
  async search(query: string): Promise<SearchResult[]> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  }
};

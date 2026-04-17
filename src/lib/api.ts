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
  async getChatHistory(sessionId?: string): Promise<ChatMessage[]> {
    const url = sessionId ? `${API_BASE}/chat?sessionId=${sessionId}` : `${API_BASE}/chat`;
    const res = await fetch(url);
    return res.json();
  },

  async sendChatMessage(msg: { role: string; content: string; sessionId?: string }): Promise<{ status: string; id: number }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    return res.json();
  },

  async getChatSessions(): Promise<{ id: string; title: string; date: string }[]> {
    const res = await fetch(`${API_BASE}/chat/sessions`);
    return res.json();
  },

  async saveChatSession(session: { id: string; title: string; date: string }): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/chat/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    return res.json();
  },

  async deleteChatSession(id: string): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/chat/sessions/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Search
  async search(query: string): Promise<SearchResult[]> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  }
};

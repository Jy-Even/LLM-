import * as d3 from 'd3';

export type ModuleId = 'upload' | 'wiki' | 'search' | 'chat' | 'schema' | 'quality';

export interface WikiPage {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  author: string;
  citations: number;
  snippet?: string;
  source?: string;
  relevance?: number;
  type?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  source: string;
  relevance: number;
  type: 'pdf' | 'doc' | 'web' | 'note';
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thought?: string;
  citations?: { id: string; text: string; pageTitle: string }[];
}

export interface UploadFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'md';
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  content?: string;
  previewUrl?: string;
}

export interface QualityIssue {
  id: string;
  type: 'contradiction' | 'isolated' | 'outdated' | 'broken-link' | 'format';
  severity: 'error' | 'warning' | 'suggestion';
  description: string;
  affectedPages: string[];
  timestamp: string;
  canAutoFix: boolean;
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'page' | 'tag' | 'author';
  val: number;
  connectionType?: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'citation' | 'tag' | 'author';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

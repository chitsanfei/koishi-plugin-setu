export interface SetuData {
  pid: number;
  p: number;
  uid: number;
  title: string;
  author: string;
  url: string;
  r18: boolean;
  width: number;
  height: number;
  tags: string[];
  ext: string;
  aiType: number;
  uploadDate: number;
  urls: {
    original: string;
    regular: string;
    small: string;
    thumb: string;
    mini: string;
  };
}

export interface LoliconResponse {
  error?: string;
  data: SetuData[];
}

export interface ApiProvider {
  name: string;
  getSetu(options: SetuOptions): Promise<LoliconResponse>;
}

export interface SetuOptions {
  r18?: number;
  num?: number;
  size?: "original" | "regular" | "small" | "thumb" | "mini";
  proxy?: string;
  author?: number;
  excludeAI?: boolean;
  tags?: string[];
}

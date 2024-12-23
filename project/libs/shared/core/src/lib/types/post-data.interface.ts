export interface VideoData {
  title: string;
  url: string;
}

export interface TextData {
  title: string;
  previewText: string;
  text: string;
}

export interface QuoteData {
  quote: string;
  author: string;
}

export interface PhotoData {
  imagePath: string;
}

export interface LinkData {
  url: string;
  text?: string;
}

export type PostData = VideoData | TextData | QuoteData | PhotoData | LinkData;

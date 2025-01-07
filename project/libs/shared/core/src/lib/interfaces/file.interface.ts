export interface File {
  id?: string;
  originalName: string;
  hashName: string;
  subDirectory: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

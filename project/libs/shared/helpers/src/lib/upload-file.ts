import { AxiosInstance } from 'axios';

export async function uploadFile<T>(axiosRef: AxiosInstance, fileUploadUrl: string, avatarFile: Express.Multer.File): Promise<T> {
  const fileFormData = new FormData();
  const fileBlob = new Blob([avatarFile.buffer], { type: avatarFile.mimetype });
  const originalFilename = Buffer.from(avatarFile.originalname, 'ascii').toString(); // коректное сохраниние исходного имени

  fileFormData.append('file', fileBlob, originalFilename);

  const { data: fileUploadData } = await axiosRef.post<T>(fileUploadUrl, fileFormData);

  return fileUploadData;
}

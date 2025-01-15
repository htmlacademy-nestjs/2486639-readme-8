import 'multer'; // Express.Multer.File
import axios from 'axios';

const HTTP_CLIENT_MAX_REDIRECTS = 5;
const HTTP_CLIENT_TIMEOUT = 3000;

export async function uploadFile<T>(
  fileUploadUrl: string,
  avatarFile: Express.Multer.File,
  name: string,
  timeout = HTTP_CLIENT_TIMEOUT,
  maxRedirects = HTTP_CLIENT_MAX_REDIRECTS
): Promise<T> {
  const fileFormData = new FormData();
  const fileBlob = new Blob([avatarFile.buffer], { type: avatarFile.mimetype });
  const originalFilename = Buffer.from(avatarFile.originalname, 'ascii').toString(); // коректное сохраниние исходного имени

  fileFormData.append(name, fileBlob, originalFilename);

  const { data: fileUploadData } = await axios.post<T>(fileUploadUrl, fileFormData, { timeout, maxRedirects });

  return fileUploadData;
}

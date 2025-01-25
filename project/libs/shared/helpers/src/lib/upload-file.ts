import 'multer'; // Express.Multer.File
import axios from 'axios';

import { multerFileToFormData } from './form-data';
import { makeHeaders } from './headers';

const HTTP_CLIENT_MAX_REDIRECTS = 5;
const HTTP_CLIENT_TIMEOUT = 3000;

export async function uploadFile<T>(
  fileUploadUrl: string,
  file: Express.Multer.File,
  name: string,
  requestId: string,
  timeout = HTTP_CLIENT_TIMEOUT,
  maxRedirects = HTTP_CLIENT_MAX_REDIRECTS
): Promise<T> {
  const fileFormData = new FormData();

  multerFileToFormData(file, fileFormData, name);

  const { data: fileUploadData } = await axios.post<T>(
    fileUploadUrl,
    fileFormData,
    { timeout, maxRedirects, ...makeHeaders(requestId) });

  return fileUploadData;
}

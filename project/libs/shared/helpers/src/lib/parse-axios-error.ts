import { AxiosError } from 'axios';

export function parseAxiosError(error: AxiosError): object {
  const { request, response, cause } = error;

  // проблемы подключения
  if (cause) {
    const errors = cause['errors'];
    const { _currentUrl: url, _options: { headers, method } } = request;

    return { url, method, headers, errors };
  }

  // есть ответ
  if (response) {
    const { data, config: { url, method } } = response;

    return { url, method, data };
  }

  return error;
}

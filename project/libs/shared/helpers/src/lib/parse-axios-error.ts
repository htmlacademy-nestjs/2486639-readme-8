import { AxiosError } from 'axios';

export function parseAxiosError(error: AxiosError): object {
  const { request, response, cause } = error;

  // проблемы подключения
  if (cause) {
    const errors = cause['errors'];
    const { _currentUrl: url, _options: { headers } } = request;

    return { url, headers, errors };
  }

  // есть ответ
  if (response) {
    const { data, config: { url } } = response;

    return { url, data };
  }

  return error;
}

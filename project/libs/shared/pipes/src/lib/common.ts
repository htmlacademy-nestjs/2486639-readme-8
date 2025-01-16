export const BAD_GUID_ERROR = 'Bad GUID';
export const GUID_REGEXP = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;
export const BAD_MONGO_ID_ERROR = 'Bad entity ID';

export function checkType(type: string): void {
  if (type !== 'param') {
    throw new Error('This pipe must used only with params!');
  }
}

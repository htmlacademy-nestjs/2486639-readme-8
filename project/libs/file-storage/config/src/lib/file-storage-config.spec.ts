import { fileStorageConfig } from './file-storage-config';

describe('fileStorageConfig', () => {
  it('should work', () => {
    expect(fileStorageConfig()).toEqual('file-storage-config');
  });
});

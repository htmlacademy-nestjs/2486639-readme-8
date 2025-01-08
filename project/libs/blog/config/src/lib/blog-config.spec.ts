import { blogConfig } from './blog-config';

describe('blogConfig', () => {
  it('should work', () => {
    expect(blogConfig()).toEqual('blog-config');
  });
});

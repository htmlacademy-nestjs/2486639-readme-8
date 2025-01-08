import { notifyMail } from './notify-mail';

describe('notifyMail', () => {
  it('should work', () => {
    expect(notifyMail()).toEqual('notify-mail');
  });
});

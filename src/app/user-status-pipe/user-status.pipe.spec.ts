import { UserStatusPipe } from './user-status.pipe';

describe('StatusPipe', () => {
  it('create an instance', () => {
    const pipe = new UserStatusPipe();
    expect(pipe).toBeTruthy();
  });
});

import { User } from '../libs/shared/core/src/lib/types/user.interface';

type MockUser = User & { password: string };

export const MOCK_USERS: MockUser[] = [
  {
    id: '658170cbb954e9f5b905ccf4',
    email: 'user@local.local',
    name: 'user',
    avatarPath: '',
    password: 'password'
  },
  {
    id: '6581762309c030b503e30512',
    email: 'user2@local.local',
    name: 'user2',
    avatarPath: '',
    password: 'password'
  },
  {
    id: '67971df996da19e7f31a2d5f',
    email: 'user3@local.local',
    name: 'user3',
    avatarPath: '',
    password: 'password'
  }
];

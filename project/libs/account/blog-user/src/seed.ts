import mongoose, * as Mongoose from 'mongoose';
import { genSalt, hash } from 'bcrypt';

// отключил правила импорта для скрипта наполения данными
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ConfigAlias } from '../../../shared/core/src/lib/constants/config-alias';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthUser } from '../../../shared/core/src/lib/types/auth-user.interface';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getMongoConnectionString } from '../../../shared/helpers/src/lib/common';
import { SALT_ROUNDS, ACCOUNTS_COLLECTION } from '../../../account/blog-user/src/blog-user.constant';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MOCK_USERS } from '../../../../mocks/users';

const UserSchema = new Mongoose.Schema(
  {
    email: { type: String, unique: true },
    name: { type: String },
    avatarPath: { type: String },
    passwordHash: { type: String },
    createdAt: { type: Date }
  },
  { timestamps: true }
);

const UserEntity =
  (mongoose.models.User as Mongoose.Model<AuthUser>) ||
  mongoose.model<AuthUser>(ACCOUNTS_COLLECTION, UserSchema);

async function bootstrap() {
  const mongodbOption = {
    host: process.env[ConfigAlias.MongoDbHostEnv],
    port: process.env[ConfigAlias.MongoDbPortEnv],
    user: process.env[ConfigAlias.MongoDbUserEnv],
    password: process.env[ConfigAlias.MongoDbPasswordEnv],
    database: process.env[ConfigAlias.MongoDbDatabaseEnv],
    authBase: process.env[ConfigAlias.MongoDbAuthBaseEnv]
  };
  const mongoDbUrl = getMongoConnectionString(mongodbOption);

  const mongoose = await Mongoose.connect(mongoDbUrl);
  const salt = await genSalt(SALT_ROUNDS);

  for (const mockUser of MOCK_USERS) {
    const { id: _id, email, name, password, avatarPath } = mockUser;
    const passwordHash = await hash(password, salt);
    await new UserEntity({ _id, email, name, avatarPath, passwordHash }).save();
  }

  await mongoose.disconnect?.();
  console.info('🤘️ Database was filled');
}

bootstrap();

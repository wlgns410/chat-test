import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const TypeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'password',
  database: 'broadcast',
  entities: [path.join(__dirname, '..', '..', '**', '*.entity{.ts,.js}')],
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
};

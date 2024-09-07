import { DynamicModule, Module } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { connectionToken } from './database.constants';

@Module({})
export class DatabaseModule {
  static register(options: DataSourceOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: connectionToken,
          useValue: new DataSource(options),
        },
      ],
    };
  }
}

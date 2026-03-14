import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool ,QueryResult,QueryResultRow} from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: configService.get("db.dbHost"),
      port: configService.get("db.dbPort"),
      user: configService.get("db.dbUser"),
      password: configService.get("db.dbPass"),
      database: configService.get("db.dbName"),
      max: configService.get("db.dbMaxConnections"),
    });
  }
  
  async query<T extends QueryResultRow = any>(
  text: string,
  params?: any[],
): Promise<QueryResult<T>>  {
   return this.pool.query(text, params);
  }
}
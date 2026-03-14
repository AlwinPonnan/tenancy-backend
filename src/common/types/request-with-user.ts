import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    sessionId: string;
    version?: number
  };
}
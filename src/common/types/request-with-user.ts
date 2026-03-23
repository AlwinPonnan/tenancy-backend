import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    user_id: string;
    sessionId: string;
    version?: number
  }
  context?:{};
}
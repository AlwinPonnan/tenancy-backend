import { Request } from 'express';

export interface RequestWithOrgAndUser extends Request {
  context: {
    user_id: string;
    organization_id: string;
    role: string;
  },
  user:{
     user_id: string;
    sessionId: string;
    version?: number
  };
}

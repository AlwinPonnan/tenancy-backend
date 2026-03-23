export interface ResCreateProject {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
}


export interface ResGetProjectsByOrgAndUser {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
}

export interface ResGetProjectByIdAndOrg {
 id:string,
 organization_id:string,
 name:string,
 description:string,
 status:ProjectStatus,
 priority:ProjectPriority,
 due_date:Date
}


export interface ResGetProjectByIdAndOrg {
 id:string,
 organization_id:string,
 name:string,
 description:string,
 status:ProjectStatus,
 priority:ProjectPriority,
 due_date:Date,
 deleted_at:Date | null,
 created_at:Date,
}




export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type ProjectStatus =
  typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];


export const PROJECT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type ProjectPriority =
  typeof PROJECT_PRIORITY[keyof typeof PROJECT_PRIORITY];
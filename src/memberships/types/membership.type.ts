export interface ResCreateMembership {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
}


export interface ResGetMembershipByOrgAndUser {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
}

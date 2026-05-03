export enum UserRole {
  SOCIETY = 'SOCIETY',
  MEDIATOR = 'MEDIATOR',
  STUDENT = 'STUDENT',
}

export type AuthenticateUserResponse = {
  accessToken: string;
  role: UserRole;
};

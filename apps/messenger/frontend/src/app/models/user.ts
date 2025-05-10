export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  locale?: string;
  country?: string;
  permissions?: UserPermissions[];
  subscription?: UserSubscription;
  dateCreated: string | null;
  lastModified: string | null;
}

export enum UserPermissions {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserSubscription {
  FREE = 'FREE',
}

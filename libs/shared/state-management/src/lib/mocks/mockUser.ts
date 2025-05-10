import { AccountType, User, UserPermissions, UserSubscription } from "@shared/models";
import dayjs from 'dayjs';

export const mockUsers: User[] = [
  {
    id: "123456",
    email: "jamesprenticez@gmail.com",
    firstName: "james",
    lastName: "prentice",
    phone: "123456789",
    profilePicture:
      "https://images.unsplash.com/photo-1568162603664-fcd658421851?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8fA%3D%3D",
    country: "New Zealand",
    locale: "en-gb",
    permissions: [UserPermissions.ADMIN],
    subscription: UserSubscription.FREE,
    dateCreated: dayjs().toISOString(),
    lastModified: dayjs().toISOString(),
    type: AccountType.ONLINE,
  },
];
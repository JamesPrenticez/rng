import type { User } from "./user.types";

export interface Room {
  id: string;
  name: string;
  hostId: string;
  users: User[];
}
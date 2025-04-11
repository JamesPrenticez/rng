import type { User } from "./user";

export interface Room {
  id: string;
  name: string;
  hostId: string;
  users: User[];
}
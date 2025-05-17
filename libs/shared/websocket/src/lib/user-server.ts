import { User } from "@shared/models";
import { v4 as uuidv4 } from 'uuid';

export function createMockSession(): User {
  return {
    id: uuidv4(),
    username: "mock-user",
    name: "jimmy",
    source: "mock",
    sessionId: "",
  
    balance: 10000,
    currency: 'USD'
  };
}
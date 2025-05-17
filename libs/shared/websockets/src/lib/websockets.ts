import { User } from "@shared/models";

export const createMockSession = (): User => {
  return {
    id: "123",
    username: "mock-user",
    name: "jimmy",
    source: "mock",
    sessionId: "",
  
    balance: 10000,
    currency: 'USD'
  };
}
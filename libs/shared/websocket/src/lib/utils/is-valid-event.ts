import { UserServerContext } from "../types";

export const isValidEvent = (context: UserServerContext) => {
    return (type: string, event: string) => {
        if (!context.validServices.has(type)) return false;
        if (!context.validEvents.has(type)) return false;
        const arr = context.validEvents.get(type);
        if (Array.isArray(arr) && arr.includes(event)) return true;
        return false;
    };
};
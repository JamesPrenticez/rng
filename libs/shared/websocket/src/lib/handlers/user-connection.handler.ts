import { BaseEvents, createEvent, createUserEvent } from "@shared/events";
import { Socket } from "socket.io";
import { isValidEvent } from "../utils/is-valid-event";
import { UserServerContext } from "../types";

export const UserConnectionHandler =
    (context: UserServerContext) => async (socket: Socket) => {
        const user = socket.data.user;

        let timer: ReturnType<typeof setTimeout> | null = null;

        const userAlreadyExists = context.users.get(user.id);

        if (userAlreadyExists) {
            if (timer) clearTimeout(timer);
        }

        // Disconnect previous connections for the same user ID
        if (userAlreadyExists) {
            const previousSocket = context.users.get(user.id)?.socket;

            if (previousSocket?.connected) {
                console.log("Duplicate Session")
                previousSocket.disconnect(true);
            }
        }

        // Associate the current socket with the user ID
        context.users.set(user.id, user);
        socket.emit(...createUserEvent(user.toData(false), user.name === ''));

        const safeUsers = Array.from(context.users.values()).map((u) => u.toData(false));
        context.emitter.emit(BaseEvents.UsersUpdate, safeUsers);

        socket.onAny((eventName, ...args) => {
            if (!isValidEvent(context)('players', eventName)) {
                console.log("Invalid Player Event:", eventName)
                return;
            }
            context.emitter.emit(eventName, user, ...args, socket);
        });

        socket.once('disconnect', () => {
            context.users.delete(user.id);

            context.emitter.emit(BaseEvents.UserDisconnect, user.id);
            socket.removeAllListeners();
        });
    };

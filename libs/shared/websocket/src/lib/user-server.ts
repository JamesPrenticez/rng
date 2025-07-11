import { OrbitUser } from "@shared/models";
import { OrbitSocket, UserServerContext, UserServerOptions } from "./types";
import os from 'node:os';

export type OrbitGameUser = OrbitUser<OrbitSocket>;

// Node Modules
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { EventEmitter } from 'node:events';
import { createUserEvent } from "@shared/events";
import { PlayerServer } from "./player-server";

const getInterfaceIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        if (interfaces[name]) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
    }
    return '127.0.0.1';
};

const getCors = (port: number, cors?: string | string[]) => {
    if (!cors) {
        if (process.env.NODE_ENV === 'development') {
            const appPort = port + 1000;
            const dealerPort = port + 1020;

            const ips = [getInterfaceIP(), 'localhost'];
            const ports = [appPort, dealerPort, 4220];

            if (process.env.IP) {
                ips.push(process.env.IP);
            }

            const allowed = ips.reduce((acc: string[], ip) => {
                ports.forEach((port) => {
                    acc.push(`http://${ip}:${port}`);
                });
                return acc;
            }, []);

            return allowed;
        }
        return '*';
    }
    if (Array.isArray(cors)) return [...cors];
    return cors;
};

export const UserServer = (
  options: UserServerOptions,
) => {

    const httpServer = createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); // Use specific origin for production
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
    });

    const context: UserServerContext = {
        users: new Map<string, OrbitGameUser>(),
        validEvents: new Map<string, string[]>(),
        validServices: new Set<string>(),
        validOutgoingEvents: new Map<string, string[]>(),
        emitter: new EventEmitter(),
        io: new Server(httpServer, {
            cors: {
                origin: getCors(options.port, options.cors),
                credentials: true,
                allowedHeaders: [
                    'x-animo-auth-token',
                    'x-animo-session',
                    'sentry-trace',
                    'baggage',
                ],
            },
        }),
        options,
        // game: gameData,
        // defaultGameSettings,
        // log: loggers,
        // privateGamePasscode: [],
    };

    //=============================================
    // HTTP API calls
    // Return i18n language json data
    // httpServer.on('request', i18nJsonDataHandler());
    //=============================================

    // Socket.io
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            credentials: true,
        },
    });


    // Simple event emitter (if you want to use it in dev)
    const emitter = new EventEmitter();

    PlayerServer(context)

    // Start server
    httpServer.listen(options.port, () => {
        console.log(`Dev server running at http://localhost:${options.port}`);
    });

    return {
        context,
        emitter,
        broadcast: (event: string, data: any) => io.emit(event, data),
        cleanup: () => io.close(),
    };
};

export type IUserServer = ReturnType<typeof UserServer>;

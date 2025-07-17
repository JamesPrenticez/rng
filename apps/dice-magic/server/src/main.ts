import { 
  UserServer
} from '@shared/websocket';

// Eventually move this to DiceMagicService.. but for now we are just testing out userServer.Broadcast
import { createRoundStartEvent, Events } from "@dice-magic/models"

const userServer = UserServer({
  port: 3202
})

const startBetTimer = () => {
    const startTime = Date.now();

    userServer.broadcast(
        createRoundStartEvent(
            "123",
            [1, 2, 3],
            userServer.users(),
            startTime,
            15000
        ),
        [Events.RoundStart]
    );
};

// on player join
// call startBetTimer?


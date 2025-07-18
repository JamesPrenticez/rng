import { 
  UserServer
} from '@shared/websocket';

// Eventually move this to DiceMagicService.. but for now we are just testing out userServer.Broadcast
import { createRoundStartEvent, Events } from "@dice-magic/models"

const userServer = UserServer({
  port: 3202
})



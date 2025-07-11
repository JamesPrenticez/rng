import { UserServer } from '@shared/websocket';
// import { DiceMagicGame } from '@dice-magic/services'

// import { GameSettings } from "@dice-magic/models"

const PORT = 3201;
// const GAME_UUID = "123456789"
// const GAME_SETTINGS = {}

// const gameSettings: GameSettings = {
//   name: "dice-magic",
//   tableSeatLimit: 4,
// }

const playerServer = UserServer(
  {
    port: PORT,
    useMockServer: true,
    disableEvents: false,
    cors: "",
  }
)

// const dmg = DiceMagicGame(pServer, gameSettings);

process.on('exit', () => {
    // log.info('BLACKJACK', 'Cleaning up server');
    // dmg.cleanup();

    playerServer.cleanup();
});

export default {};

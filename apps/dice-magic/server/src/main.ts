import { UserServer } from '@shared/websocket';

import { DiceMagicGame } from '@dice-magic/services';
import { IDiceMagicSettings } from '@dice-magic/models';

const gameSettings: IDiceMagicSettings = {
  name: 'Dice Magic',
  tableSeatLimit: 4,
};

const userServer = UserServer(
  {
    port: 3202,
    useMockServer: true,
  },
  {
    theme: 'gold',
  }
);

const dmg = DiceMagicGame(userServer, gameSettings);

// process.on('exit', () => {
//     // log.info('BLACKJACK', 'Cleaning up server');
//     dmg.cleanup();
//     userServer.cleanup();
// });

export default {};

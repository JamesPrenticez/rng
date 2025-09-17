export enum APP {
  COMPONENT_LIBRARY = 'component-library'
}

export enum GAME {
  DICE_MAGIC = 'dice-magic',
  JUMP_QUEST = 'jump-quest'
}

export interface App {
  name: string;
  clientUrl: string;
  serverUrl: string;
}


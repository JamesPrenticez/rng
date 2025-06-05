export enum APP {
  COMPONENT_LIBRARY = 'component-library'
}

export enum GAME {
  DICE_MAGIC = 'dice-magic'
}

export interface App {
  name: string;
  clientUrl: string;
  serverUrl: string;
}


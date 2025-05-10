import { CSSProperties } from 'react';
import {
  Home as HomeIcon,
  Mail as MailIcon,
  SquareUser as SquareUserIcon,
  UserSearch as UserSearchIcon,
  Settings as SettingsIcon,
} from 'lucide-react';

import { MessengerHome } from '../components/messenger-home/messenger-home';
import { Inbox } from '../components/inbox/inbox';
import { FindContacts } from '../components/contacts/find-contacts';
import { Contacts } from '../components/contacts/contacts';
import { MessengerSettings } from '../components/messenger-settings.tsx/messenger-settings';

export enum NavItems {
  INBOX = 'inbox',
  CONTACTS = 'contacts',
  FIND_CONTACTS = 'find-contacts',
  SETTINGS = 'settings',
  // DOCS = 'docs',
  // TASKS = 'tasks',
}

export interface Item {
  icon?: React.ReactNode;
  title: string;
  content: React.ReactNode;
  height?: string;
  width?: string;
  style?: CSSProperties;
}

export const navList: Record<NavItems, Item> = {
  [NavItems.INBOX]: {
    title: 'Inbox',
    icon: <MailIcon />,
    content: <Inbox />,
  },
  [NavItems.CONTACTS]: {
    title: 'Contacts',
    icon: <SquareUserIcon />,
    content: <Contacts />,
  },
  [NavItems.FIND_CONTACTS]: {
    title: 'Find Contacts',
    icon: <UserSearchIcon />,
    content: <FindContacts />,
  },
  [NavItems.SETTINGS]: {
    title: 'Settings',
    icon: <SettingsIcon />,
    content: <MessengerSettings />,
  },
};

export const navListFlattened: NavItemWithKey[] = Object.entries(navList).map(
  ([key, value]) => ({
    key: key as NavItems,
    ...value,
  })
);

export type NavItemWithKey = Item & {
  key: NavItems;
};

export interface PopUpItemModalProps {
  activeSetting: NavItems | null;
  isMobile: boolean;
}

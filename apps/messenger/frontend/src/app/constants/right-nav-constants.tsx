import { CSSProperties } from 'react';
import {
  Home as HomeIcon,
  Mail as MailIcon,
  SquareUser as SquareUserIcon,
  UserSearch as UserSearchIcon,
  Settings as SettingsIcon,
} from 'lucide-react';

import { Inbox } from '../components/inbox/inbox';
import { FindContacts } from '../components/contacts/find-contacts';
import { Contacts } from '../components/contacts/contacts';
import { MessengerSettings } from '../components/messenger-settings.tsx/messenger-settings';

export enum RightNavItems {
  USER_SETTINGS = 'user-settings',
}

export interface NavItem {
  icon?: React.ReactNode;
  title: string;
  content: React.ReactNode;
  height?: string;
  width?: string;
  style?: CSSProperties;
}

export const rightNavList: Record<RightNavItems, NavItem> = {
  [RightNavItems.USER_SETTINGS]: {
    title: 'Settings',
    icon: <SettingsIcon />,
    content: <MessengerSettings />,
  },
};

export const rightNavListFlattened: NavItemWithKey[] = Object.entries(
  rightNavList
).map(([key, value]) => ({
  key: key as RightNavItems,
  ...value,
}));

export type NavItemWithKey = NavItem & {
  key: RightNavItems;
};

export interface PopUpItemModalProps {
  activeSetting: RightNavItems | null;
  isMobile: boolean;
}

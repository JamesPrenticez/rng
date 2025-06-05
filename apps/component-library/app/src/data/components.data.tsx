import { ReactNode } from 'react';
import { Path } from '../models/paths';

import { HomePage } from '../pages/home.page';

import { 
  ButtonPage,
  InputPage,
  TooltipPage,
  TypographyPage
 } from '../pages/components';

interface ComponentDataProps {
  id: string;
  title: string;
  path: Path | string;
  page: ReactNode;
}

export const COMPONENT_DATA: ComponentDataProps[] = [
  {id: '0', title: 'Home', path: Path.HOME, page: <HomePage /> },
  {id: '1', title: 'Typography', path: Path.TYPOGRAPHY, page: <TypographyPage/> },
  {id: '2', title: 'Button', path: Path.BUTTON, page: <ButtonPage/> },
  {id: '3', title: 'Input', path: Path.INPUT_TEXT, page: <InputPage />},
  {id: '4', title: 'Tooltip', path: Path.TOOLTIP, page: <TooltipPage />},
]
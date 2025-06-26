export type TooltipSide = 'top' | 'left' | 'right' | 'bottom';

export interface ITooltip {
    type: 'mouse' | 'absolute' | 'lib';
    message: string;
    position?: {
        x: number | string;
        y: number | string;
    };
    side?: TooltipSide;
    offset?: number;
    duration: number;
    hasArrow?: boolean;
}

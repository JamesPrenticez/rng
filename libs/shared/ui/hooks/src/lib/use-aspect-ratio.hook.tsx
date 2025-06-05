import styled from '@emotion/styled';
import MobileDetect from 'mobile-detect';
import { useMemo } from 'react';
import { useWindowSize } from './use-window-size.hook';

// document.documentElement refers to the root element of the HTML document, which is typically the <html> element.
// In the context of a web page, it represents the highest level in the DOM hierarchy
// We want update font size which in-turn effects the scaling of all other rem units in our app
// We use "isVertical" as a js variable instead of using a hardcoded media query width
// refer to libs\shared\assets\styles\globals.css

const isTablet = () => {
    return (
        window.matchMedia('(min-width: 600px) and (max-width: 1280px)')
            .matches && navigator.maxTouchPoints > 0
    );
};

const isPortrait = () => {
    return window.matchMedia('(orientation: portrait)').matches;
};

export const useAspectRatio = () => {
    const [width, height] = useWindowSize();

    const isDesktopOrTablet = useMemo(() => {
        // Not really a determiner of desktop
        if (isPortrait()) {
            return isTablet();
        }

        if (width > height) {
            return true;
        }
        const md = new MobileDetect(window.navigator.userAgent);

        return isTablet() || !!md.tablet();
    }, [width, height]);

    return !isDesktopOrTablet;
};

export const AspectRatioComponent = styled.div<{
    isVertical: boolean;
    backgroundImage?: string;
}>`
    position: relative;
    box-sizing: border-box;
    width: ${({ isVertical }) => (isVertical ? '100vw' : '192rem')};
    height: ${({ isVertical }) => (isVertical ? '100dvh' : '108rem')};

    max-height: 100%;

    overflow: hidden;

    min-width: 320px;

    background-image: url(${(props) => props.backgroundImage});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;

    box-sizing: border-box;
    border: solid 1px red;

    display: flex;
    flex-direction: column;
    flex-grow: 1;

    transition: background-image 500ms ease-in-out;
`;

interface AspectRatioWrapperProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    backgroundImage?: string;
    label?: string;
}

export const AspectRatioWrapper = (props: AspectRatioWrapperProps) => {
    const isVertical = useAspectRatio();

    return (
        <AspectRatioComponent
            isVertical={isVertical}
            backgroundImage={props.backgroundImage}
        >
            {props.children}
        </AspectRatioComponent>
    );
};

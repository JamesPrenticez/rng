import styled from '@emotion/styled';
import { useMemo } from 'react';

import { useWindowSize } from './use-window-size.hook';

// document.documentElement refers to the root element of the HTML document, which is typically the <html> element.
// In the context of a web page, it represents the highest level in the DOM hierarchy
// We want update font size which in-turn effects the scaling of all other rem units in our app
// We use "isVertical" as a js variable instead of using a hardcoded media query width
const size = {
    mobile: '768px',
    mobileHeight: '600px',
    tablet: '1024px',
};

export const device = {
    mobilePortrait: `(max-width: ${size.mobile}) and (orientation : portrait)`,
    mobile: `(max-height: ${size.mobileHeight}), (max-width: ${size.mobile})`,
    tablet: `(max-width: ${size.tablet}) and (orientation : portrait)`,
    mobileLandscape: `(max-height: ${size.mobileHeight}) and (orientation : landscape), (max-width: ${size.mobile}) and (orientation : landscape)`,
};

export const isPortrait = () => {
    return window.matchMedia('(orientation: portrait)').matches;
};
export const isLandscape = () => {
    return window.matchMedia('(orientation: landscape)').matches;
};

export type isMobileType =
    | undefined
    | { landscape: boolean; portrait: boolean };

export const useIsMobile = (): isMobileType => {
    const [width, height] = useWindowSize();

    const isMobile = useMemo(() => {
        return (
            window.matchMedia(device.mobileLandscape).matches ||
            window.matchMedia(device.mobilePortrait).matches
        );
    }, [width, height]);

    const landscape = useMemo(() => {
        return isLandscape();
    }, [width, height]);

    const portrait = useMemo(() => {
        return isPortrait();
    }, [width, height]);

    return isMobile
        ? {
              landscape,
              portrait,
          }
        : undefined;
};

export const AspectRatioComponent = styled.div<{
    isMobile: isMobileType;
    backgroundImage?: string;
}>`
    position: relative;
    box-sizing: border-box;
    width: ${({ isMobile }) => (isMobile ? '100vw' : '192rem')};
    height: ${({ isMobile }) => (isMobile ? '100dvh' : '108rem')};

    max-height: 100%;

    min-width: 320px;

    aspect-ratio: 16 / 9;

    overflow: hidden;

    display: flex;
    flex-direction: column;

    background-image: url(${(props) => props.backgroundImage});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;

    transition: background-image 500ms ease-in-out;


    z-index: 0;
`;

const Wrapper = styled.div`
    position: relative;

    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: black;

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
    const isMobile = useIsMobile();

    return (
        <Wrapper>
            <AspectRatioComponent
                isMobile={isMobile}
                backgroundImage={props.backgroundImage}
            >
                {props.children}
            </AspectRatioComponent>
        </Wrapper>
    );
};

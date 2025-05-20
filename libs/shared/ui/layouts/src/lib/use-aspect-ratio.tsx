import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useWindowSize } from './use-window-size';

// document.documentElement refers to the root element of the HTML document, which is typically the <html> element.
// In the context of a web page, it represents the highest level in the DOM hierarchy
// We want update font size which in-turn effects the scaling of all other rem units in our app
// We use "isVertical" as a js variable instead of using a hardcoded media query width

export const useAspectRatio = () => {
  const [width, height] = useWindowSize();
  const isVertical = width < height;

  useEffect(() => {
    const fontSize = isVertical
      ? 'calc((min(100vh, 932px) / 932) * 10)'
      : `calc((min(100vw, ${(1920 / 1080) * 100}vh) / 1920) * 10)`;

    document.documentElement.style.fontSize = fontSize;

    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [isVertical]);

  return { isVertical };
};

export const AspectRatioWrapper = styled.div<{
  isVertical: boolean;
  backgroundImage?: string;
}>`
  position: relative;
  box-sizing: border-box;
  width: ${({ isVertical }) => (isVertical ? '100vw' : '192rem')};
  height: ${({ isVertical }) => (isVertical ? '100vh' : '108rem')};

  overflow: hidden;

  min-width: 320px;

  background-image: url(${(props) => props.backgroundImage});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;

  border: red 1px solid;

  display: flex;
  flex-direction: column;
  flex-grow: 1;

  transition: background-image 500ms ease-in-out;
`;

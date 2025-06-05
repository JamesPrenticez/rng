import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export const MockIframe = ({ children }: { children: React.ReactNode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);
  const [emotionRoot, setEmotionRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (doc?.body && doc?.head) {

        // Inject CSS variables into mock iframes html
        // TODO find a way to do this with css files ?raw
        const styleTag = doc.createElement('style');
        styleTag.textContent = `
          :root {
            --color-primary: #A74FF9;
            --color-light-black: #111;
            --color-white-100: #fff;
            --color-text: #fff;
            --color-background: #111;
            --color-border: #A74FF9;
            font-size: 10px;
          }

          body {
            background: #2c2c2c;
          }

        `;
        doc.head.appendChild(styleTag);

        setIframeBody(doc.body);
        setEmotionRoot(doc.head);
      }
    };

    iframe.addEventListener('load', handleLoad);

    if (iframe.contentDocument?.readyState === 'complete') {
      handleLoad();
    }

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  const cache = emotionRoot
    ? createCache({ key: 'iframe', container: emotionRoot })
    : null;

  return (
    <iframe
      ref={iframeRef}
      title="Mock Iframe"
      style={{ width: '800px', height: '500px', border: '1px solid lime'}}
      srcDoc={`<!DOCTYPE html><html><head></head><body></body></html>`}
    >
      {/* Portal target is dynamically inserted below */}
      {iframeBody && cache &&
        ReactDOM.createPortal(
          <CacheProvider value={cache}>
            {children}
          </CacheProvider>,
          iframeBody
        )}
    </iframe>
  );
};

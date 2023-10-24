import React, { useEffect } from 'react';

interface IframeProps {
  src: string;
  headers?: Record<string, string>;
}

const Iframe: React.FC<IframeProps> = (props) => {
  const { src } = props;

  const iframe = React.createRef<HTMLIFrameElement>();

  const method = 'GET';
  const headers = new Headers({ ...props.headers });
  const options = { method, headers };

  const get = React.useRef(() => {});

  get.current = async () => {
    try {
      const response = await fetch(src, options);
      if (!response.ok) {
        return;
      }

      const responseText = await response.text();

      const frame = iframe.current?.contentWindow;

      if (!frame || !frame.document) {
        return;
      }

      frame.document.open();
      frame.document.write(responseText);
      frame.document.close();
    } catch (e) {
      console.error(`Error: ${e}`);
      return;
    }
  };

  useEffect(() => {
    get.current();
  }, []);

  return (
    <iframe style={{ maxHeight: '80vh' }} ref={iframe} title="react-iframe" />
  );
};

export default Iframe;

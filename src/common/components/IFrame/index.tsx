import { AspectRatio, Box, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';

interface IframeProps {
  src: string;
  headers?: Record<string, string>;
}

const Iframe: React.FC<IframeProps> = (props) => {
  const { src } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const get = useRef<() => Promise<void>>(async () => {});

  get.current = async () => {
    const method = 'GET';
    const headers = new Headers({ ...props.headers });
    const options = { method, headers };

    try {
      const response = await fetch(src, options);
      if (!response.ok) {
        return;
      }

      const responseText = await response.text();
      const frame = iframeRef.current?.contentWindow;

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

  useEffect(() => {
    const iframe = iframeRef.current?.contentDocument?.getElementById(
      'workflowInstanceViewer'
    );
    if (iframe) {
      setLoading(false);
    }
  }, [iframeRef.current?.contentDocument]);

  return (
    <Box style={{ width: '100%', height: '100%' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Spinner color="red.500" size="xl" />
        </div>
      )}
      <AspectRatio maxW="100%" style={{ position: 'relative' }} ratio={1}>
        <iframe
          style={{ maxHeight: '75vh' }}
          ref={iframeRef}
          title="react-iframe"
        />
      </AspectRatio>
    </Box>
  );
};

export default Iframe;

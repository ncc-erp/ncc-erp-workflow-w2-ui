import { ChevronUpIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
const SCROLL_THRESHOLD = 200;
const ScrollTopButton = () => {
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    showScroll && (
      <Button
        onClick={scrollToTop}
        position="fixed"
        bottom="32px"
        right="32px"
        zIndex={1000}
        colorScheme="red"
        borderRadius="full"
        boxShadow="lg"
        w="50px"
        h="50px"
        aria-label="Scroll to top"
        p="0"
      >
        <ChevronUpIcon boxSize={6} />
      </Button>
    )
  );
};

export default ScrollTopButton;

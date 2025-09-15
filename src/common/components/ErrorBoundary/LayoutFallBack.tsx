import { Box, VStack, Text, Button } from '@chakra-ui/react';
interface ErrorFallbackProps {
  onRetry?: () => void;
}
function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };
  return (
    <div style={{ marginTop: '330px' }}>
      <Box p={6} textAlign="center">
        <VStack spacing={4} maxW="md" mx="auto">
          <Text fontSize="3xl">⚠️</Text>
          <Text fontSize="lg" fontWeight="bold">
            Something went wrong
          </Text>

          <Button colorScheme="blue" onClick={handleRetry}>
            Try Again
          </Button>
        </VStack>
      </Box>
    </div>
  );
}

export default ErrorFallback;

import { Center, VStack, Heading, Text, Icon, Box } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
const NotFound = () => {

  return (
    <Center height="100vh" bg="gray.100" color="gray.800" textAlign="center">
      <VStack spacing={5}>
        <Box fontSize="60px" color="red.500">
          <Icon as={FaExclamationTriangle} />
        </Box>
        <Heading as="h1" size="2xl">
          404
        </Heading>
        <Text fontSize="lg">
          Oops! The page you’re looking for doesn’t exist.
        </Text>
      </VStack>
    </Center>
  );
};

export default NotFound;

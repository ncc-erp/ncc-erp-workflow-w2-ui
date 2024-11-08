import { Box, Heading, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f0f4f8;
  color: #333;
`;

const IconWrapper = styled(Box)`
  font-size: 60px;
  color: #e53e3e;
  margin-bottom: 20px;
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <IconWrapper>
        <FaExclamationTriangle />
      </IconWrapper>
      <Heading as="h1" size="2xl" mb={4}>
        404
      </Heading>
      <Text fontSize="lg" mb={6}>
        Oops! The page you’re looking for doesn’t exist.
      </Text>
    </NotFoundContainer>
  );
};

export default NotFound;

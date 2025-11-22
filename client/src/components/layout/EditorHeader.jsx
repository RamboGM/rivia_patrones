import { Box, Flex, HStack, Text, Link as ChakraLink, Badge, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/useUserStore.js';

function EditorHeader() {
  const { user, plan } = useUserStore();

  return (
    <Box bg="white" borderBottom="1px solid #eee" px={6} py={3}>
      <Flex align="center" justify="space-between">
        <HStack spacing={4}>
          <ChakraLink as={Link} to="/" fontWeight="bold" color="pink.500">
            Rivia
          </ChakraLink>
          <ChakraLink as={Link} to="/editor/tapestry" color="gray.700">
            Editor Tapestry
          </ChakraLink>
          <ChakraLink as={Link} to="/editor/crochet" color="gray.700">
            Editor Crochet
          </ChakraLink>
          <ChakraLink as={Link} to="/cuenta" color="gray.700">
            Mi Cuenta
          </ChakraLink>
        </HStack>
        <HStack spacing={3}>
          {user && (
            <>
              <Text fontWeight="semibold">{user.displayName || user.email}</Text>
              <Badge colorScheme={plan === 'premium' ? 'green' : 'pink'}>{plan}</Badge>
            </>
          )}
          {!user && (
            <Button as={Link} to="/" size="sm" colorScheme="pink" variant="outline">
              Iniciar sesión
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

export default EditorHeader;

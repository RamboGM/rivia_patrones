import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Stack,
  Divider,
  Button,
  useToast,
} from '@chakra-ui/react';
import EditorHeader from '../components/layout/EditorHeader.jsx';
import useUserStore from '../store/useUserStore.js';
import { getPatrones } from '../api/patrones.js';

function MyAccount() {
  const { user, plan } = useUserStore();
  const toast = useToast();
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getPatrones();
        setPatterns(list);
      } catch (err) {
        toast({
          title: 'No se pudieron cargar tus patrones',
          description: err.message,
          status: 'error',
        });
      }
    };
    if (user) load();
  }, [user, toast]);

  if (!user) {
    return (
      <Box minH="100vh" p={8} bg="#faf9fb">
        <EditorHeader />
        <Box mt={6} p={6} bg="white" borderRadius="md" border="1px solid #eee">
          <Text>Inicia sesión para ver tu cuenta.</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="#faf9fb">
      <EditorHeader />
      <Box p={8}>
        <Heading size="lg" mb={4}>
          Mi Cuenta
        </Heading>
        <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
          <Box flex="1" p={5} bg="white" borderRadius="md" border="1px solid #eee">
            <Heading size="md" mb={3}>
              Datos del usuario
            </Heading>
            <VStack align="start" spacing={2}>
              <HStack>
                <Text fontWeight="semibold">Nombre:</Text>
                <Text>{user.displayName || '-'}</Text>
                <Badge colorScheme={plan === 'premium' ? 'green' : 'pink'}>{plan}</Badge>
              </HStack>
              <HStack>
                <Text fontWeight="semibold">Email:</Text>
                <Text>{user.email}</Text>
              </HStack>
            </VStack>
          </Box>

          <Box flex="1" p={5} bg="white" borderRadius="md" border="1px solid #eee">
            <Heading size="md" mb={3}>
              Suscripción
            </Heading>
            <Text>
              Plan actual: <Badge colorScheme={plan === 'premium' ? 'green' : 'pink'}>{plan}</Badge>
            </Text>
            <Text color="gray.600" mt={2} fontSize="sm">
              Cambia de plan cuando quieras. Premium incluye 30 días de prueba gratuita.
            </Text>
            <HStack mt={3}>
              <Button size="sm" colorScheme="pink" variant="outline">
                Gestionar plan
              </Button>
            </HStack>
          </Box>
        </Flex>

        <Box mt={6} p={5} bg="white" borderRadius="md" border="1px solid #eee">
          <HStack justify="space-between" mb={3}>
            <Heading size="md">Mis patrones</Heading>
            <Badge colorScheme="pink">{patterns.length}</Badge>
          </HStack>
          <Divider mb={3} />
          <Stack spacing={3}>
            {patterns.map((p) => (
              <HStack key={p._id} p={3} border="1px solid #eee" borderRadius="md" justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="semibold">{p.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {p.craftType} · {p.grid?.width} x {p.grid?.height}
                  </Text>
                </VStack>
                <Badge>{p.craftType}</Badge>
              </HStack>
            ))}
            {!patterns.length && <Text color="gray.500">Aún no tienes patrones guardados.</Text>}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default MyAccount;

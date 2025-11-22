import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  SimpleGrid,
  Divider,
  Badge,
  Stack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { getPatrones, getPatron } from '../api/patrones.js';
import useUserStore from '../store/useUserStore.js';
import usePatternStore from '../store/usePatternStore.js';
import useUiStore from '../store/useUiStore.js';
import PatternTopBar from '../components/editor/PatternTopBar.jsx';
import Toolbar from '../components/editor/Toolbar.jsx';
import PalettePanel from '../components/editor/PalettePanel.jsx';
import PatternCanvasCrochet from '../components/editor/PatternCanvasCrochet.jsx';
import EditorHeader from '../components/layout/EditorHeader.jsx';

function EditorCrochet() {
  const { user } = useUserStore();
  const { pattern, startNewPattern, setPattern } = usePatternStore();
  const { setActiveColorId } = useUiStore();
  const [patterns, setPatterns] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 20, height: 20 });

  const loadPatterns = async () => {
    try {
      const list = await getPatrones();
      setPatterns(list.filter((p) => p.craftType === 'crochet'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) loadPatterns();
  }, [user]);

  const createCrochetPattern = () => {
    startNewPattern({
      craftType: 'crochet',
      technique: 'rows',
      grid: { width: Number(dimensions.width) || 20, height: Number(dimensions.height) || 20 },
      stitches: [],
      palette: [
        { id: 'symbol', name: 'Símbolos', code: 'SYMB', hex: '#000000' },
      ],
    });
    setActiveColorId(null);
  };

  const handleLoadPattern = async (id) => {
    try {
      const found = await getPatron(id);
      if (found) {
        setPattern(found, { pushHistory: false });
        setActiveColorId(found.palette?.[0]?.id || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <Alert status="info">
        <AlertIcon />
        Inicia sesión con Google desde la landing para usar el editor de crochet.
      </Alert>
    );
  }

  return (
    <Flex direction="column" minH="100vh" gap={0}>
      <EditorHeader />
      <PatternTopBar />
      <Flex flex="1" gap={0}>
        <Toolbar />
        <Box flex="1" p={4} bg="#faf9fb">
          {!pattern && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <VStack spacing={3} align="stretch" bg="white" p={5} borderRadius="md" border="1px solid #eee">
                <Text fontSize="xl" fontWeight="bold">
                  Nuevo patrón de crochet (símbolos)
                </Text>
                <HStack>
                  <Input
                    type="number"
                    min={1}
                    max={300}
                    value={dimensions.width}
                    onChange={(e) => setDimensions((d) => ({ ...d, width: e.target.value }))}
                    placeholder="Columnas"
                  />
                  <Input
                    type="number"
                    min={1}
                    max={300}
                    value={dimensions.height}
                    onChange={(e) => setDimensions((d) => ({ ...d, height: e.target.value }))}
                    placeholder="Filas"
                  />
                </HStack>
                <Button colorScheme="pink" onClick={createCrochetPattern}>
                  Crear grilla de símbolos
                </Button>
              </VStack>

              <VStack spacing={3} align="stretch" bg="white" p={5} borderRadius="md" border="1px solid #eee">
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    Tus patrones
                  </Text>
                  <Badge colorScheme="pink">{patterns.length}</Badge>
                </HStack>
                <Divider />
                <Stack spacing={3}>
                  {patterns.map((p) => (
                    <HStack key={p._id} p={3} border="1px solid #eee" borderRadius="md" justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{p.name}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {p.grid?.width} x {p.grid?.height}
                        </Text>
                      </VStack>
                      <Button size="sm" onClick={() => handleLoadPattern(p._id)}>
                        Abrir
                      </Button>
                    </HStack>
                  ))}
                  {!patterns.length && <Text color="gray.500">Aún no tienes patrones guardados.</Text>}
                </Stack>
              </VStack>
            </SimpleGrid>
          )}

          {pattern && (
            <Flex gap={4} align="stretch">
              <PatternCanvasCrochet />
              <PalettePanel />
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}

export default EditorCrochet;

import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  useToast,
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
import PatternCanvasTapestry from '../components/editor/PatternCanvasTapestry.jsx';
import EditorHeader from '../components/layout/EditorHeader.jsx';

function EditorTapestry() {
  const toast = useToast();
  const { user } = useUserStore();
  const { pattern, startNewPattern, setPattern } = usePatternStore();
  const { setActiveColorId } = useUiStore();
  const [wizardStep, setWizardStep] = useState(1);
  const [patterns, setPatterns] = useState([]);
  const [wizardData, setWizardData] = useState({
    stitchType: 'puntoBajo',
    orientation: 'left-to-right',
    handedness: 'right',
    width: 20,
    height: 20,
  });

  const loadPatterns = async () => {
    try {
      const list = await getPatrones();
      setPatterns(list.filter((p) => p.craftType === 'tapestry'));
    } catch (err) {
      toast({
        title: 'No se pudieron cargar los patrones',
        description: err.message,
        status: 'error',
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadPatterns();
    }
  }, [user]);

  const startFromWizard = () => {
    const draft = {
      craftType: 'tapestry',
      technique: wizardData.stitchType === 'puntoBajo' ? 'tapestry_flat' : 'tapestry_round',
      handedness: wizardData.handedness === 'left' ? 'left' : 'right',
      orientation: wizardData.orientation,
      grid: {
        width: Number(wizardData.width) || 10,
        height: Number(wizardData.height) || 10,
      },
    };
    startNewPattern(draft);
    setActiveColorId(null);
    toast({
      title: 'Grilla lista',
      description: 'Ya puedes empezar a pintar el patrón.',
      status: 'success',
    });
  };

  const handleLoadPattern = async (id) => {
    try {
      const found = await getPatron(id);
      if (found) {
        setPattern(found, { pushHistory: false });
        setActiveColorId(found.palette?.[0]?.id || null);
      }
    } catch (err) {
      toast({
        title: 'No se pudo cargar',
        description: err.message,
        status: 'error',
      });
    }
  };

  const wizardContent = (
    <VStack spacing={5} align="stretch" bg="white" p={5} borderRadius="md" border="1px solid #eee">
      <Text fontSize="xl" fontWeight="bold">
        Configura tu grilla de tapestry
      </Text>
      {wizardStep === 1 && (
        <VStack align="stretch" spacing={3}>
          <Text>Tipo de punto</Text>
          <HStack>
            <Button
              colorScheme={wizardData.stitchType === 'puntoBajo' ? 'pink' : 'gray'}
              onClick={() => setWizardData((d) => ({ ...d, stitchType: 'puntoBajo' }))}
            >
              Punto bajo
            </Button>
            <Button
              colorScheme={wizardData.stitchType === 'puntoAlto' ? 'pink' : 'gray'}
              onClick={() => setWizardData((d) => ({ ...d, stitchType: 'puntoAlto' }))}
            >
              Punto alto
            </Button>
          </HStack>
        </VStack>
      )}
      {wizardStep === 2 && (
        <VStack align="stretch" spacing={3}>
          <Text>Orientación</Text>
          <HStack>
            <Button
              colorScheme={wizardData.orientation === 'left-to-right' ? 'pink' : 'gray'}
              onClick={() => setWizardData((d) => ({ ...d, orientation: 'left-to-right' }))}
            >
              Izquierda a derecha
            </Button>
            <Button
              colorScheme={wizardData.orientation === 'right-to-left' ? 'pink' : 'gray'}
              onClick={() => setWizardData((d) => ({ ...d, orientation: 'right-to-left' }))}
            >
              Derecha a izquierda
            </Button>
          </HStack>
        </VStack>
      )}
      {wizardStep === 3 && (
        <VStack align="stretch" spacing={3}>
          <Text>¿Diestro o zurdo?</Text>
          <HStack>
            <Button
              colorScheme={wizardData.handedness === 'right' ? 'pink' : 'gray'}
              onClick={() => setWizardData((d) => ({ ...d, handedness: 'right' }))}
            >
              Diestro
            </Button>
            <Button
              colorScheme={wizardData.handedness === 'left' ? 'pink' : 'gray'}
              onClick={() => setWizardData((d) => ({ ...d, handedness: 'left' }))}
            >
              Zurdo
            </Button>
          </HStack>
        </VStack>
      )}
      {wizardStep === 4 && (
        <VStack align="stretch" spacing={3}>
          <Text>Dimensiones de la grilla</Text>
          <HStack>
            <Input
              type="number"
              min={1}
              max={300}
              value={wizardData.width}
              onChange={(e) => setWizardData((d) => ({ ...d, width: e.target.value }))}
              placeholder="Columnas"
            />
            <Input
              type="number"
              min={1}
              max={300}
              value={wizardData.height}
              onChange={(e) => setWizardData((d) => ({ ...d, height: e.target.value }))}
              placeholder="Filas"
            />
          </HStack>
        </VStack>
      )}
      <HStack justify="space-between">
        <Button onClick={() => setWizardStep((s) => Math.max(1, s - 1))} isDisabled={wizardStep === 1}>
          Anterior
        </Button>
        <Button colorScheme="pink" onClick={() => (wizardStep < 4 ? setWizardStep((s) => s + 1) : startFromWizard())}>
          {wizardStep < 4 ? 'Siguiente' : 'Crear grilla'}
        </Button>
      </HStack>
    </VStack>
  );

  if (!user) {
    return (
      <Alert status="info">
        <AlertIcon />
        Inicia sesión con Google desde la landing para usar el editor.
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
              {wizardContent}
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
                    <HStack
                      key={p._id}
                      p={3}
                      border="1px solid #eee"
                      borderRadius="md"
                      justify="space-between"
                    >
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
              <PatternCanvasTapestry />
              <PalettePanel />
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}

export default EditorTapestry;

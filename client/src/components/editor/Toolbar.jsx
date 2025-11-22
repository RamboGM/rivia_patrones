import { VStack, Button, Text, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { FaPaintBrush, FaEraser, FaFill, FaMousePointer, FaUndo, FaRedo, FaMinus, FaPlus } from 'react-icons/fa';
import useUiStore from '../../store/useUiStore.js';
import usePatternStore from '../../store/usePatternStore.js';

const tools = [
  { id: 'brush', label: 'Pincel', icon: FaPaintBrush },
  { id: 'eraser', label: 'Borrar', icon: FaEraser },
  { id: 'fill', label: 'Relleno', icon: FaFill },
  { id: 'select', label: 'Seleccionar', icon: FaMousePointer },
];

function Toolbar() {
  const { tool, setTool, zoom, setZoom } = useUiStore();
  const { undo, redo } = usePatternStore();

  return (
    <VStack spacing={3} align="stretch" p={3} bg="white" borderRight="1px solid #eee" minW="160px">
      <Text fontWeight="bold">Herramientas</Text>
      {tools.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          leftIcon={<Icon />}
          variant={tool === id ? 'solid' : 'outline'}
          colorScheme="pink"
          onClick={() => setTool(id)}
          justifyContent="flex-start"
          size="sm"
        >
          {label}
        </Button>
      ))}

      <Text fontWeight="bold" pt={1}>
        Historial
      </Text>
      <HStack>
        <Button size="sm" onClick={undo} variant="outline" leftIcon={<FaUndo />}>
          Undo
        </Button>
        <Button size="sm" onClick={redo} variant="outline" leftIcon={<FaRedo />}>
          Redo
        </Button>
      </HStack>

      <Text fontWeight="bold" pt={1}>
        Zoom
      </Text>
      <HStack>
        <IconButton
          aria-label="Zoom out"
          icon={<FaMinus />}
          size="sm"
          onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}
        />
        <Text>{Math.round(zoom * 100)}%</Text>
        <IconButton
          aria-label="Zoom in"
          icon={<FaPlus />}
          size="sm"
          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
        />
      </HStack>
    </VStack>
  );
}

export default Toolbar;

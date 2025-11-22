import { useState } from 'react';
import { VStack, HStack, Text, Button, Input, Box, SimpleGrid } from '@chakra-ui/react';
import usePatternStore from '../../store/usePatternStore.js';
import useUiStore from '../../store/useUiStore.js';
import { nanoid } from '../../utils/id.js';

function PalettePanel() {
  const { pattern, updatePalette } = usePatternStore();
  const { activeColorId, setActiveColorId } = useUiStore();
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#ff46a4');

  if (!pattern) return null;

  const handleAddColor = () => {
    const palette = [
      ...pattern.palette,
      {
        id: nanoid(),
        name: newColorName || `Color ${pattern.palette.length + 1}`,
        code: `C${pattern.palette.length + 1}`,
        hex: newColorHex,
      },
    ];
    updatePalette(palette);
    setNewColorName('');
  };

  const handleSelect = (id) => setActiveColorId(id);

  const handleDelete = (id) => {
    const palette = pattern.palette.filter((p) => p.id !== id);
    updatePalette(palette);
    if (activeColorId === id) {
      setActiveColorId(palette[0]?.id || null);
    }
  };

  return (
    <VStack align="stretch" spacing={4} p={3} bg="white" borderLeft="1px solid #eee" w={{ base: '100%', md: '280px' }}>
      <Text fontWeight="bold">Paleta</Text>
      <SimpleGrid columns={{ base: 2, md: 1 }} spacing={2}>
        {pattern.palette.map((item) => (
          <HStack
            key={item.id}
            p={2}
            border="1px solid #eee"
            borderRadius="md"
            justify="space-between"
            bg={activeColorId === item.id ? 'pink.50' : 'white'}
          >
            <HStack spacing={3} cursor="pointer" onClick={() => handleSelect(item.id)}>
              <Box boxSize="24px" borderRadius="md" bg={item.hex} border="1px solid #ddd" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="semibold">
                  {item.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {item.code}
                </Text>
              </VStack>
            </HStack>
            <Button size="xs" variant="ghost" colorScheme="red" onClick={() => handleDelete(item.id)}>
              x
            </Button>
          </HStack>
        ))}
      </SimpleGrid>

      <VStack spacing={2} align="stretch">
        <Text fontWeight="semibold">Añadir color</Text>
        <Input placeholder="Nombre" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} />
        <Input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} />
        <Button colorScheme="pink" onClick={handleAddColor}>
          Agregar
        </Button>
      </VStack>
    </VStack>
  );
}

export default PalettePanel;

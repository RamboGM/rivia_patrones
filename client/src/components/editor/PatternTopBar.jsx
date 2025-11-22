import { HStack, Button, Input, Badge, useToast, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import usePatternStore from '../../store/usePatternStore.js';
import useUserStore from '../../store/useUserStore.js';
import { createPatron, updatePatron, exportPdf } from '../../api/patrones.js';
import useUiStore from '../../store/useUiStore.js';

function PatternTopBar() {
  const toast = useToast();
  const { pattern, setPattern } = usePatternStore();
  const { plan } = useUserStore();
  const { stageRef } = useUiStore();

  if (!pattern) return null;

  const handleSave = async (options = { clone: false }) => {
    try {
      const payload = { ...pattern };
      if (options.clone) {
        delete payload._id;
        payload.name = `${payload.name} (copia)`;
      }
      const saved = payload._id
        ? await updatePatron(payload._id, payload)
        : await createPatron(payload);
      setPattern(saved, { pushHistory: false });
      toast({
        title: 'Patrón guardado',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'No se pudo guardar',
        description: err.message,
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleExport = async () => {
    if (!pattern?._id) {
      toast({
        title: 'Debes guardar antes de exportar',
        status: 'warning',
      });
      return;
    }
    try {
      await exportPdf(pattern._id);
      toast({
        title: 'Exportando PDF',
        status: 'info',
      });
    } catch (err) {
      toast({
        title: 'No se pudo exportar',
        description: err.message,
        status: 'error',
      });
    }
  };

  const downloadPng = (pixelRatio = 1) => {
    if (!stageRef) {
      toast({
        title: 'Canvas no disponible',
        description: 'No pudimos localizar el lienzo para exportar.',
        status: 'error',
      });
      return;
    }
    const dataUrl = stageRef.toDataURL({ pixelRatio });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${pattern.name || 'patron'}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <HStack spacing={3} align="center" justify="space-between" w="full" bg="white" p={3} borderBottom="1px solid #eee">
      <HStack spacing={3} flex="1">
        <Input
          value={pattern.name || ''}
          onChange={(e) => setPattern({ ...pattern, name: e.target.value }, { pushHistory: false })}
          maxW="320px"
          placeholder="Nombre del patrón"
        />
        <Badge colorScheme={plan === 'premium' ? 'green' : 'pink'}>{plan}</Badge>
      </HStack>

      <HStack spacing={2}>
        <Button colorScheme="pink" onClick={() => handleSave()}>
          Guardar
        </Button>
        {plan === 'premium' ? (
          <Menu>
            <MenuButton as={Button} variant="outline">
              Descargar
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => downloadPng(2)}>PNG (alta)</MenuItem>
              <MenuItem onClick={handleExport}>PDF (alta, colores)</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button variant="outline" onClick={() => downloadPng(1)}>
            Descargar PNG
          </Button>
        )}
      </HStack>
    </HStack>
  );
}

export default PatternTopBar;

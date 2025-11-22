import React, { useRef, useState, useEffect } from 'react';
import { Box, Select, HStack, Text } from '@chakra-ui/react';
import { Stage, Layer, Rect, Text as KonvaText } from 'react-konva';
import usePatternStore from '../../store/usePatternStore.js';
import useUiStore from '../../store/useUiStore.js';

const CELL_SIZE = 32;

function PatternCanvasCrochet() {
  const stageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [symbol, setSymbol] = useState('sc');
  const { pattern, updateStitch } = usePatternStore();
  const { tool, zoom, setStageRef } = useUiStore();

  useEffect(() => {
    if (stageRef.current) setStageRef(stageRef.current);
  }, [setStageRef]);

  if (!pattern) return null;

  const getSymbolAt = (row, col) => pattern.stitches.find((s) => s.row === row && s.col === col);

  const paintStitch = (row, col) => {
    if (row < 0 || col < 0 || row >= pattern.grid.height || col >= pattern.grid.width) return;
    if (tool === 'eraser') {
      updateStitch(row, col, null);
      return;
    }
    if (tool === 'brush') {
      updateStitch(row, col, { symbol });
    }
  };

  const handlePointer = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    const scale = stage.scaleX() || 1;
    const x = pointerPosition.x / scale;
    const y = pointerPosition.y / scale;
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    paintStitch(row, col);
  };

  const width = pattern.grid.width * CELL_SIZE;
  const height = pattern.grid.height * CELL_SIZE;

  return (
    <Box flex="1" overflow="auto" bg="gray.50" border="1px solid #eee" borderRadius="md">
      <HStack px={3} py={2} bg="white" borderBottom="1px solid #eee" align="center">
        <Text fontWeight="bold" fontSize="sm">
          Símbolo activo
        </Text>
        <Select size="sm" value={symbol} onChange={(e) => setSymbol(e.target.value)} maxW="150px">
          <option value="sc">sc (punto bajo)</option>
          <option value="dc">dc (punto alto)</option>
          <option value="ch">ch (cadeneta)</option>
          <option value="sl">sl st (punto deslizado)</option>
        </Select>
      </HStack>

      <Stage
        ref={stageRef}
        width={width * zoom}
        height={height * zoom}
        scaleX={zoom}
        scaleY={zoom}
        draggable={tool === 'select'}
        onMouseDown={() => {
          setIsDrawing(true);
          handlePointer();
        }}
        onMouseMove={() => {
          if (!isDrawing) return;
          handlePointer();
        }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      >
        <Layer>
          {[...Array(pattern.grid.height)].map((_, row) =>
            [...Array(pattern.grid.width)].map((_, col) => {
              const stitch = getSymbolAt(row, col);
              return (
                <React.Fragment key={`${row}-${col}`}>
                  <Rect
                    x={col * CELL_SIZE}
                    y={row * CELL_SIZE}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill="#fff"
                    stroke="#e2e8f0"
                    strokeWidth={1}
                    onMouseDown={handlePointer}
                    onMouseMove={() => isDrawing && handlePointer()}
                  />
                  {stitch && (
                    <KonvaText
                      text={stitch.symbol}
                      x={col * CELL_SIZE + 8}
                      y={row * CELL_SIZE + 8}
                      fontSize={14}
                      fill="#1a202c"
                    />
                  )}
                </React.Fragment>
              );
            }),
          )}
        </Layer>
      </Stage>
    </Box>
  );
}

export default PatternCanvasCrochet;

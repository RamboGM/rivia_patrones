import { useRef, useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Stage, Layer, Rect, Group, Line } from 'react-konva';
import usePatternStore from '../../store/usePatternStore.js';
import useUiStore from '../../store/useUiStore.js';

const CELL_SIZE = 24;

function PatternCanvasTapestry() {
  const stageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { pattern, updateCell, setPattern } = usePatternStore();
  const { tool, activeColorId, zoom, setStageRef } = useUiStore();

  useEffect(() => {
    if (stageRef.current) setStageRef(stageRef.current);
  }, [setStageRef]);

  if (!pattern) return null;

  const getColor = (row, col) => {
    const cell = pattern.cells.find((c) => c.row === row && c.col === col);
    if (!cell) return '#ffffff';
    return pattern.palette.find((p) => p.id === cell.colorId)?.hex || '#ffffff';
  };

  const paintCell = (row, col) => {
    if (row < 0 || col < 0 || row >= pattern.grid.height || col >= pattern.grid.width) return;
    if (tool === 'eraser') {
      updateCell(row, col, null);
      return;
    }
    if ((tool === 'brush' || tool === 'fill') && pattern.palette?.length) {
      const colorId = activeColorId || pattern.palette[0]?.id;
      if (tool === 'fill') {
        const fillCells = [];
        for (let r = 0; r < pattern.grid.height; r += 1) {
          for (let c = 0; c < pattern.grid.width; c += 1) {
            fillCells.push({ row: r, col: c, colorId });
          }
        }
        setPattern({ ...pattern, cells: fillCells }, { pushHistory: true });
      } else {
        updateCell(row, col, colorId);
      }
    }
  };

  const handlePointer = (e) => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    const scale = stage.scaleX() || 1;
    const x = pointerPosition.x / scale;
    const y = pointerPosition.y / scale;
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    paintCell(row, col);
  };

  const width = pattern.grid.width * CELL_SIZE;
  const height = pattern.grid.height * CELL_SIZE;

  return (
    <Box flex="1" overflow="auto" bg="gray.50" border="1px solid #eee" borderRadius="md">
      <Stage
        ref={stageRef}
        width={width * zoom}
        height={height * zoom}
        scaleX={zoom}
        scaleY={zoom}
        draggable={tool === 'select'}
        onMouseDown={(e) => {
          setIsDrawing(true);
          handlePointer(e);
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
            [...Array(pattern.grid.width)].map((_, col) => (
              <Rect
                key={`${row}-${col}`}
                x={col * CELL_SIZE}
                y={row * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={getColor(row, col)}
                stroke="#e2e8f0"
                strokeWidth={1}
                onMouseDown={handlePointer}
                onMouseMove={() => isDrawing && handlePointer()}
              />
            )),
          )}
          <Group>
            <Line
              points={[0, 0, width, 0, width, height, 0, height, 0, 0]}
              stroke="#1a202c"
              strokeWidth={1}
              closed
            />
          </Group>
        </Layer>
      </Stage>
    </Box>
  );
}

export default PatternCanvasTapestry;

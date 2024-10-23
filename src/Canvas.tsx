import React, { useRef, useState, useEffect } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import styled from 'styled-components';
import { CanvasItem, CanvasItemProps } from './CanvasItem'; // Corrected import
import { useCombinedRefs } from './useCombinedRefs';

const GRID_SIZE = 50; // Set grid size to match item size

const CanvasContainer = styled.div`
  position: relative;
  background-color: #f0f0f0;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const CanvasArea = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-image: 
    linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: ${GRID_SIZE}px ${GRID_SIZE}px;
`;

interface DraggedItem extends CanvasItemProps {
  index?: number; // Index is present when moving an existing item
}

interface OccupiedCell {
  x: number;
  y: number;
}

const Canvas: React.FC = () => {
  const [items, setItems] = useState<CanvasItemProps[]>([]);
  const [occupiedCells, setOccupiedCells] = useState<OccupiedCell[]>([]);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize((prevSize) => ({
        width: Math.max(prevSize.width, window.innerWidth),
        height: Math.max(prevSize.height, window.innerHeight),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [, drop] = useDrop(() => ({
    accept: ['Box', 'Circle'],
    drop: (item: DraggedItem, monitor: DropTargetMonitor) => {
      const delta = monitor.getSourceClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();

      if (!delta || !canvasRect) return;

      // Calculate position relative to the canvas
      const x = Math.floor((delta.x - canvasRect.left) / GRID_SIZE) * GRID_SIZE;
      const y = Math.floor((delta.y - canvasRect.top) / GRID_SIZE) * GRID_SIZE;

      if (item.index !== undefined) {
        moveItem(item.index, x, y);
      } else {
        addItem({ ...item, x, y });
      }
    },
  }));

  const combinedRef = useCombinedRefs<HTMLDivElement>(canvasRef, drop);

  // Add a new item if the cell is not occupied
  const addItem = (newItem: CanvasItemProps) => {
    if (isCellOccupied(newItem.x, newItem.y)) return; // Prevent adding to an occupied cell

    setItems((prevItems) => [...prevItems, newItem]);
    setOccupiedCells((prevCells) => [
      ...prevCells,
      { x: newItem.x, y: newItem.y },
    ]);
    updateCanvasSize(newItem.x, newItem.y);
  };

  // Move existing item if the target cell is not occupied
  const moveItem = (index: number, x: number, y: number) => {
    const oldItem = items[index];

    // Ensure oldItem exists before proceeding
    if (!oldItem) return;

    // Check if the new position is already occupied
    if (isCellOccupied(x, y, index)) return;

    // Remove old position from occupied cells
    setOccupiedCells((prevCells) =>
      prevCells.filter(
        (cell) => cell.x !== oldItem.x || cell.y !== oldItem.y
      )
    );

    // Update items and occupied cells
    const newItems = [...items];
    newItems[index] = { ...oldItem, x, y };
    setItems(newItems);
    setOccupiedCells((prevCells) => [
      ...prevCells,
      { x, y },
    ]);
    updateCanvasSize(x, y);
  };

  // Check if a cell is occupied (excluding a specific index)
  const isCellOccupied = (x: number, y: number, excludeIndex?: number): boolean => {
    return items.some((item, idx) => idx !== excludeIndex && item.x === x && item.y === y);
  };

  // Update canvas size dynamically based on the position of items
  const updateCanvasSize = (x: number, y: number) => {
    setCanvasSize((prevSize) => ({
      width: Math.max(prevSize.width, x + GRID_SIZE),
      height: Math.max(prevSize.height, y + GRID_SIZE),
    }));
  };

  return (
    <CanvasContainer ref={combinedRef}>
      <CanvasArea width={canvasSize.width} height={canvasSize.height}>
        {items.map((item, index) => (
          <CanvasItem
            key={index}
            index={index}
            type={item.type}
            x={item.x}
            y={item.y}
            width={GRID_SIZE}
            height={GRID_SIZE}
            onMove={moveItem}
          />
        ))}
      </CanvasArea>
    </CanvasContainer>
  );
};

export default Canvas;

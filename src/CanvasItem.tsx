import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

export interface CanvasItemProps {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  index?: number;
  onMove?: (index: number, x: number, y: number) => void;
}

const Item = styled.div<{ width: number; height: number }>`
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: #4caf50;
  border: 1px solid #333;
  box-sizing: border-box;
  cursor: move;
`;

export const CanvasItem: React.FC<CanvasItemProps> = ({ type, x, y, width, height, index, onMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getSourceClientOffset();
      if (delta && index !== undefined && onMove) {
        onMove(index, Math.round(delta.x), Math.round(delta.y));
      }
    },
  }));

  return (
    <Item
      ref={drag}
      width={width}
      height={height}
      style={{
        left: x,
        top: y,
        opacity: isDragging ? 0.5 : 1,
      }}
    />
  );
};

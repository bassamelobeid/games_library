import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

const ItemPreview = styled.div<{ type: string }>`
  width: 50px;
  height: 50px;
  background-color: #4caf50;
  border: 1px solid #333;
  box-sizing: border-box;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

interface DraggableComponentProps {
  type: string;
  label: string;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, label }) => {
  const [, drag] = useDrag(() => ({
    type,
    item: { type },
  }));

  return (
    <ItemPreview ref={drag} type={type}>
      {label}
    </ItemPreview>
  );
};

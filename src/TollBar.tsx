import React from 'react';
import styled from 'styled-components';
import { DraggableComponent } from './DraggableComponent';

const ToolBarContainer = styled.div`
  width: 200px;
  background-color: #f5f5f5;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToolBar: React.FC = () => {
  return (
    <ToolBarContainer>
      <DraggableComponent type="Box" label="Box" />
      <DraggableComponent type="Circle" label="Circle" />
    </ToolBarContainer>
  );
};

export default ToolBar;

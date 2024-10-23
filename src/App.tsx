import React from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ToolBar from './TollBar';
import Canvas from './Canvas';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <ToolBar />
        <Canvas />
      </AppContainer>
    </DndProvider>
  );
};

export default App;

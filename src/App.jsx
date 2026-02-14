import React from 'react';
import StepsList from './components/StepsList/StepsList';
import Scene3D from './components/Scene3D/Scene3D';
import StepForm from './components/StepForm/StepForm';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Kreator Dokumentacji 3D</h1>
        <p>Twórz instrukcje krok po kroku z wizualizacją 3D</p>
      </header>
      <div className="app-layout">
        <div className="left-panel">
          <StepsList />
        </div>
        <div className="middle-panel">
          <Scene3D />
        </div>
        <div className="right-panel">
          <StepForm />
        </div>
      </div>
    </div>
  );
}

export default App;

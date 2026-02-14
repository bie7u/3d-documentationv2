import StepList from './components/StepList';
import Scene3D from './components/Scene3D';
import StepEditor from './components/StepEditor';
import NavigationControls from './components/NavigationControls';
import './App.css';

/**
 * Main App component - 3D Documentation Creator
 * 
 * Layout:
 * - Left panel (250px): List of steps
 * - Center panel (flex): 3D scene with navigation controls
 * - Right panel (300px): Step editor
 */
function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>3D Documentation Creator</h1>
        <p>Create step-by-step 3D documentation with interactive models</p>
      </header>

      {/* Main content area with three panels */}
      <div className="app-content">
        {/* Left panel - Step list */}
        <div className="panel panel-left">
          <StepList />
        </div>

        {/* Center panel - 3D Scene */}
        <div className="panel panel-center">
          <Scene3D />
          <NavigationControls />
        </div>

        {/* Right panel - Step editor */}
        <div className="panel panel-right">
          <StepEditor />
        </div>
      </div>
    </div>
  );
}

export default App;

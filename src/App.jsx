import StepList from './components/StepList';
import Scene3D from './components/Scene3D';
import StepEditor from './components/StepEditor';
import NavigationControls from './components/NavigationControls';
import SaveLoadPanel from './components/SaveLoadPanel';
import useStore from './store/useStore';
import './App.css';

/**
 * Main App component - 3D Documentation Creator
 * 
 * Layout:
 * - Top panel: Save/Load controls and model settings
 * - Left panel (250px): List of steps
 * - Center panel (flex): 3D scene with navigation controls
 * - Right panel (300px): Step editor
 */
function App() {
  const viewerMode = useStore((state) => state.viewerMode);
  const modelTitle = useStore((state) => state.modelTitle);
  const modelDescription = useStore((state) => state.modelDescription);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>3D Documentation Creator</h1>
        <p>Create step-by-step 3D documentation with interactive models</p>
      </header>

      {/* Top panel - Save/Load controls (hidden in viewer mode) */}
      {!viewerMode && (
        <div className="panel panel-top">
          <SaveLoadPanel />
        </div>
      )}

      {/* Model info in viewer mode */}
      {viewerMode && (
        <div className="model-info-banner">
          <h2>{modelTitle}</h2>
          {modelDescription && <p>{modelDescription}</p>}
        </div>
      )}

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

import { useState } from 'react';
import useStore from '../store/useStore';
import './StepEditor.css';

/**
 * Right panel component - allows editing the selected step
 * Provides controls for:
 * - Shape selection
 * - Description editing
 * - Color picker
 * - Position adjustment
 */
function StepEditor() {
  const steps = useStore((state) => state.steps);
  const selectedStepId = useStore((state) => state.selectedStepId);
  const updateStep = useStore((state) => state.updateStep);
  const updateSubStep = useStore((state) => state.updateSubStep);
  const viewerMode = useStore((state) => state.viewerMode);
  const connections = useStore((state) => state.connections);
  const addConnection = useStore((state) => state.addConnection);
  const deleteConnection = useStore((state) => state.deleteConnection);

  // Find the selected step (could be a main step or a substep)
  let selectedStep = null;
  let parentStep = null;
  let isSubStep = false;

  // First, check if it's a main step
  selectedStep = steps.find((step) => step.id === selectedStepId);
  
  // If not found, search in substeps
  if (!selectedStep) {
    for (const step of steps) {
      if (step.subSteps && step.subSteps.length > 0) {
        const foundSubStep = step.subSteps.find((subStep) => subStep.id === selectedStepId);
        if (foundSubStep) {
          selectedStep = foundSubStep;
          parentStep = step;
          isSubStep = true;
          break;
        }
      }
    }
  }

  // Handle form changes - update directly in the store
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    if (selectedStep && !viewerMode) {
      if (isSubStep) {
        updateSubStep(parentStep.id, selectedStep.id, { description: newDescription });
      } else {
        updateStep(selectedStep.id, { description: newDescription });
      }
    }
  };

  const handleShapeChange = (e) => {
    const newShape = e.target.value;
    if (selectedStep && !viewerMode) {
      if (isSubStep) {
        updateSubStep(parentStep.id, selectedStep.id, { shape: newShape });
      } else {
        updateStep(selectedStep.id, { shape: newShape });
      }
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    // Validate hex color format (# followed by 3 or 6 hex digits)
    const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(newColor);
    
    // For color picker input, always update (it always gives valid colors)
    // For text input, only update if it's a valid hex color
    if (selectedStep && !viewerMode && (e.target.type === 'color' || isValidHex)) {
      if (isSubStep) {
        updateSubStep(parentStep.id, selectedStep.id, { color: newColor });
      } else {
        updateStep(selectedStep.id, { color: newColor });
      }
    }
  };
  
  // State for new connection form
  const [newConnectionTarget, setNewConnectionTarget] = useState('');
  const [newConnectionDescription, setNewConnectionDescription] = useState('');
  
  // Get all available steps and substeps for connection target dropdown
  const getAllStepsForDropdown = () => {
    const options = [];
    steps.forEach((step) => {
      options.push({
        id: step.id,
        label: `Step ${steps.indexOf(step) + 1}: ${step.description}`,
        isSubstep: false,
      });
      if (step.subSteps && step.subSteps.length > 0) {
        step.subSteps.forEach((subStep, subIndex) => {
          options.push({
            id: subStep.id,
            label: `  └─ Substep ${subIndex + 1}: ${subStep.description}`,
            isSubstep: true,
          });
        });
      }
    });
    return options;
  };
  
  // Handle adding a new connection
  const handleAddConnection = () => {
    if (!selectedStep || !newConnectionTarget) return;
    
    const targetId = parseInt(newConnectionTarget, 10);
    // Don't allow connecting to self
    if (targetId === selectedStep.id) {
      alert('Cannot create a connection to the same step');
      return;
    }
    
    addConnection(selectedStep.id, targetId, newConnectionDescription);
    
    // Reset form
    setNewConnectionTarget('');
    setNewConnectionDescription('');
  };
  
  // Get connections related to the selected step
  const getRelatedConnections = () => {
    if (!selectedStep) return [];
    return connections.filter(
      conn => conn.from === selectedStep.id || conn.to === selectedStep.id
    );
  };
  
  // Helper to get step label by ID
  const getStepLabel = (stepId) => {
    for (const step of steps) {
      if (step.id === stepId) {
        return `Step ${steps.indexOf(step) + 1}: ${step.description}`;
      }
      if (step.subSteps) {
        for (const subStep of step.subSteps) {
          if (subStep.id === stepId) {
            const subIndex = step.subSteps.indexOf(subStep);
            return `Substep ${subIndex + 1}: ${subStep.description}`;
          }
        }
      }
    }
    console.warn(`Step with ID ${stepId} not found`);
    return 'Unknown';
  };

  if (!selectedStep) {
    return (
      <div className="step-editor">
        <div className="step-editor-header">
          <h2>{viewerMode ? 'Step Details' : 'Step Editor'}</h2>
        </div>
        <div className="no-selection">
          Select a step to {viewerMode ? 'view' : 'edit'} its properties
        </div>
      </div>
    );
  }

  // Calculate step index for display
  let stepIndex = 0;
  if (isSubStep && parentStep) {
    stepIndex = parentStep.subSteps.findIndex(s => s.id === selectedStep.id);
  } else {
    stepIndex = steps.findIndex(s => s.id === selectedStep.id);
  }

  return (
    <div className="step-editor">
      <div className="step-editor-header">
        <h2>{viewerMode ? 'Step Details' : 'Step Editor'}</h2>
        {isSubStep && <span className="substep-badge">Substep</span>}
      </div>

      <div className="step-editor-content">
        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={selectedStep.description}
            onChange={handleDescriptionChange}
            className="form-control"
            rows="4"
            placeholder="Enter step description..."
            disabled={viewerMode}
          />
        </div>

        {/* Show settings only in creator mode */}
        {!viewerMode && (
          <>
            {/* Shape Selection */}
            <div className="form-group">
              <label htmlFor="shape">3D Shape</label>
              <select
                id="shape"
                value={selectedStep.shape}
                onChange={handleShapeChange}
                className="form-control"
              >
                <option value="cube">Cube</option>
                <option value="sphere">Sphere</option>
                <option value="cylinder">Cylinder</option>
                <option value="cone">Cone</option>
              </select>
            </div>

            {/* Color Picker */}
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <div className="color-picker-group">
                <input
                  type="color"
                  id="color"
                  value={selectedStep.color}
                  onChange={handleColorChange}
                  className="color-input"
                />
                <input
                  type="text"
                  value={selectedStep.color}
                  onChange={handleColorChange}
                  className="color-text"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Position Display (read-only for now) */}
            <div className="form-group">
              <label>Position</label>
              <div className="position-display">
                <div className="position-axis">
                  <span className="axis-label">X:</span>
                  <span className="axis-value">{selectedStep.position[0].toFixed(2)}</span>
                </div>
                <div className="position-axis">
                  <span className="axis-label">Y:</span>
                  <span className="axis-value">{selectedStep.position[1].toFixed(2)}</span>
                </div>
                <div className="position-axis">
                  <span className="axis-label">Z:</span>
                  <span className="axis-value">{selectedStep.position[2].toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Step Info */}
            <div className="step-info-box">
              <h3>{isSubStep ? 'Substep Information' : 'Step Information'}</h3>
              <p><strong>ID:</strong> {selectedStep.id}</p>
              {isSubStep ? (
                <>
                  <p><strong>Parent Step:</strong> {parentStep ? steps.findIndex(s => s.id === parentStep.id) + 1 : 'Unknown'}</p>
                  <p><strong>Substep Index:</strong> {stepIndex + 1} of {parentStep?.subSteps?.length || 0}</p>
                </>
              ) : (
                <>
                  <p><strong>Index:</strong> {stepIndex + 1} of {steps.length}</p>
                  <p><strong>Substeps:</strong> {selectedStep.subSteps?.length || 0}</p>
                </>
              )}
            </div>
            
            {/* Connections Management */}
            <div className="connections-section">
              <h3>Connections</h3>
              
              {/* Existing connections */}
              <div className="connections-list">
                {getRelatedConnections().length > 0 ? (
                  getRelatedConnections().map((conn) => (
                    <div key={conn.id} className="connection-item">
                      <div className="connection-info">
                        <div className="connection-direction">
                          {conn.from === selectedStep.id ? (
                            <>
                              <span className="connection-label">To:</span> {getStepLabel(conn.to)}
                            </>
                          ) : (
                            <>
                              <span className="connection-label">From:</span> {getStepLabel(conn.from)}
                            </>
                          )}
                        </div>
                        {conn.description && (
                          <div className="connection-description">"{conn.description}"</div>
                        )}
                      </div>
                      <button
                        className="delete-connection-btn"
                        onClick={() => deleteConnection(conn.id)}
                        title="Delete connection"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-connections">No connections yet.</p>
                )}
              </div>
              
              {/* Add new connection */}
              <div className="add-connection-form">
                <h4>Add Connection</h4>
                <div className="form-group">
                  <label htmlFor="connection-target">Connect to:</label>
                  <select
                    id="connection-target"
                    className="form-control"
                    value={newConnectionTarget}
                    onChange={(e) => setNewConnectionTarget(e.target.value)}
                  >
                    <option value="">Select a step...</option>
                    {getAllStepsForDropdown()
                      .filter(option => option.id !== selectedStep.id)
                      .map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="connection-description">Description (optional):</label>
                  <input
                    id="connection-description"
                    type="text"
                    className="form-control"
                    value={newConnectionDescription}
                    onChange={(e) => setNewConnectionDescription(e.target.value)}
                    placeholder="e.g., 'Next step', 'Alternative path'..."
                  />
                </div>
                <button
                  className="add-connection-btn"
                  onClick={handleAddConnection}
                  disabled={!newConnectionTarget}
                >
                  Add Connection
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StepEditor;

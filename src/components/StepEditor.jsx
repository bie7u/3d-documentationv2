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

  // Find the selected step
  const selectedStep = steps.find((step) => step.id === selectedStepId);

  // Handle form changes - update directly in the store
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    if (selectedStep) {
      updateStep(selectedStep.id, { description: newDescription });
    }
  };

  const handleShapeChange = (e) => {
    const newShape = e.target.value;
    if (selectedStep) {
      updateStep(selectedStep.id, { shape: newShape });
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    // Validate hex color format (# followed by 3 or 6 hex digits)
    const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(newColor);
    
    // For color picker input, always update (it always gives valid colors)
    // For text input, only update if it's a valid hex color
    if (selectedStep && (e.target.type === 'color' || isValidHex)) {
      updateStep(selectedStep.id, { color: newColor });
    }
  };

  if (!selectedStep) {
    return (
      <div className="step-editor">
        <div className="step-editor-header">
          <h2>Step Editor</h2>
        </div>
        <div className="no-selection">
          Select a step to edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className="step-editor">
      <div className="step-editor-header">
        <h2>Step Editor</h2>
      </div>

      <div className="step-editor-content">
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
          />
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
          <h3>Step Information</h3>
          <p><strong>ID:</strong> {selectedStep.id}</p>
          <p><strong>Index:</strong> {steps.findIndex(s => s.id === selectedStep.id) + 1} of {steps.length}</p>
        </div>
      </div>
    </div>
  );
}

export default StepEditor;

import useStore from '../store/useStore';
import './StepList.css';

/**
 * Left panel component - displays a list of all steps
 * Allows selecting and deleting steps
 */
function StepList() {
  const steps = useStore((state) => state.steps);
  const selectedStepId = useStore((state) => state.selectedStepId);
  const selectStep = useStore((state) => state.selectStep);
  const deleteStep = useStore((state) => state.deleteStep);
  const addStep = useStore((state) => state.addStep);
  const viewerMode = useStore((state) => state.viewerMode);

  return (
    <div className="step-list">
      <div className="step-list-header">
        <h2>Steps</h2>
        {!viewerMode && (
          <button className="add-step-btn" onClick={addStep} title="Add new step">
            + Add Step
          </button>
        )}
      </div>
      
      <div className="step-list-items">
        {steps.length === 0 ? (
          <div className="empty-message">
            {viewerMode 
              ? 'No steps in this model.' 
              : 'No steps yet. Click "Add Step" to create your first step.'}
          </div>
        ) : (
          steps.map((step, index) => (
            <div
              key={step.id}
              className={`step-item ${step.id === selectedStepId ? 'selected' : ''}`}
              onClick={() => selectStep(step.id)}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-info">
                <div className="step-shape">{step.shape}</div>
                <div className="step-description">{step.description}</div>
              </div>
              <div className="step-color" style={{ backgroundColor: step.color }}></div>
              {!viewerMode && (
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStep(step.id);
                  }}
                  title="Delete step"
                >
                  ×
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StepList;

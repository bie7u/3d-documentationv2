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
  const addSubStep = useStore((state) => state.addSubStep);
  const deleteSubStep = useStore((state) => state.deleteSubStep);
  const viewerMode = useStore((state) => state.viewerMode);

  // Render a single step item (can be used for both steps and substeps)
  const renderStepItem = (step, index, isSubStep = false, parentId = null) => (
    <div key={step.id} className={isSubStep ? 'substep-container' : ''}>
      <div
        className={`step-item ${step.id === selectedStepId ? 'selected' : ''} ${isSubStep ? 'substep-item' : ''}`}
        onClick={() => selectStep(step.id)}
      >
        <div className="step-number">{isSubStep ? `${index + 1}` : index + 1}</div>
        <div className="step-info">
          <div className="step-shape">{step.shape}</div>
          <div className="step-description">{step.description}</div>
        </div>
        <div className="step-color" style={{ backgroundColor: step.color }}></div>
        {!viewerMode && (
          <>
            {!isSubStep && (
              <button
                className="add-substep-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addSubStep(step.id);
                }}
                title="Add substep"
              >
                +
              </button>
            )}
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (isSubStep) {
                  deleteSubStep(parentId, step.id);
                } else {
                  deleteStep(step.id);
                }
              }}
              title={isSubStep ? 'Delete substep' : 'Delete step'}
            >
              ×
            </button>
          </>
        )}
      </div>
      
      {/* Render substeps if they exist */}
      {step.subSteps && step.subSteps.length > 0 && (
        <div className="substeps-list">
          {step.subSteps.map((subStep, subIndex) =>
            renderStepItem(subStep, subIndex, true, step.id)
          )}
        </div>
      )}
    </div>
  );

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
          steps.map((step, index) => renderStepItem(step, index))
        )}
      </div>
    </div>
  );
}

export default StepList;

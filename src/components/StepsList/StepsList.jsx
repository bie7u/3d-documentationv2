import React from 'react';
import useStepsStore from '../../store/useStepsStore';
import './StepsList.css';

const StepsList = () => {
  const steps = useStepsStore((state) => state.steps);
  const activeStepId = useStepsStore((state) => state.activeStepId);
  const setActiveStep = useStepsStore((state) => state.setActiveStep);
  const deleteStep = useStepsStore((state) => state.deleteStep);

  return (
    <div className="steps-list">
      <h2>Lista Kroków</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step-item ${step.id === activeStepId ? 'active' : ''}`}
            onClick={() => setActiveStep(step.id)}
          >
            <div className="step-header">
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
            </div>
            <div className="step-meta">
              <span className="step-shape">{step.shapeType}</span>
              <div 
                className="step-color" 
                style={{ backgroundColor: step.color }}
              ></div>
            </div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (steps.length > 1) {
                  deleteStep(step.id);
                } else {
                  alert('Nie można usunąć ostatniego kroku!');
                }
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsList;

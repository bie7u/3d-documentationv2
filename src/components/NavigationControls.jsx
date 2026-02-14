import useStore from '../store/useStore';
import './NavigationControls.css';

/**
 * Navigation controls for moving between steps
 * Displays current step number and provides Previous/Next buttons
 */
function NavigationControls() {
  const steps = useStore((state) => state.steps);
  const selectedStepId = useStore((state) => state.selectedStepId);
  const previousStep = useStore((state) => state.previousStep);
  const nextStep = useStore((state) => state.nextStep);

  // Find the current step index
  const currentIndex = steps.findIndex((step) => step.id === selectedStepId);
  const currentStep = currentIndex + 1;
  const totalSteps = steps.length;

  // Check if navigation is possible
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalSteps - 1 && currentIndex >= 0;

  if (totalSteps === 0) {
    return null; // Don't show navigation if there are no steps
  }

  return (
    <div className="navigation-controls">
      <button
        className="nav-btn"
        onClick={previousStep}
        disabled={!canGoPrevious}
        title="Previous step"
      >
        ← Previous
      </button>
      
      <div className="step-counter">
        <span className="current-step">{currentStep}</span>
        <span className="separator">/</span>
        <span className="total-steps">{totalSteps}</span>
      </div>
      
      <button
        className="nav-btn"
        onClick={nextStep}
        disabled={!canGoNext}
        title="Next step"
      >
        Next →
      </button>
    </div>
  );
}

export default NavigationControls;

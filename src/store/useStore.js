import { create } from 'zustand';

/**
 * Zustand store for managing the 3D documentation creator state
 * 
 * State structure:
 * - steps: Array of step objects, each containing:
 *   - id: unique identifier
 *   - shape: type of 3D shape (cube, sphere, cylinder, cone)
 *   - description: text description of the step
 *   - position: [x, y, z] coordinates in 3D space
 *   - color: hex color for the shape
 * - selectedStepId: ID of the currently selected step
 * - nextPosition: Next available position for a new step
 */
const useStore = create((set, get) => ({
  // Array of steps in the documentation
  steps: [],
  
  // ID of the currently selected step
  selectedStepId: null,
  
  // Next position for placing a new step (automatically calculated)
  nextPosition: [0, 0, 0],
  
  /**
   * Add a new step to the documentation
   * Automatically positions it relative to the last step and creates a connection
   */
  addStep: () => {
    const { steps, nextPosition } = get();
    const id = Date.now(); // Simple unique ID
    
    const newStep = {
      id,
      shape: 'cube', // Default shape
      description: `Step ${steps.length + 1}`,
      position: [...nextPosition],
      color: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color
    };
    
    // Calculate next position (move to the right by 3 units)
    const newNextPosition = [nextPosition[0] + 3, nextPosition[1], nextPosition[2]];
    
    set({
      steps: [...steps, newStep],
      selectedStepId: id,
      nextPosition: newNextPosition,
    });
  },
  
  /**
   * Delete a step by ID
   * If deleting the selected step, select the previous one
   */
  deleteStep: (id) => {
    const { steps, selectedStepId } = get();
    const newSteps = steps.filter(step => step.id !== id);
    
    // If we deleted the selected step, select another one
    let newSelectedId = selectedStepId;
    if (selectedStepId === id) {
      newSelectedId = newSteps.length > 0 ? newSteps[newSteps.length - 1].id : null;
    }
    
    set({
      steps: newSteps,
      selectedStepId: newSelectedId,
    });
  },
  
  /**
   * Update a step's properties
   */
  updateStep: (id, updates) => {
    const { steps } = get();
    const newSteps = steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    );
    
    set({ steps: newSteps });
  },
  
  /**
   * Select a step by ID
   */
  selectStep: (id) => {
    set({ selectedStepId: id });
  },
  
  /**
   * Navigate to the next step
   */
  nextStep: () => {
    const { steps, selectedStepId } = get();
    if (steps.length === 0) return;
    
    const currentIndex = steps.findIndex(step => step.id === selectedStepId);
    if (currentIndex < steps.length - 1) {
      set({ selectedStepId: steps[currentIndex + 1].id });
    }
  },
  
  /**
   * Navigate to the previous step
   */
  previousStep: () => {
    const { steps, selectedStepId } = get();
    if (steps.length === 0) return;
    
    const currentIndex = steps.findIndex(step => step.id === selectedStepId);
    if (currentIndex > 0) {
      set({ selectedStepId: steps[currentIndex - 1].id });
    }
  },
}));

export default useStore;

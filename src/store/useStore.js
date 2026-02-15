import { create } from 'zustand';

/**
 * Zustand store for managing the 3D documentation creator state
 * 
 * State structure:
 * - modelTitle: Title of the model/documentation
 * - modelDescription: Overall description of the model
 * - steps: Array of step objects, each containing:
 *   - id: unique identifier
 *   - shape: type of 3D shape (cube, sphere, cylinder, cone)
 *   - description: text description of the step
 *   - position: [x, y, z] coordinates in 3D space
 *   - color: hex color for the shape
 *   - subSteps: Array of substep objects (same structure as steps)
 * - selectedStepId: ID of the currently selected step
 * - nextPosition: Next available position for a new step
 * - viewerMode: Boolean flag for viewer mode (read-only)
 */
const useStore = create((set, get) => ({
  // Model metadata
  modelTitle: 'Untitled Model',
  modelDescription: '',
  
  // Array of steps in the documentation
  steps: [],
  
  // Custom connections between steps (with descriptions)
  // Each connection: { id, from, to, description }
  connections: [],
  
  // ID of the currently selected step
  selectedStepId: null,
  
  // Next position for placing a new step (automatically calculated)
  nextPosition: [0, 0, 0],
  
  // Viewer mode flag
  viewerMode: false,
  
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
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'), // Random color with proper padding
      subSteps: [], // Initialize empty substeps array
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
   * Add a substep to a specific parent step
   * Note: While the data structure supports nested substeps (substeps having their own substeps),
   * the UI currently limits substeps to one level for simplicity. This can be extended in the future if needed.
   */
  addSubStep: (parentId) => {
    const { steps } = get();
    const parentStep = steps.find(step => step.id === parentId);
    if (!parentStep) return;
    
    const subStepId = Date.now();
    const subStepCount = parentStep.subSteps?.length || 0;
    
    // Calculate position for the substep
    // Place substeps below the parent step (Y - 2) and offset in Z direction
    const newSubStep = {
      id: subStepId,
      shape: 'cube',
      description: `Substep ${subStepCount + 1}`,
      position: [
        parentStep.position[0],
        parentStep.position[1] - 2,
        parentStep.position[2] + (subStepCount * 2)
      ],
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      subSteps: [], // Substeps can also have substeps
    };
    
    const newSteps = steps.map(step =>
      step.id === parentId
        ? { ...step, subSteps: [...(step.subSteps || []), newSubStep] }
        : step
    );
    
    set({
      steps: newSteps,
      selectedStepId: subStepId,
    });
  },
  
  /**
   * Delete a substep from a parent step
   */
  deleteSubStep: (parentId, subStepId) => {
    const { steps, selectedStepId } = get();
    
    const newSteps = steps.map(step => {
      if (step.id === parentId) {
        const newSubSteps = (step.subSteps || []).filter(subStep => subStep.id !== subStepId);
        return { ...step, subSteps: newSubSteps };
      }
      return step;
    });
    
    // If we deleted the selected substep, select the parent
    let newSelectedId = selectedStepId;
    if (selectedStepId === subStepId) {
      newSelectedId = parentId;
    }
    
    set({
      steps: newSteps,
      selectedStepId: newSelectedId,
    });
  },
  
  /**
   * Update a substep's properties
   */
  updateSubStep: (parentId, subStepId, updates) => {
    const { steps } = get();
    
    const newSteps = steps.map(step => {
      if (step.id === parentId) {
        const newSubSteps = (step.subSteps || []).map(subStep =>
          subStep.id === subStepId ? { ...subStep, ...updates } : subStep
        );
        return { ...step, subSteps: newSubSteps };
      }
      return step;
    });
    
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
  
  /**
   * Update model metadata
   */
  updateModelMetadata: (updates) => {
    set(updates);
  },
  
  /**
   * Toggle viewer mode
   */
  toggleViewerMode: () => {
    set((state) => ({ viewerMode: !state.viewerMode }));
  },
  
  /**
   * Set viewer mode
   */
  setViewerMode: (mode) => {
    set({ viewerMode: mode });
  },
  
  /**
   * Add a custom connection between two steps/substeps
   * @param {number} from - ID of the source step/substep
   * @param {number} to - ID of the target step/substep
   * @param {string} description - Description of the connection
   */
  addConnection: (from, to, description = '') => {
    const { connections } = get();
    const id = Date.now();
    
    const newConnection = {
      id,
      from,
      to,
      description,
    };
    
    set({ connections: [...connections, newConnection] });
  },
  
  /**
   * Delete a custom connection by ID
   */
  deleteConnection: (connectionId) => {
    const { connections } = get();
    set({ connections: connections.filter(conn => conn.id !== connectionId) });
  },
  
  /**
   * Update a connection's properties
   */
  updateConnection: (connectionId, updates) => {
    const { connections } = get();
    const newConnections = connections.map(conn =>
      conn.id === connectionId ? { ...conn, ...updates } : conn
    );
    set({ connections: newConnections });
  },
  
  /**
   * Save the current model to localStorage
   */
  saveModel: () => {
    const { modelTitle, modelDescription, steps, connections } = get();
    
    const modelData = {
      title: modelTitle,
      description: modelDescription,
      steps: steps,
      connections: connections,
      savedAt: new Date().toISOString(),
    };
    
    // Get existing saved models
    const savedModels = JSON.parse(localStorage.getItem('savedModels') || '[]');
    
    // Generate a unique ID for the model (timestamp + random component)
    const modelId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    modelData.id = modelId;
    
    // Add to saved models
    savedModels.push(modelData);
    
    // Save back to localStorage
    localStorage.setItem('savedModels', JSON.stringify(savedModels));
    
    return modelId;
  },
  
  /**
   * Load a model from localStorage
   */
  loadModel: (modelId) => {
    const savedModels = JSON.parse(localStorage.getItem('savedModels') || '[]');
    const model = savedModels.find(m => m.id === modelId);
    
    if (model) {
      set({
        modelTitle: model.title,
        modelDescription: model.description,
        steps: model.steps,
        connections: model.connections || [],
        selectedStepId: model.steps.length > 0 ? model.steps[0].id : null,
        nextPosition: model.steps.length > 0 
          ? [model.steps[model.steps.length - 1].position[0] + 3, 0, 0]
          : [0, 0, 0],
        viewerMode: false,
      });
    }
  },
  
  /**
   * Get all saved models
   */
  getSavedModels: () => {
    return JSON.parse(localStorage.getItem('savedModels') || '[]');
  },
  
  /**
   * Delete a saved model
   */
  deleteModel: (modelId) => {
    const savedModels = JSON.parse(localStorage.getItem('savedModels') || '[]');
    const filteredModels = savedModels.filter(m => m.id !== modelId);
    localStorage.setItem('savedModels', JSON.stringify(filteredModels));
  },
  
  /**
   * Clear the current model and start fresh
   */
  clearModel: () => {
    set({
      modelTitle: 'Untitled Model',
      modelDescription: '',
      steps: [],
      connections: [],
      selectedStepId: null,
      nextPosition: [0, 0, 0],
      viewerMode: false,
    });
  },
}));

export default useStore;

import { create } from 'zustand';

const useStepsStore = create((set) => ({
  steps: [
    {
      id: '1',
      title: 'Krok 1: Podstawa',
      description: 'Stwórz podstawę konstrukcji jako kostkę',
      shapeType: 'cube',
      position: [0, 0, 0],
      color: '#4a90e2',
      size: 1,
      connections: null,
    },
    {
      id: '2',
      title: 'Krok 2: Połączenie',
      description: 'Dodaj cylinder jako element łączący',
      shapeType: 'cylinder',
      position: [2, 1, 0],
      color: '#e24a4a',
      size: 1,
      connections: '1',
    },
    {
      id: '3',
      title: 'Krok 3: Element sferyczny',
      description: 'Umieść kulę jako górny element',
      shapeType: 'sphere',
      position: [4, 2, 0],
      color: '#4ae24a',
      size: 1,
      connections: '2',
    },
  ],
  activeStepId: '1',

  setActiveStep: (id) => set({ activeStepId: id }),

  addStep: (step) =>
    set((state) => {
      const lastStep = state.steps[state.steps.length - 1];
      const newStep = {
        ...step,
        id: Date.now().toString(),
        connections: lastStep ? lastStep.id : null,
        position: lastStep 
          ? [lastStep.position[0] + 2, lastStep.position[1] + 0.5, lastStep.position[2]]
          : [0, 0, 0],
      };
      return {
        steps: [...state.steps, newStep],
        activeStepId: newStep.id,
      };
    }),

  updateStep: (id, updatedData) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === id ? { ...step, ...updatedData } : step
      ),
    })),

  deleteStep: (id) =>
    set((state) => {
      const filteredSteps = state.steps.filter((step) => step.id !== id);
      // Update connections
      const updatedSteps = filteredSteps.map((step) => {
        if (step.connections === id) {
          const deletedStepIndex = state.steps.findIndex((s) => s.id === id);
          const deletedStep = state.steps[deletedStepIndex];
          return { ...step, connections: deletedStep?.connections || null };
        }
        return step;
      });
      
      const newActiveStepId = 
        state.activeStepId === id 
          ? (updatedSteps[0]?.id || null)
          : state.activeStepId;
      
      return {
        steps: updatedSteps,
        activeStepId: newActiveStepId,
      };
    }),
}));

export default useStepsStore;

import React, { useState, useEffect } from 'react';
import useStepsStore from '../../store/useStepsStore';
import './StepForm.css';

const StepForm = () => {
  const steps = useStepsStore((state) => state.steps);
  const activeStepId = useStepsStore((state) => state.activeStepId);
  const addStep = useStepsStore((state) => state.addStep);
  const updateStep = useStepsStore((state) => state.updateStep);

  const activeStep = steps.find((step) => step.id === activeStepId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shapeType: 'cube',
    color: '#4a90e2',
    size: 1,
    position: [0, 0, 0],
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (activeStep) {
      setFormData({
        title: activeStep.title,
        description: activeStep.description,
        shapeType: activeStep.shapeType,
        color: activeStep.color,
        size: activeStep.size,
        position: activeStep.position,
      });
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [activeStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePositionChange = (index, value) => {
    const newPosition = [...formData.position];
    newPosition[index] = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      position: newPosition,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode && activeStep) {
      updateStep(activeStep.id, formData);
    } else {
      addStep(formData);
    }
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      description: '',
      shapeType: 'cube',
      color: '#4a90e2',
      size: 1,
      position: [0, 0, 0],
    });
    setIsEditMode(false);
  };

  return (
    <div className="step-form">
      <div className="form-header">
        <h2>{isEditMode ? 'Edycja Kroku' : 'Dodaj Nowy Krok'}</h2>
        {isEditMode && (
          <button className="add-new-btn" onClick={handleAddNew}>
            + Nowy Krok
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Nazwa kroku:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Opis kroku:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="shapeType">Model 3D:</label>
          <select
            id="shapeType"
            name="shapeType"
            value={formData.shapeType}
            onChange={handleChange}
          >
            <option value="cube">Kostka</option>
            <option value="cylinder">Cylinder</option>
            <option value="sphere">Kula</option>
            <option value="cone">Stożek</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="color">Kolor:</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
              <span className="color-value">{formData.color}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="size">Rozmiar:</label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              min="0.1"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Pozycja (X, Y, Z):</label>
          <div className="position-inputs">
            <input
              type="number"
              value={formData.position[0]}
              onChange={(e) => handlePositionChange(0, e.target.value)}
              step="0.5"
              placeholder="X"
            />
            <input
              type="number"
              value={formData.position[1]}
              onChange={(e) => handlePositionChange(1, e.target.value)}
              step="0.5"
              placeholder="Y"
            />
            <input
              type="number"
              value={formData.position[2]}
              onChange={(e) => handlePositionChange(2, e.target.value)}
              step="0.5"
              placeholder="Z"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          {isEditMode ? 'Zaktualizuj Krok' : 'Dodaj Krok'}
        </button>
      </form>
    </div>
  );
};

export default StepForm;

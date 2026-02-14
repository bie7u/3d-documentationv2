import { useState } from 'react';
import useStore from '../store/useStore';
import './SaveLoadPanel.css';

/**
 * SaveLoadPanel component - allows saving and loading models
 * Provides controls for:
 * - Model title and description editing
 * - Saving current model
 * - Loading saved models
 * - Deleting saved models
 * - Toggling viewer mode
 */
function SaveLoadPanel() {
  const modelTitle = useStore((state) => state.modelTitle);
  const modelDescription = useStore((state) => state.modelDescription);
  const updateModelMetadata = useStore((state) => state.updateModelMetadata);
  const saveModel = useStore((state) => state.saveModel);
  const loadModel = useStore((state) => state.loadModel);
  const deleteModel = useStore((state) => state.deleteModel);
  const clearModel = useStore((state) => state.clearModel);
  const viewerMode = useStore((state) => state.viewerMode);
  const setViewerMode = useStore((state) => state.setViewerMode);
  const steps = useStore((state) => state.steps);
  
  const [savedModels, setSavedModels] = useState([]);
  const [showSavedModels, setShowSavedModels] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Refresh the list of saved models
  const refreshSavedModels = () => {
    const models = JSON.parse(localStorage.getItem('savedModels') || '[]');
    setSavedModels(models);
  };

  // Handle save button click
  const handleSave = () => {
    if (!modelTitle.trim()) {
      setSaveMessage('Please enter a model title');
      return;
    }
    
    if (steps.length === 0) {
      setSaveMessage('Please add at least one step before saving');
      return;
    }
    
    saveModel();
    setSaveMessage('Model saved successfully!');
    refreshSavedModels();
    
    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Handle load button click
  const handleLoad = (modelId) => {
    loadModel(modelId);
    setShowSavedModels(false);
    setSaveMessage('Model loaded successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Handle delete button click
  const handleDelete = (modelId) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      deleteModel(modelId);
      refreshSavedModels();
      setSaveMessage('Model deleted successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Handle new model button click
  const handleNewModel = () => {
    if (steps.length > 0) {
      if (window.confirm('Are you sure? Unsaved changes will be lost.')) {
        clearModel();
        setSaveMessage('Started new model');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } else {
      clearModel();
    }
  };

  // Toggle saved models list
  const handleToggleSavedModels = () => {
    if (!showSavedModels) {
      refreshSavedModels();
    }
    setShowSavedModels(!showSavedModels);
  };

  return (
    <div className="save-load-panel">
      <div className="panel-header">
        <h2>Model Settings</h2>
      </div>

      <div className="panel-content">
        {/* Model Metadata */}
        <div className="form-group">
          <label htmlFor="model-title">Model Title</label>
          <input
            type="text"
            id="model-title"
            value={modelTitle}
            onChange={(e) => updateModelMetadata({ modelTitle: e.target.value })}
            className="form-control"
            placeholder="Enter model title..."
            disabled={viewerMode}
          />
        </div>

        <div className="form-group">
          <label htmlFor="model-description">Model Description</label>
          <textarea
            id="model-description"
            value={modelDescription}
            onChange={(e) => updateModelMetadata({ modelDescription: e.target.value })}
            className="form-control"
            rows="3"
            placeholder="Enter model description..."
            disabled={viewerMode}
          />
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="save-message">{saveMessage}</div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="action-btn save-btn" 
            onClick={handleSave}
            disabled={viewerMode}
            title="Save current model"
          >
            💾 Save Model
          </button>
          
          <button 
            className="action-btn load-btn" 
            onClick={handleToggleSavedModels}
            title="Load a saved model"
          >
            📂 {showSavedModels ? 'Hide' : 'Load Model'}
          </button>
          
          <button 
            className="action-btn new-btn" 
            onClick={handleNewModel}
            disabled={viewerMode}
            title="Start a new model"
          >
            📄 New Model
          </button>
          
          <button 
            className={`action-btn viewer-btn ${viewerMode ? 'active' : ''}`}
            onClick={() => setViewerMode(!viewerMode)}
            title={viewerMode ? 'Switch to creator mode' : 'Switch to viewer mode'}
          >
            {viewerMode ? '✏️ Creator Mode' : '👁️ Viewer Mode'}
          </button>
        </div>

        {/* Saved Models List */}
        {showSavedModels && (
          <div className="saved-models-list">
            <h3>Saved Models</h3>
            {savedModels.length === 0 ? (
              <div className="empty-message">No saved models yet</div>
            ) : (
              <div className="models-grid">
                {savedModels.map((model) => (
                  <div key={model.id} className="model-card">
                    <div className="model-info">
                      <div className="model-title">{model.title}</div>
                      <div className="model-meta">
                        {model.steps.length} step{model.steps.length !== 1 ? 's' : ''}
                      </div>
                      <div className="model-date">
                        {new Date(model.savedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="model-actions">
                      <button
                        className="load-model-btn"
                        onClick={() => handleLoad(model.id)}
                        title="Load this model"
                      >
                        Load
                      </button>
                      <button
                        className="delete-model-btn"
                        onClick={() => handleDelete(model.id)}
                        title="Delete this model"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Viewer Mode Indicator */}
        {viewerMode && (
          <div className="viewer-mode-indicator">
            <span>📖 Viewing Mode</span>
            <p>Step through the instructions using navigation controls</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SaveLoadPanel;

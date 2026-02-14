# 3D Documentation Creator

A web application for creating step-by-step 3D documentation with interactive models.

## Features

- **Interactive 3D Scene**: Visualize documentation steps with 3D shapes (cube, sphere, cylinder, cone)
- **Step Management**: Add, delete, and edit documentation steps
- **Automatic Connections**: Visual connections between sequential steps
- **Three-Panel Layout**:
  - Left Panel: List of all steps
  - Center Panel: Interactive 3D scene with camera controls
  - Right Panel: Step editor for customization
- **Navigation Controls**: Easy navigation between steps with Previous/Next buttons
- **Real-time Editing**: Changes to shape, color, and description update instantly

## Technology Stack

- **React**: UI framework
- **Vite**: Build tool and development server
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber
- **Zustand**: Lightweight state management

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bie7u/3d-documentationv2.git
cd 3d-documentationv2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating Documentation

1. **Add a Step**: Click the "Add Step" button in the left panel
2. **Select a Shape**: Use the dropdown in the right panel to choose a 3D shape
3. **Edit Description**: Enter a description for the step
4. **Customize Color**: Pick a color using the color picker
5. **Navigate**: Use the Previous/Next buttons to move between steps
6. **Delete Steps**: Click the × button next to a step to remove it

### 3D Scene Interaction

- **Rotate**: Left-click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag (or shift + left-click)

## Project Structure

```
src/
├── components/
│   ├── Scene3D.jsx          # Main 3D scene component
│   ├── Shape3D.jsx          # Individual 3D shape renderer
│   ├── Connection.jsx       # Connection line between steps
│   ├── StepList.jsx         # Left panel - step list
│   ├── StepList.css
│   ├── StepEditor.jsx       # Right panel - step editor
│   ├── StepEditor.css
│   ├── NavigationControls.jsx  # Navigation buttons
│   └── NavigationControls.css
├── store/
│   └── useStore.js          # Zustand state management
├── App.jsx                  # Main application component
├── App.css
├── main.jsx                 # Application entry point
└── index.css               # Global styles
```

## Key Components

### Store (Zustand)

The application state is managed using Zustand and includes:
- `steps`: Array of step objects
- `selectedStepId`: Currently selected step
- `addStep()`: Add a new step
- `deleteStep(id)`: Remove a step
- `updateStep(id, updates)`: Update step properties
- `selectStep(id)`: Select a step
- `nextStep()` / `previousStep()`: Navigate between steps

### Step Object Structure

```javascript
{
  id: number,           // Unique identifier
  shape: string,        // 'cube' | 'sphere' | 'cylinder' | 'cone'
  description: string,  // Text description
  position: [x, y, z],  // 3D coordinates
  color: string         // Hex color code
}
```

## Building for Production

```bash
npm run build
```

The optimized files will be in the `dist` directory.

## Future Enhancements

- Export documentation as PDF or JSON
- Import/export functionality
- Custom 3D models support
- Undo/redo functionality
- Step duplication
- Drag-and-drop to reorder steps
- Backend integration for saving/loading projects
- Animation between steps
- Multiple connection types

## License

MIT License

## Author

Created with ❤️ using React and Three.js

# Blood-Flow-Animation
A dynamic and interactive web-based simulation of blood flow, visualizing red blood cells, white blood cells, and platelets moving through a vessel. This project offers customizable controls and two visualization modes: particle-based and wave-based.

![Screenshot](https://github.com/user-attachments/assets/46185d44-5046-4ed4-8234-3deb33cfe413)


## Features
- Realistic Particle System: Simulates blood cells with distinct sizes, colors, and behaviors:
  - Red Blood Cells (85%): Oxygen carriers with a concave shape.
  - White Blood Cells (10%): Immune cells with granular textures.
  - Platelets (5%): Clotting cells with irregular shapes.

## Visualization Modes:
- Particles: Displays individual blood cells flowing in a wave-like motion.
- Wave: Shows a smooth wave representing the collective motion of the cells.
- Interactive Controls: Adjust flow speed, cell count, pulse strength, and frequency.
- Blood Vessel Effect: Animated vessel walls with gradients.
- Performance Monitoring: FPS counter to track animation smoothness.
- Responsive Design: Adapts to various screen sizes.

## Demo
[Live demo](https://edisedis777.github.io/Blood-Flow-Animation/)

## Installation
- Clone the Repository:
```bash
git clone https://github.com/edisedis888/blood-flow-animation.git
cd enhanced-blood-flow-animation
```

## Open the Project:
- Simply open index.html in a modern web browser (e.g., Chrome, Firefox).
- No additional dependencies or build steps are required.
- Optional: Serve Locally: Use a local server for a better experience (e.g., with Python):
```bash
python -m http.server 8000
```
- Then visit http://localhost:8000 in your browser.

## Usage
- Controls: Use the sliders at the bottom to tweak:
- Flow Speed: How fast the particles move (0.5–5).
- Cell Count: Number of particles (500–5000).
- Pulse Strength: Amplitude of the wave motion (50–200).
- Pulse Frequency: Wave oscillation rate (0.001–0.01).

## Buttons:
- Reset: Restore default settings.
- Pause/Resume: Toggle the animation.
- Show/Hide Info: Display or hide the info panel.
- Visualization Mode: Switch between "Particles" and "Wave" using the radio buttons.

## Project Structure
```text
enhanced-blood-flow-animation/
├── index.html      # Main HTML file
├── styles.css      # Styling for the UI and canvas
├── script.js       # Core logic and animation
└── README.md       # This file
```

## Technical Details
- Canvas API: Used for rendering particles and wave visualizations.
- JavaScript: Handles particle physics, animation loop, and event listeners.
- CSS: Provides a responsive layout with smooth animations and modern styling.
- Performance: Optimized with requestAnimationFrame and debounced resize events.

## Screenshots

![Particles Mode](https://github.com/user-attachments/assets/e0d744b7-8be7-4fe5-a441-0ed423bd56de)

![Wave Mode](https://github.com/user-attachments/assets/f3e36bbf-c039-48bb-b50d-2efa7ea2583c)

## Contributing
Contributions are welcome!

## License
This project is licensed under the MIT License. See the  file for details.

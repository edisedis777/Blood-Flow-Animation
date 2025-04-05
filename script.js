// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Make canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables for animation
let particles = [];
let frequency = 0.005;
let amplitude = 100;
let speed = 2;
let particleCount = 1500;
let animationId = null;
let isPaused = false;
let visualizationMode = "particles";

// Colors with enhanced blood cell theme
const colors = {
  redBloodCell: ["#e74c3c", "#c0392b", "#d35400"], // Red blood cells (multiple shades)
  whiteBloodCell: ["#7f8c8d", "#95a5a6", "#bdc3c7"], // White blood cells
  platelet: ["#f1c40f", "#f39c12"], // Platelets
};

// Controls
const speedSlider = document.getElementById("speed");
const particleSlider = document.getElementById("particles");
const amplitudeSlider = document.getElementById("amplitude");
const frequencySlider = document.getElementById("frequency");
const resetButton = document.getElementById("reset");
const pauseButton = document.getElementById("pause");
const infoPanel = document.querySelector(".info-panel");
const toggleInfoButton = document.getElementById("toggle-info");

// Value displays
const speedValue = document.getElementById("speed-value");
const particlesValue = document.getElementById("particles-value");
const amplitudeValue = document.getElementById("amplitude-value");
const frequencyValue = document.getElementById("frequency-value");

// Visualization mode
const modeRadios = document.querySelectorAll('input[name="mode"]');

// Stats
let fps = 0;
let lastFrameTime = performance.now();
let frameCount = 0;

// Event listeners
speedSlider.addEventListener("input", () => {
  speed = parseFloat(speedSlider.value);
  speedValue.textContent = speed.toFixed(1);
});

particleSlider.addEventListener("input", () => {
  particleCount = parseInt(particleSlider.value);
  particlesValue.textContent = particleCount;
  initParticles();
});

amplitudeSlider.addEventListener("input", () => {
  amplitude = parseInt(amplitudeSlider.value);
  amplitudeValue.textContent = amplitude;
});

frequencySlider.addEventListener("input", () => {
  frequency = parseFloat(frequencySlider.value);
  frequencyValue.textContent = frequency.toFixed(3);
});

resetButton.addEventListener("click", () => {
  speed = 2;
  amplitude = 100;
  particleCount = 1500;
  frequency = 0.005;

  speedSlider.value = speed;
  amplitudeSlider.value = amplitude;
  particleSlider.value = particleCount;
  frequencySlider.value = frequency;

  speedValue.textContent = speed.toFixed(1);
  amplitudeValue.textContent = amplitude;
  particlesValue.textContent = particleCount;
  frequencyValue.textContent = frequency.toFixed(3);

  document.getElementById("mode-particles").checked = true;
  visualizationMode = "particles";

  initParticles();
});

pauseButton.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "Resume" : "Pause";

  if (!isPaused && !animationId) {
    animate();
  }
});

modeRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    visualizationMode = e.target.value;
  });
});

// Fixed toggle info button functionality
toggleInfoButton.addEventListener("click", () => {
  if (infoPanel.classList.contains("hidden")) {
    infoPanel.classList.remove("hidden");
    toggleInfoButton.textContent = "Hide Info";
  } else {
    infoPanel.classList.add("hidden");
    toggleInfoButton.textContent = "Show Info";
  }
});

// Resize event with debounce
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }, 250);
});

// Particle class
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width * 1.5 - canvas.width * 0.25;
    this.baseY = canvas.height / 2;
    this.y = this.baseY;

    // Determine cell type and size
    const cellTypeProbability = Math.random();

    if (cellTypeProbability < 0.85) {
      // Red blood cell (85%)
      this.cellType = "redBloodCell";
      this.size = Math.random() * 3 + 2;
    } else if (cellTypeProbability < 0.95) {
      // White blood cell (10%)
      this.cellType = "whiteBloodCell";
      this.size = Math.random() * 6 + 5;
    } else {
      // Platelet (5%)
      this.cellType = "platelet";
      this.size = Math.random() * 2 + 1;
    }

    this.speed = (Math.random() * 2 + 1) * speed;
    this.colorIndex = Math.floor(Math.random() * colors[this.cellType].length);
    this.alpha = Math.random() * 0.7 + 0.3;
    this.oscillationOffset = Math.random() * Math.PI * 2;

    // For rotation animation
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;

    // For pulsation
    this.pulsation = Math.random() * 0.3 + 0.7;
    this.pulsationSpeed = Math.random() * 0.05 + 0.02;
  }

  update() {
    this.x += this.speed;

    // Wave motion
    const sineWave = Math.sin(this.x * frequency + this.oscillationOffset);
    this.y = this.baseY + sineWave * amplitude;

    // Rotation animation
    this.rotation += this.rotationSpeed;

    // Size pulsation (subtle)
    this.pulsation += this.pulsationSpeed;
    const pulseEffect = Math.sin(this.pulsation) * 0.2 + 1;

    // Reset when off screen
    if (this.x > canvas.width + 100) {
      this.x = -50;
    }

    return sineWave; // Return for wave visualization
  }

  draw() {
    const color = colors[this.cellType][this.colorIndex];
    const pulseEffect = Math.sin(this.pulsation) * 0.2 + 1;
    const currentSize = this.size * pulseEffect;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;

    if (this.cellType === "redBloodCell") {
      // Draw red blood cell (slightly oval)
      ctx.beginPath();
      ctx.ellipse(0, 0, currentSize * 1.2, currentSize, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Add concave center characteristic of RBCs
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        currentSize * 0.7,
        currentSize * 0.5,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16) - 30}, ${
        parseInt(color.slice(3, 5), 16) - 30
      }, ${parseInt(color.slice(5, 7), 16) - 30}, 0.5)`;
      ctx.fill();
    } else if (this.cellType === "whiteBloodCell") {
      // Draw white blood cell (with granular texture)
      ctx.beginPath();
      ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Add nucleus and granules
      ctx.beginPath();
      ctx.arc(0, 0, currentSize * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100, 100, 120, 0.6)";
      ctx.fill();

      // Random granules
      for (let i = 0; i < 5; i++) {
        const granuleX = (Math.random() - 0.5) * currentSize * 1.2;
        const granuleY = (Math.random() - 0.5) * currentSize * 1.2;
        const dist = Math.sqrt(granuleX * granuleX + granuleY * granuleY);

        if (dist < currentSize) {
          ctx.beginPath();
          ctx.arc(granuleX, granuleY, currentSize * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(190, 190, 200, 0.6)";
          ctx.fill();
        }
      }
    } else {
      // Draw platelet (irregular small shape)
      ctx.beginPath();
      ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    ctx.restore();
  }
}

// Initialize particles
function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Distribute particles across the screen
  particles.forEach((p) => {
    p.x = Math.random() * canvas.width;
  });
}

// Draw blood vessel walls
function drawVessel() {
  const centerY = canvas.height / 2;
  const vesselHeight = amplitude * 2.5;

  // Upper vessel wall
  ctx.beginPath();
  ctx.moveTo(0, centerY - vesselHeight / 2);

  for (let x = 0; x <= canvas.width; x += 20) {
    const offset = Math.sin(x * frequency * 0.5) * amplitude * 0.2;
    ctx.lineTo(x, centerY - vesselHeight / 2 + offset);
  }

  // Fix the right side of the vessel to match the left side
  ctx.lineTo(canvas.width, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();

  // Gradient for upper wall
  const upperGradient = ctx.createLinearGradient(
    0,
    centerY - vesselHeight / 2,
    0,
    0
  );
  upperGradient.addColorStop(0, "rgba(220, 80, 80, 0.9)");
  upperGradient.addColorStop(1, "rgba(130, 20, 20, 0.3)");
  ctx.fillStyle = upperGradient;
  ctx.fill();

  // Lower vessel wall
  ctx.beginPath();
  ctx.moveTo(0, centerY + vesselHeight / 2);

  for (let x = 0; x <= canvas.width; x += 20) {
    const offset = Math.sin(x * frequency * 0.5) * amplitude * 0.2;
    ctx.lineTo(x, centerY + vesselHeight / 2 + offset);
  }

  // Fix the right side of the vessel to match the left side
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();

  // Gradient for lower wall
  const lowerGradient = ctx.createLinearGradient(
    0,
    centerY + vesselHeight / 2,
    0,
    canvas.height
  );
  lowerGradient.addColorStop(0, "rgba(220, 80, 80, 0.9)");
  lowerGradient.addColorStop(1, "rgba(130, 20, 20, 0.3)");
  ctx.fillStyle = lowerGradient;
  ctx.fill();
}

// Draw wave visualization
function drawWave() {
  const centerY = canvas.height / 2;
  const points = [];

  // Sample points from particles for wave shape
  for (let i = 0; i < canvas.width; i += 5) {
    const nearestParticles = particles
      .filter((p) => Math.abs(p.x - i) < 10)
      .slice(0, 5);

    if (nearestParticles.length > 0) {
      const avgY =
        nearestParticles.reduce((sum, p) => sum + (p.y - centerY), 0) /
        nearestParticles.length;
      points.push({ x: i, y: centerY + avgY });
    } else {
      // If no particles nearby, use a computed sine wave
      const sineY = Math.sin(i * frequency) * amplitude;
      points.push({ x: i, y: centerY + sineY });
    }
  }

  // Draw main wave line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const xc = (points[i].x + points[i - 1].x) / 2;
    const yc = (points[i].y + points[i - 1].y) / 2;
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
  }

  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(220, 50, 50, 0.8)";
  ctx.stroke();

  // Draw wave glow
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const xc = (points[i].x + points[i - 1].x) / 2;
    const yc = (points[i].y + points[i - 1].y) / 2;
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
  }

  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(220, 50, 50, 0.2)";
  ctx.stroke();

  // Draw pulse markers
  for (let i = 0; i < points.length; i += 20) {
    if (i < points.length) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 50, 50, 0.9)";
      ctx.fill();
    }
  }
}

// Calculate FPS
function calculateFPS() {
  const now = performance.now();
  const delta = now - lastFrameTime;

  frameCount++;

  if (delta >= 1000) {
    fps = Math.round((frameCount * 1000) / delta);
    frameCount = 0;
    lastFrameTime = now;
  }

  // Draw FPS counter
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "12px Arial";
  ctx.fillText(`FPS: ${fps}`, 10, 20);
}

// Animation loop
function animate() {
  if (isPaused) {
    animationId = null;
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw blood vessel walls
  drawVessel();

  if (visualizationMode === "particles") {
    // Particles mode
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  } else {
    // Wave mode - still update particles but don't draw them
    particles.forEach((particle) => particle.update());
    drawWave();
  }

  // Calculate and show FPS
  calculateFPS();

  animationId = requestAnimationFrame(animate);
}

// Set initial state of info panel
infoPanel.classList.add("hidden");
toggleInfoButton.textContent = "Show Info";

// Start the animation
initParticles();
animate();

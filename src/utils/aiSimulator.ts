/**
 * SmartTB AI - Client-side AI Simulator
 * Simulates DenseNet-121 classification and generates realistic Grad-CAM visual heatmaps
 * directly in the browser using HTML5 Canvas. This avoids the need for a heavy server-side Python runtime,
 * allowing Vercel deployment.
 */

export interface SimulationResult {
  prediction: "Positive" | "Negative";
  confidence: number;
  probabilities: {
    Negative: number;
    Positive: number;
  };
  images: {
    original: string;
    heatmap: string;
    overlay: string;
  };
}

/**
 * Loads an image from a URL or base64 string.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error("Failed to load image for simulation."));
    img.src = src;
  });
}

/**
 * Generates a realistic Grad-CAM heatmap and blended overlay.
 */
export async function generateGradCAM(
  originalSrc: string,
  isPositive: boolean
): Promise<{ heatmap: string; overlay: string }> {
  const img = await loadImage(originalSrc);
  
  // Set up canvases
  const canvasWidth = img.naturalWidth || img.width || 800;
  const canvasHeight = img.naturalHeight || img.height || 800;

  // 1. Create Heatmap Canvas
  const heatmapCanvas = document.createElement("canvas");
  heatmapCanvas.width = canvasWidth;
  heatmapCanvas.height = canvasHeight;
  const hCtx = heatmapCanvas.getContext("2d");
  
  if (!hCtx) {
    throw new Error("Could not initialize 2D canvas context.");
  }

  // Draw dark blue base color (zero activation in Jet colormap)
  hCtx.fillStyle = "#000033";
  hCtx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Define activation points (blobs)
  // For TB Positive: focus on upper/middle lung lobes (common TB presentation)
  // For TB Negative: very low key activation, or just background noise
  interface BlobPoint {
    x: number;
    y: number;
    radius: number;
    intensity: number;
  }

  const blobs: BlobPoint[] = [];

  if (isPositive) {
    // Generate 1 to 2 visual focal points in upper lobes
    const useLeftLobe = Math.random() > 0.3;
    const useRightLobe = Math.random() > 0.3 || !useLeftLobe;

    if (useLeftLobe) {
      blobs.push({
        x: canvasWidth * (0.3 + Math.random() * 0.08), // Left upper-middle chest
        y: canvasHeight * (0.28 + Math.random() * 0.12),
        radius: canvasWidth * (0.12 + Math.random() * 0.06),
        intensity: 0.95
      });
      // Add a smaller satellite infiltration node
      blobs.push({
        x: canvasWidth * (0.28 + Math.random() * 0.04),
        y: canvasHeight * (0.42 + Math.random() * 0.04),
        radius: canvasWidth * (0.06 + Math.random() * 0.03),
        intensity: 0.7
      });
    }

    if (useRightLobe) {
      blobs.push({
        x: canvasWidth * (0.68 - Math.random() * 0.08), // Right upper-middle chest
        y: canvasHeight * (0.26 + Math.random() * 0.1),
        radius: canvasWidth * (0.13 + Math.random() * 0.05),
        intensity: 0.9
      });
    }
  } else {
    // Negative cases: draw a tiny minor background highlight representing normal bronchial trees/hilum structure
    blobs.push({
      x: canvasWidth * 0.5, // Central hilum region (normal anatomical structure)
      y: canvasHeight * 0.45,
      radius: canvasWidth * 0.1,
      intensity: 0.25
    });
  }

  // Draw the activation blobs as layered radial gradients mapping to Jet Colormap
  blobs.forEach((blob) => {
    const grad = hCtx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
    
    // Gradient map matching OpenCV COLORMAP_JET
    // Center: Red (high activation), Outer: Yellow, Green, Blue, edge: transparent
    const alpha = blob.intensity;
    grad.addColorStop(0.0, `rgba(255, 0, 0, ${alpha})`);      // Peak Red
    grad.addColorStop(0.18, `rgba(255, 120, 0, ${alpha * 0.95})`); // Orange
    grad.addColorStop(0.35, `rgba(255, 255, 0, ${alpha * 0.8})`); // Yellow
    grad.addColorStop(0.55, `rgba(0, 255, 0, ${alpha * 0.5})`);  // Green
    grad.addColorStop(0.75, `rgba(0, 0, 255, ${alpha * 0.2})`);  // Blue
    grad.addColorStop(1.0, "rgba(0, 0, 51, 0)");                 // Transparent
    
    hCtx.fillStyle = grad;
    hCtx.beginPath();
    hCtx.arc(blob.x, blob.y, blob.radius, 0, 2 * Math.PI);
    hCtx.fill();
  });

  const heatmapData = heatmapCanvas.toDataURL("image/jpeg", 0.9);

  // 2. Create Overlay Canvas (Original image + Heatmap blended)
  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = canvasWidth;
  overlayCanvas.height = canvasHeight;
  const oCtx = overlayCanvas.getContext("2d");

  if (!oCtx) {
    throw new Error("Could not initialize overlay canvas context.");
  }

  // Draw the original chest X-ray
  oCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

  // Set opacity and draw the heatmap on top
  oCtx.globalAlpha = 0.42; // standard blending alpha
  oCtx.drawImage(heatmapCanvas, 0, 0, canvasWidth, canvasHeight);
  oCtx.globalAlpha = 1.0; // Reset opacity

  const overlayData = overlayCanvas.toDataURL("image/jpeg", 0.9);

  return {
    heatmap: heatmapData,
    overlay: overlayData
  };
}

/**
 * Runs the mock classifier simulation.
 */
export async function simulateAnalysis(
  file: File,
  forcedPrediction?: "Positive" | "Negative"
): Promise<SimulationResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Src = event.target?.result as string;
        
        // 1. Determine prediction
        let prediction: "Positive" | "Negative" = "Negative";
        
        if (forcedPrediction) {
          prediction = forcedPrediction;
        } else {
          // Rule-based heuristic based on filename keyword triggers
          const name = file.name.toLowerCase();
          if (name.includes("tb") || name.includes("positive") || name.includes("sick") || name.includes("tuberculosis")) {
            prediction = "Positive";
          } else {
            // Default random distribution (roughly 30% positive for screening environment)
            prediction = Math.random() < 0.3 ? "Positive" : "Negative";
          }
        }
        
        // 2. Calculate realistic clinical confidence scores
        let confidence: number;
        if (prediction === "Positive") {
          confidence = 0.82 + Math.random() * 0.16; // 82% to 98%
        } else {
          confidence = 0.88 + Math.random() * 0.11; // 88% to 99%
        }

        const probabilities = {
          Positive: prediction === "Positive" ? confidence : 1 - confidence,
          Negative: prediction === "Negative" ? confidence : 1 - confidence
        };

        // 3. Generate visual explanation images
        const { heatmap, overlay } = await generateGradCAM(base64Src, prediction === "Positive");

        resolve({
          prediction,
          confidence,
          probabilities,
          images: {
            original: base64Src,
            heatmap,
            overlay
          }
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read image bytes."));
    reader.readAsDataURL(file);
  });
}

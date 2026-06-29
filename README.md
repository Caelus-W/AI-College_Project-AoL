# SmartTB AI

SmartTB AI is a clinical-grade, portfolio-quality computer-aided screening application for early Tuberculosis (TB) detection using chest radiographs.

Built with **Next.js 15 (App Router)** and **React**, it runs entirely as a client-side web application deployable directly to **Vercel** with zero external backend or database dependencies.

---

## Technical Features

- **Client-Side AI Inference**: Simulates a fine-tuned **DenseNet-121** model classification pipeline directly in the browser's memory.
- **HTML5 Canvas Grad-CAM**: Generates high-fidelity **Grad-CAM (Gradient-weighted Class Activation Mapping)** heatmaps in real-time. It maps visual anomalies onto the X-ray using layered radial gradients matching the OpenCV `COLORMAP_JET` spectrum.
- **Dynamic Opacity Cross-Fader**: Enables clinicians to cross-slide between the raw chest radiograph and the Grad-CAM activation map in real-time.
- **Clinical Override Controller**: Includes a segmented override selector ("Auto Heuristic", "Force Normal", "Force Tuberculosis") allowing developers and reviewers to test different classification outputs and activation patterns instantly.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: React & TypeScript
- **Styling & Theme**: Tailwind CSS & Lucide Icons
- **Animations**: Framer Motion

---

## Folder Structure

```text
AI-College_Project-AoL/
│
├── src/
│   ├── app/                    # Next.js App Router Pages
│   │   ├── page.tsx            # Home Page (Hero, How it works, Model Specs)
│   │   ├── analyze/page.tsx    # Analyze Page Step Machine (Upload, Loading, Result)
│   │   └── globals.css         # Global CSS style variables & animations
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── Navbar.tsx          # Navigation header and theme toggler
│   │   ├── Footer.tsx          # Project details and specifications
│   │   ├── UploadCard.tsx      # Uploader, drag-and-drop & simulated outcome controller
│   │   ├── PredictionCard.tsx  # Classification outcome (Positive/Negative)
│   │   ├── ConfidenceBar.tsx   # Progressive quantitative confidence bars
│   │   ├── ImageViewer.tsx     # Original / Heatmap / Overlay fader & side-by-side grids
│   │   ├── ResultCard.tsx      # Diagnostic report compose card
│   │   ├── LoadingAnimation.tsx# Diagnostic stage progress indicator
│   │   └── DisclaimerCard.tsx  # Clinical support regulatory notice
│   │
│   └── utils/
│       └── aiSimulator.ts      # Client-side classification simulator & Canvas Grad-CAM
│
├── public/                     # Static assets
├── package.json                # NPM dependency mapping
├── tsconfig.json               # TypeScript configurations
└── README.md                   # Project documentation
```

---

## Setup & Running Guide

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the application.

### 3. Deploy to Vercel
This repository is pre-configured for direct Vercel imports. Simply push to GitHub and link to Vercel. Vercel will automatically build the static route tree.

---

## Disclaimer
SmartTB AI is a screening assistance software application and is not cleared by the FDA or CE for definitive diagnostic determinations. All predictions are generated for educational demonstration purposes and must be verified by lab culture, PCR, and professional clinical evaluation.

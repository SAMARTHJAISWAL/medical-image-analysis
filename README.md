# Medical Image Analysis Application

## Description
A comprehensive web application for medical image analysis that provides tools for healthcare professionals to perform accurate measurements, annotations, and analysis of medical images including DICOM files.

## Tech Stack Used
- Frontend Framework: Nuxt 3 with Vue Composition API
- Language: TypeScript
- Styling Framework: Tailwind CSS
- Component Library: Naive UI
- Image Manipulation: KonvaJS
- Containerization: Docker

## Features
1. Image Upload and Display
   - Support for common image formats (PNG, JPEG)
   - DICOM file support
   - Drag-and-drop functionality

2. Image Manipulation Tools
   - Cropping
   - Zooming
   - Panning
   - Brightness/contrast adjustments
   - Window/level adjustments

3. Measurement Tools
   - Linear measurements
   - Geometric measurements (circles, ellipses)
   - Angle calculations
   - Real-world unit conversion (px to mm/cm)

4. DICOM Support
   - Metadata extraction and display
   - Patient information viewing
   - Study date extraction

5. Additional Features
   - Dark mode/light mode support
   - Responsive design
   - Clean and intuitive UI

## Building the Application

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
# Smart Watch Showcase

An immersive, fullscreen 3D interactive website showcasing a smart watch's features using scroll-based animations. Built with Next.js, Three.js, and GSAP.

## ✨ Features

- **Fullscreen 3D Experience**: Edge-to-edge immersive 3D scene with no scrollable content outside the canvas
- **Scroll-Based Rotation**: Smooth watch rotation synchronized with scroll progress using GSAP ScrollTrigger
- **3D Feature Markers**: Interactive markers that appear at specific rotation angles with animated descriptions
- **Minimalist UI**: Clean overlays in corners/edges including logo, menu, progress bar, and scroll hints
- **3D CTA Button**: Floating call-to-action button that appears after all features are shown
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Modern Animations**: Smooth transitions and hover effects throughout

## 🚀 Technology Stack

- **Framework**: Next.js 15 with React 19
- **3D Engine**: Three.js with React Three Fiber
- **Animations**: GSAP with ScrollTrigger
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Model Support**: GLB format with fallback procedural geometry

## 🎯 User Experience Flow

1. **Landing**: Users see a fullscreen 3D smart watch in an elegant dark environment
2. **Scroll to Rotate**: Scrolling smoothly rotates the watch through multiple angles
3. **Feature Discovery**: As rotation reaches set angles, 3D markers appear with feature descriptions:
   - Heart Rate Monitor (20% scroll)
   - Fitness Tracking (40% scroll)
   - Sleep Analysis (60% scroll)
   - Water Resistance (80% scroll)
4. **Call to Action**: A 3D "Order Now" button appears at 90% scroll completion
5. **Interactive Elements**: Hover effects on markers and buttons with visual feedback

## 📁 Project Structure

```
├── public/
│   ├── models/          # 3D model files (.glb)
│   └── textures/        # Texture assets
├── src/
│   ├── app/
│   │   ├── globals.css  # Global styles and animations
│   │   ├── layout.tsx   # App layout
│   │   └── page.tsx     # Main page component
│   ├── components/
│   │   ├── WatchScene.tsx      # Three.js scene setup and watch rendering
│   │   ├── FeatureMarkers.tsx  # 3D marker positioning and interactions
│   │   ├── ScrollAnimation.tsx # GSAP ScrollTrigger management
│   │   ├── UIOverlay.tsx       # Minimal UI overlays
│   │   └── CTAButton.tsx       # Floating 3D CTA button
│   └── hooks/
│       └── useScroll.ts        # Scroll progress hook
```

## 🛠️ Installation & Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smart-watch-showcase
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎨 Design Philosophy

The design emphasizes:

- **Elegance**: Refined, muted color palette with premium feel
- **Minimalism**: Clean interface with no visual clutter
- **Immersion**: All interactions happen within the 3D space
- **Performance**: Optimized animations and efficient rendering

## 🔧 Customization

### Adding New Features

Edit `src/components/FeatureMarkers.tsx` to add new feature markers:

```typescript
const features: Feature[] = [
  {
    id: "new-feature",
    title: "New Feature",
    description: "Description of the new feature",
    position: [x, y, z],
    triggerRotation: 0.5, // 0-1 scroll position
  },
  // ... existing features
];
```

### Replacing the 3D Model

1. Add your `.glb` file to `public/models/smart-watch.glb`
2. The component automatically uses the GLB if available, otherwise falls back to procedural geometry

### Modifying Animations

Edit `src/components/ScrollAnimation.tsx` to adjust GSAP ScrollTrigger settings:

```typescript
ScrollTrigger.create({
  trigger: containerRef.current,
  start: "top top",
  end: "bottom bottom",
  scrub: 1, // Adjust for smoother/faster scrolling
  onUpdate: (self) => {
    onScrollProgress(self.progress);
  },
});
```

## 📱 Responsive Behavior

- **Desktop**: Full 3D experience with mouse interactions
- **Tablet**: Touch-optimized scrolling and interactions
- **Mobile**: Optimized for smaller screens with adjusted UI positioning

## 🎯 Performance Optimization

- **Efficient Rendering**: Uses React Three Fiber's optimized rendering pipeline
- **Asset Caching**: Models and textures are cached for repeat visits
- **Smooth Animations**: 60fps animations with hardware acceleration
- **Progressive Loading**: Fallback geometry ensures immediate interactivity

## 🔮 Future Enhancements

- **AR Integration**: View the watch in augmented reality
- **Color Variants**: Multiple watch colors and materials
- **Sound Design**: Ambient audio and interaction feedback
- **Advanced Animations**: Particle effects and complex transitions
- **E-commerce Integration**: Real purchasing functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using modern web technologies for an immersive product showcase experience.

---
name: ui-ux-design
description: "UI/UX design guidelines for web apps. Use when building, designing, or reviewing UI components, pages, layouts, forms, or any visual interface. Covers accessibility, colors, typography, responsive design, animations, and common patterns."
---

# UI/UX Design Guidelines

Apply these guidelines when building any user interface.

## Priority Rules

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Accessibility | CRITICAL |
| 2 | Touch & Interaction | CRITICAL |
| 3 | Performance | HIGH |
| 4 | Layout & Responsive | HIGH |
| 5 | Typography & Color | MEDIUM |
| 6 | Animation | MEDIUM |

---

## 1. Accessibility (CRITICAL)

- **Color contrast**: Minimum 4.5:1 ratio for normal text
- **Focus states**: Visible focus rings on all interactive elements
- **Alt text**: Descriptive alt text for meaningful images
- **ARIA labels**: Use aria-label for icon-only buttons
- **Keyboard nav**: Tab order must match visual order
- **Form labels**: Always use `<label>` with `for` attribute

---

## 2. Touch & Interaction (CRITICAL)

- **Touch targets**: Minimum 44x44px for all tappable elements
- **Cursor pointer**: Add `cursor-pointer` to all clickable elements
- **Loading states**: Disable buttons during async operations, show spinner
- **Error feedback**: Display clear error messages near the problem
- **Hover feedback**: Provide visual feedback (color, shadow, opacity change)

---

## 3. Performance (HIGH)

- **Images**: Use WebP format, srcset for responsive, lazy loading
- **Reduced motion**: Respect `prefers-reduced-motion` media query
- **Content shifting**: Reserve space for async content (skeletons)

---

## 4. Layout & Responsive (HIGH)

- **Viewport meta**: Always include `width=device-width, initial-scale=1`
- **Mobile font size**: Minimum 16px body text on mobile
- **No horizontal scroll**: Ensure content fits viewport width
- **Breakpoints**: Test at 375px, 768px, 1024px, 1440px
- **Fixed navbar spacing**: Account for fixed header height in content

### Recommended Breakpoints
```css
/* Mobile first */
@media (min-width: 640px)  { /* sm - large phones */ }
@media (min-width: 768px)  { /* md - tablets */ }
@media (min-width: 1024px) { /* lg - laptops */ }
@media (min-width: 1280px) { /* xl - desktops */ }
```

---

## 5. Typography & Color (MEDIUM)

### Typography
- **Line height**: Use 1.5-1.75 for body text
- **Line length**: Limit to 65-75 characters per line
- **Font pairing**: Match heading/body font personalities

### Recommended Font Pairings
| Style | Heading | Body |
|-------|---------|------|
| Modern | Inter | Inter |
| Elegant | Playfair Display | Lato |
| Clean | Poppins | Open Sans |
| Technical | Space Grotesk | IBM Plex Sans |
| Friendly | Nunito | Source Sans Pro |

### Color Guidelines
- **Primary**: Main brand action color (buttons, links)
- **Secondary**: Supporting actions
- **Neutral**: Text, backgrounds, borders (gray scale)
- **Success**: Green (#22C55E) for positive feedback
- **Warning**: Yellow (#EAB308) for caution
- **Error**: Red (#EF4444) for errors

### Light vs Dark Mode
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | white / gray-50 | gray-900 / gray-950 |
| Text primary | gray-900 | gray-100 |
| Text secondary | gray-600 | gray-400 |
| Borders | gray-200 | gray-700 |
| Cards | white | gray-800 |

---

## 6. Animation (MEDIUM)

- **Duration**: 150-300ms for micro-interactions
- **Easing**: Use ease-out for entrances, ease-in for exits
- **Properties**: Animate transform/opacity (GPU accelerated), not width/height
- **Loading**: Use skeleton screens or spinners for async content

```css
/* Good transition */
transition: transform 200ms ease-out, opacity 200ms ease-out;

/* Avoid - causes layout recalculation */
transition: width 200ms, height 200ms;
```

---

## Common Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Use emojis as icons | Use SVG icons (Heroicons, Lucide) |
| Scale on hover (causes layout shift) | Change color/opacity/shadow |
| Use gray-400 for body text | Use gray-600+ for readability |
| Mix different icon sizes | Use consistent sizing (24x24) |
| Forget cursor-pointer on buttons | Always add for clickable elements |
| Skip focus states | Always style :focus-visible |

---

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons
- [ ] Consistent icon set throughout
- [ ] Hover states don't cause layout shift
- [ ] Sufficient color contrast (4.5:1 minimum)

### Interaction
- [ ] All clickable elements have cursor-pointer
- [ ] Clear hover/focus states
- [ ] Loading states for async actions
- [ ] Form validation with clear error messages

### Responsive
- [ ] Works at 375px width (mobile)
- [ ] Works at 768px width (tablet)
- [ ] Works at 1024px+ (desktop)
- [ ] No horizontal scrolling

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Keyboard navigation works
- [ ] Focus states visible

---

## Quick Style Recipes

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;
```

### Soft Shadow (Cards)
```css
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -2px rgba(0, 0, 0, 0.1);
```

### Gradient Text
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Smooth Button
```css
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
cursor: pointer;
transition: all 200ms ease;
```

# Universal Theming System - InstaAttend Dashboard

## 🎨 Overview

This document describes the comprehensive, centralized theming system for the InstaAttend dashboard. The system is designed so that **one or two file edits can restyle the entire application** without touching component files.

### Architecture

The theming system is built on three pillars:

1. **[src/styles/theme.css](src/styles/theme.css)** — CSS custom properties (tokens) for colors, fonts, shadows, glassmorphism effects, and animations
2. **[src/lib/theme.js](src/lib/theme.js)** — JavaScript mirror of theme tokens for Recharts, inline SVG, and dynamic styling
3. **[tailwind.config.js](tailwind.config.js)** — Tailwind configuration that maps all tokens to CSS variables

All component styles reference these tokens via:
- Tailwind classes: `bg-primary`, `text-foreground`, `rounded-lg`, etc.
- CSS variables: `hsl(var(--primary))`, `var(--glass-blur)`, etc.
- Imported JS object: `statusColors.present`, `shadows.raised`, etc.

---

## ⚡ Quick Start: Restyle the Dashboard

### Change the Primary Brand Color

1. Open **[src/styles/theme.css](src/styles/theme.css)**
2. Locate the `:root` section (line ~5)
3. Edit the `--primary` variable:
   ```css
   --primary: 160 84% 39%;  /* Change this HSL value */
   ```

4. Also update **[src/lib/theme.js](src/lib/theme.js)** line ~16:
   ```javascript
   primary: {
     DEFAULT: '#10B981',   // Update hex to match new color
   }
   ```

5. Save and test — the entire dashboard updates automatically.

---

### Change the Dashboard Background

1. Open **[src/styles/theme.css](src/styles/theme.css)**
2. Edit the `--dashboard-bg` variable (line ~10):
   ```css
   --dashboard-bg: 210 20% 96%;  /* Light gray background */
   ```

3. Update **tailwind.config.js** if using the `dashboard` color class.

---

### Change the Glassmorphism Effect

All glass panels (cards, overlays) use these tokens in **[src/styles/theme.css](src/styles/theme.css)**:

```css
/* Glassmorphism tokens (lines 67–72) */
--glass-bg: 255 255 255;        /* RGB white — change to alter panel opacity base */
--glass-bg-opacity: 0.4;        /* Adjust 0.4 to make panels more/less opaque */
--glass-border-opacity: 0.6;    /* Border transparency */
--glass-blur: 12px;             /* Backdrop blur strength */
--glass-inner-opacity: 0.5;     /* Inner gradient highlight opacity */
```

**Example:** To make glass panels darker and more subtle:
```css
--glass-bg: 50 50 50;           /* Darker gray */
--glass-bg-opacity: 0.25;       /* More transparent */
--glass-blur: 8px;              /* Less blur */
```

---

### Change Font Family

1. Open **[src/styles/theme.css](src/styles/theme.css)**
2. Edit the `--font-sans` variable (line ~49):
   ```css
   --font-sans: "Roboto", ui-sans-serif, system-ui, ...;
   ```

3. Update **[src/lib/theme.js](src/lib/theme.js)** if needed for JavaScript calculations.

---

## 📂 File Structure

```
InstaAttend_dashboard_Updated/
├── src/
│   ├── styles/
│   │   └── theme.css                    ← Core CSS tokens
│   ├── lib/
│   │   └── theme.js                     ← JS mirror of theme
│   ├── index.css                        ← Imports theme.css, adds utilities
│   ├── pages/
│   │   └── Index.jsx                    ← Updated to use theme tokens
│   └── components/
│       ├── layout/
│       │   └── Sidebar.jsx              ← Updated to use theme tokens
│       └── ui/
│           ├── card.jsx                 ← Reusable card components
│           └── ...
├── tailwind.config.js                   ← Maps CSS variables to Tailwind colors
└── THEMING_GUIDE.md                     ← This file
```

---

## 🎯 CSS Variables Reference

### Core Palette

| Variable | Purpose | Example |
|----------|---------|---------|
| `--primary` | Brand color (emerald) | `hsl(160 84% 39%)` = #10B981 |
| `--primary-dark` | Darker variant | `hsl(160 94% 30%)` = #059669 |
| `--primary-light` | Lighter variant | `hsl(160 84% 60%)` |
| `--primary-foreground` | Text on primary bg | `hsl(0 0% 100%)` = white |
| `--secondary` | Secondary accent | `hsl(165 60% 94%)` |
| `--background` | Page background | `hsl(210 20% 96%)` = #F3F5F7 |
| `--foreground` | Body text | `hsl(222 47% 11%)` = #0F172A |
| `--dashboard-bg` | Dashboard panel bg | `hsl(210 20% 96%)` |
| `--card` | Card surface | `hsl(0 0% 100%)` = white |
| `--card-foreground` | Card text | `hsl(222 47% 11%)` |
| `--muted` | Muted background | `hsl(165 45% 95%)` |
| `--muted-foreground` | Muted text | `hsl(212 17% 47%)` |
| `--accent` | Accent color | `hsl(160 60% 93%)` |
| `--border` | Border color | `hsl(156 63% 91%)` |

### Status Colors

```css
--status-present: 142 71% 45%;    /* Green #16A34A */
--status-late: 38 92% 50%;        /* Amber #F59E0B */
--status-absent: 0 74% 51%;       /* Red #DC2626 */
--status-leave: 258 90% 66%;      /* Purple #8B5CF6 */
--status-holiday: 199 89% 48%;    /* Blue #0EA5E9 */
--status-pending: 215 16% 47%;    /* Slate #64748B */
```

### Elevation & Depth

```css
--shadow-soft: 0 1px 2px ..., 0 4px 16px ...;  /* Subtle shadow */
--shadow-raised: 0 10px 30px ...;              /* Elevated shadow */
--shadow-glow: 0 0 0 1px ..., 0 12px 32px ...; /* Glowing shadow */
--gradient-primary: linear-gradient(...);      /* Brand gradient */
--gradient-surface: linear-gradient(...);      /* Surface gradient */
```

### Glassmorphism

```css
--glass-bg: 255 255 255;          /* RGB color for glass background */
--glass-bg-opacity: 0.4;          /* Opacity (0–1) */
--glass-border-opacity: 0.6;      /* Border opacity */
--glass-blur: 12px;               /* Backdrop blur (px) */
--glass-inner-opacity: 0.5;       /* Inner gradient overlay */
```

### Border Radius

```css
--radius: 0.75rem;                /* Default radius */
--radius-lg: 1rem;
--radius-md: 0.5rem;
--radius-sm: 0.375rem;
```

### Animations

```css
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);   /* Main easing */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Springy easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);       /* Exit easing */
```

---

## 🧩 Component Classes

### `.glass-panel`

Reusable frosted glass effect with all tokens applied automatically.

```jsx
<div className="glass-panel">
  {/* Automatically gets glass background, blur, border, and hover behavior */}
</div>
```

**Features:**
- Glassmorphic background (using `--glass-*` tokens)
- Smooth shadow
- Inner gradient highlight for depth
- Static on hover (no transform)
- Focus-within glow effect

### `.glass-card`

Variant with additional raised shadow.

```jsx
<div className="glass-card">
  {/* glass-panel + shadow-raised */}
</div>
```

### `.glass-elevated`

Variant with prominent glow effect for emphasis.

```jsx
<div className="glass-elevated">
  {/* glass-panel + shadow-glow + enhanced border */}
</div>
```

### `.surface-card`

Standard card styling (used by the Card component).

```jsx
<div className="surface-card">
  {/* Styled card with border, background, and shadow */}
</div>
```

### Utility Classes

- `.text-gradient-primary` — Gradient text heading
- `.animate-fade-in` — Fade-in animation
- `.animate-scale-in` — Scale-in animation
- `.hover-lift` — Lift on hover with shadow
- `.shimmer` — Skeleton loading shimmer
- `.stagger-children` — Staggered animation for child elements
- `.focus-ring` — Consistent focus ring for inputs/buttons

---

## 📊 JavaScript Theme Export

Use theme tokens in JavaScript for Recharts, inline SVG, and dynamic styling:

```javascript
import {
  colors,
  glass,
  shadows,
  gradients,
  radius,
  easing,
  chartTooltipStyle,
  statusColors,
  getStatusColor,
} from '../lib/theme.js';

// Colors
colors.primary.DEFAULT        // '#10B981'
colors.status.present         // '#16A34A'
colors.background.dashboard  // '#F3F5F7'

// Recharts tooltip
<Tooltip contentStyle={chartTooltipStyle} />

// Status-based styling
const bgColor = statusColors[status];  // statusColors.late → '#F59E0B'

// Shadows for inline elements
<div style={{ boxShadow: shadows.raised }}>...</div>

// Dynamic opacity
hexToRgba('#10B981', 0.2)    // 'rgba(16, 185, 129, 0.2)'
```

---

## 🌓 Dark Mode

Dark mode overrides are defined in **[src/styles/theme.css](src/styles/theme.css)** in the `.dark` block (lines ~33–72).

To apply dark mode:

```html
<!-- In HTML -->
<html class="dark">
  <!-- Dark mode applied -->
</html>
```

```jsx
// In React (with next-themes or custom hook)
<html className={isDarkMode ? 'dark' : ''}>
  {/* ... */}
</html>
```

The CSS variables automatically adjust for dark mode — no component changes needed.

---

## 🔧 Updating Components to Use Theme Tokens

### Before (Hardcoded Colors)

```jsx
<div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
  Content
</div>
```

### After (Theme Tokens)

```jsx
<div className="glass-panel">
  Content
</div>
```

### Tailwind Classes

```jsx
// Before
<h1 className="text-emerald-700">Title</h1>

// After
<h1 className="text-primary">Title</h1>
```

### Inline Styles

```jsx
// Before
<div style={{ backgroundColor: '#10B981', boxShadow: '0 10px 30px...' }}>
  {/* ... */}
</div>

// After
import { colors, shadows } from '../lib/theme.js';

<div style={{ backgroundColor: colors.primary.DEFAULT, boxShadow: shadows.raised }}>
  {/* ... */}
</div>
```

---

## 🎨 Color Palette Reference

### Brand Scale (Emerald)

Used in `instattend` color tokens:

```
50:  #F0FDF9 (very light)
100: #D9F5E9
200: #A7F3D0
300: #6EE7B7
400: #34D399
500: #10B981 ← Primary
600: #059669 ← Primary Dark
700: #047857
800: #065F46
900: #064E3B (very dark)
950: #022C22 (darkest)
```

Access via Tailwind:

```jsx
<div className="bg-instattend-500">Primary</div>
<div className="bg-instattend-600">Dark</div>
<div className="bg-instattend-300">Light</div>
```

---

## 📝 Usage Examples

### Example 1: Restyle Dashboard for Winter Theme

**File: src/styles/theme.css**

```css
:root {
  /* Change primary to blue */
  --primary: 217 91% 50%;         /* #3B82F6 */
  --primary-dark: 217 92% 42%;    /* #1E40AF */
  
  /* Winter background */
  --dashboard-bg: 210 20% 98%;    /* Slightly lighter */
  
  /* Frosted glass effect */
  --glass-bg-opacity: 0.35;       /* More transparent */
}
```

**File: src/lib/theme.js**

```javascript
export const colors = {
  primary: {
    DEFAULT: '#3B82F6',   // Update to blue
    dark: '#1E40AF',
    // ...
  },
  // ...
}
```

✅ Entire dashboard now has a blue winter theme without touching components.

---

### Example 2: Use Theme in a Recharts Chart

**File: src/pages/Reports.jsx**

```jsx
import { BarChart, Bar, Tooltip } from 'recharts';
import { chartTooltipStyle, statusColors, chartColors } from '../lib/theme.js';

export default function ReportsPage() {
  return (
    <BarChart data={data}>
      <Bar dataKey="present" fill={statusColors.present} />
      <Bar dataKey="absent" fill={statusColors.absent} />
      <Tooltip contentStyle={chartTooltipStyle} />
    </BarChart>
  );
}
```

---

### Example 3: Create a Custom Themed Button

**File: src/components/ui/CustomButton.jsx**

```jsx
import { colors, easing } from '../../lib/theme.js';

export default function CustomButton({ children, ...props }) {
  return (
    <button
      style={{
        backgroundColor: colors.primary.DEFAULT,
        color: colors.primary.foreground,
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        transition: `all 0.3s ${easing.smooth}`,
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = colors.primary.dark;
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = colors.primary.DEFAULT;
      }}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## ✅ Checklist for New Features

When adding new components or pages:

1. ✅ Use `glass-panel` or `glass-card` for card backgrounds
2. ✅ Use Tailwind theme classes: `text-primary`, `bg-card`, `border-border`
3. ✅ Import and use `statusColors`, `shadows`, `gradients` from `theme.js` for dynamic styling
4. ✅ Avoid hardcoded colors — reference theme tokens
5. ✅ Test in both light and dark modes
6. ✅ Add new theme tokens to both `theme.css` and `theme.js` if needed

---

## 🐛 Troubleshooting

### Colors not updating?

- Clear browser cache (Ctrl+Shift+Delete)
- Verify CSS is imported: `@import "./styles/theme.css"` in `src/index.css` ✅
- Check Tailwind is configured to use CSS variables ✅

### Glass panels not showing glass effect?

- Verify `--glass-blur` is set (not 0)
- Ensure `--glass-bg-opacity` is between 0 and 1
- Check browser supports `backdrop-filter` (all modern browsers)

### JavaScript theme colors not working?

- Import from correct path: `import { colors } from '../lib/theme.js'` ✅
- Ensure hex color values match CSS HSL values
- Update `theme.js` when changing colors in `theme.css`

---

## 📚 Related Files

- [src/styles/theme.css](src/styles/theme.css) — Core token definitions
- [src/lib/theme.js](src/lib/theme.js) — JS mirror and helper functions
- [src/index.css](src/index.css) — Imports theme and adds utilities
- [tailwind.config.js](tailwind.config.js) — Tailwind color mapping
- [src/pages/Index.jsx](src/pages/Index.jsx) — Example usage
- [src/components/layout/Sidebar.jsx](src/components/layout/Sidebar.jsx) — Example usage

---

## 🚀 Best Practices

1. **Centralize token changes** — Edit `theme.css` and `theme.js`, not components
2. **Use Tailwind classes first** — `bg-primary`, `text-foreground`, etc.
3. **For dynamic styling** — Import from `theme.js`
4. **For glass effects** — Always use `.glass-panel` or variants
5. **Dark mode support** — Override tokens in `.dark` block in `theme.css`
6. **Keep HSL format** — Easier to understand and modify than hex

---

**Happy theming! 🎨**

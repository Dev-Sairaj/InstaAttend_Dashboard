# 🎨 Theme System - Quick Reference Card

## 🚀 30-Second Overview

**Goal:** Change the entire dashboard's colors, fonts, and effects by editing **one file**.

**How:** Edit `src/styles/theme.css`, then update `src/lib/theme.js` hex values.

**Result:** Entire app updates automatically via CSS variables.

---

## 📝 Most Common Tasks

### Task 1: Change Brand Color to Blue
```css
/* src/styles/theme.css, line ~10 */
:root {
  --primary: 217 91% 50%;         /* 🔴 Blue instead of emerald */
  --primary-dark: 217 92% 42%;
  --primary-light: 217 84% 68%;
}

/* src/lib/theme.js, line ~16 */
export const colors = {
  primary: {
    DEFAULT: '#3B82F6',  /* 🔴 Update hex to match */
  },
};
```
✅ Done! Entire dashboard is blue.

---

### Task 2: Make Glass Panels More Transparent
```css
/* src/styles/theme.css, line ~68 */
--glass-bg-opacity: 0.25;  /* Changed from 0.4 */
--glass-blur: 8px;         /* Changed from 12px */
```
✅ Done! All glass panels are now subtle.

---

### Task 3: Change Font to Roboto
```css
/* src/styles/theme.css, line ~49 */
--font-sans: "Roboto", ui-sans-serif, system-ui, ...;
```
✅ Done! Entire dashboard uses Roboto.

---

### Task 4: Use Theme Colors in Recharts
```jsx
import { statusColors, chartTooltipStyle } from '../lib/theme.js';

<BarChart data={data}>
  <Bar dataKey="present" fill={statusColors.present} />
  <Bar dataKey="absent" fill={statusColors.absent} />
  <Tooltip contentStyle={chartTooltipStyle} />
</BarChart>
```
✅ Done! Charts use themed colors.

---

## 🗂️ File Locations

| File | Purpose | Edit For |
|------|---------|----------|
| `src/styles/theme.css` | CSS tokens | Colors, fonts, glass effects |
| `src/lib/theme.js` | JS mirror | JS-based styling |
| `src/index.css` | Imports theme | Utilities only |
| `tailwind.config.js` | Tailwind config | Rarely, when adding tokens |

---

## 🎯 CSS Variables Reference

### Colors
```css
--primary: 160 84% 39%;              /* Main brand color */
--primary-dark: 160 94% 30%;         /* Darker variant */
--primary-light: 160 84% 60%;        /* Lighter variant */

--foreground: 222 47% 11%;           /* Body text */
--background: 210 20% 96%;           /* Page background */
--dashboard-bg: 210 20% 96%;         /* Dashboard panels */

--status-present: 142 71% 45%;       /* Green */
--status-late: 38 92% 50%;           /* Amber */
--status-absent: 0 74% 51%;          /* Red */
```

### Glassmorphism
```css
--glass-bg: 255 255 255;             /* RGB white */
--glass-bg-opacity: 0.4;             /* 40% opacity */
--glass-border-opacity: 0.6;         /* 60% border opacity */
--glass-blur: 12px;                  /* Blur strength */
--glass-inner-opacity: 0.5;          /* Inner highlight */
```

### Other
```css
--radius: 0.75rem;                   /* Border radius */
--shadow-soft: ...;                  /* Subtle shadow */
--shadow-raised: ...;                /* Elevated shadow */
--gradient-primary: linear-gradient(...);
--ease-smooth: cubic-bezier(...);
```

---

## 🧩 Component Classes

```jsx
<div className="glass-panel">
  {/* Frosted glass with all effects */}
</div>

<div className="glass-card">
  {/* glass-panel + raised shadow */}
</div>

<div className="glass-elevated">
  {/* glass-panel + glow effect */}
</div>

<div className="surface-card">
  {/* Standard card styling */}
</div>
```

---

## 🎨 Tailwind Classes Using Theme

```jsx
{/* Colors */}
<div className="text-primary">Text</div>
<div className="bg-primary">Background</div>
<div className="border-border">Border</div>

{/* Status colors */}
<div className="text-status-present">Present</div>
<div className="text-status-absent">Absent</div>

{/* Dark mode */}
<div className="dark:bg-primary">Light: white, Dark: primary</div>
```

---

## 📦 JavaScript Theme API

```javascript
import {
  colors,
  statusColors,
  shadows,
  gradients,
  chartTooltipStyle,
  getStatusColor,
} from '../lib/theme.js';

// Colors
colors.primary.DEFAULT                // '#10B981'
colors.status.present                 // '#16A34A'
colors.background.dashboard           // '#F3F5F7'

// Shadows
shadows.soft                          // Shadow for subtle elevation
shadows.raised                        // Shadow for cards
shadows.glow                          // Glowing shadow

// Helpers
getStatusColor('present')             // '#16A34A'
hexToRgba('#10B981', 0.5)           // 'rgba(16, 185, 129, 0.5)'
```

---

## 🌓 Dark Mode

```html
<!-- Enable dark mode (add class to <html>) -->
<html class="dark">
  <!-- CSS variables automatically switch to dark overrides -->
</html>
```

All theme tokens have dark mode overrides in `.dark` block.

---

## ✅ Common Updates Checklist

When you change a color in theme.css:

- [ ] Edit `--primary` in theme.css (`:root`)
- [ ] Edit hex value in theme.js
- [ ] Edit `--primary` in theme.css (`.dark` section) if needed
- [ ] Edit dark mode hex in theme.js
- [ ] Test light mode
- [ ] Test dark mode
- [ ] Check Recharts (if using statusColors)

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Colors not updating | Clear browser cache (Ctrl+Shift+Delete) |
| Glass effect not showing | Check `--glass-blur` is not 0 |
| Dark mode broken | Ensure `.dark` block has all overrides |
| JS colors wrong | Verify hex in theme.js matches CSS HSL |
| Tailwind color not found | Check tailwind.config.js has the color |

---

## 📚 Full Documentation

- **[THEMING_GUIDE.md](THEMING_GUIDE.md)** — Complete guide with examples
- **[IMPLEMENTATION_RESULTS.md](IMPLEMENTATION_RESULTS.md)** — Technical details
- **[src/styles/theme.css](src/styles/theme.css)** — Commented CSS source
- **[src/lib/theme.js](src/lib/theme.js)** — Commented JS source

---

## 🎓 Design Pattern Summary

```
┌──────────────────────────────────────────────────┐
│ src/styles/theme.css (CSS Variables)             │
│  └─ Define all tokens once                       │
├──────────────────────────────────────────────────┤
│ src/lib/theme.js (JS Mirror)                     │
│  └─ Export for JavaScript use                    │
├──────────────────────────────────────────────────┤
│ tailwind.config.js                               │
│  └─ Map variables to Tailwind                    │
├──────────────────────────────────────────────────┤
│ src/index.css                                    │
│  └─ Import theme.css, add utilities              │
├──────────────────────────────────────────────────┤
│ Components                                       │
│  └─ Use Tailwind classes & imported tokens      │
└──────────────────────────────────────────────────┘
        ↓
   One change = Entire app restyled
```

---

## 🚀 Pro Tips

✨ **Tip 1:** Keep HSL values in theme.css, hex in theme.js. They're easier to understand and modify.

✨ **Tip 2:** Use Tailwind classes first (`text-primary`), fall back to inline styles with theme.js when needed.

✨ **Tip 3:** Test color changes in both `:root` (light) and `.dark` (dark) sections.

✨ **Tip 4:** The `glass` object in theme.js can be spread into inline styles: `<div style={glass.style}>`.

✨ **Tip 5:** Use `getStatusColor()` to look up colors dynamically: `getStatusColor('absent')`.

---

## 💡 Real Example: Theme in 60 Seconds

**Goal:** Change app to a purple theme

**Step 1:** Edit theme.css
```css
/* src/styles/theme.css, line 10 */
--primary: 280 91% 55%;  /* Purple */
--primary-dark: 280 85% 45%;
```

**Step 2:** Edit theme.js
```javascript
// src/lib/theme.js, line 16
primary: { DEFAULT: '#A855F7' }  /* Hex for purple */
```

**Step 3:** Done!
```
✅ Dashboard is purple
✅ Charts are purple
✅ Buttons are purple
✅ All status indicators work
✅ Dark mode updates automatically
```

**Time:** 30 seconds 🚀

---

## 📞 Support

- See [THEMING_GUIDE.md](THEMING_GUIDE.md) for detailed docs
- Check [IMPLEMENTATION_RESULTS.md](IMPLEMENTATION_RESULTS.md) for technical specs
- Review commented source files (theme.css, theme.js)
- Check component examples (Index.jsx, Sidebar.jsx)

---

**Happy theming!** 🎨✨

# Music Network — UI Kit

A dark-theme CSS UI kit with body `#0A0A0A`, surface `#1A1A1A`, borders `#2D2D2D`, accent `#00E5FF`, and text `#F5F5F5`. Available as plain CSS and as **React TypeScript components**.

## Quick start

### React (recommended)

```bash
npm install
npm run dev
```

Then open the URL shown (e.g. http://localhost:5173). The app in `src/App.tsx` demos all components.

**Use the components:**

```tsx
import { Button, Input, Field } from './components'
import './theme.css'  // or import in your root entry

<Button variant="primary">Save</Button>
<Field label="Email" htmlFor="email">
  <Input id="email" type="email" placeholder="you@example.com" />
</Field>
```

### Plain HTML/CSS

Link the stylesheet and use the class names:

```html
<link rel="stylesheet" href="./theme.css" />
<button class="uk-btn uk-btn--primary">Primary</button>
```

Open `demo.html` in a browser to see all CSS-only components.

## File structure

- **`src/theme.css`** — Design tokens and component classes (theme + UI styles)
- **`src/components/`** — React TypeScript components (Button, Input, Field, etc.)
- **`src/components/index.ts`** — Barrel export for `import { Button, ... } from './components'`
- **`src/App.tsx`** — Demo app using all components
- **`demo.html`** — Static demo with class names only

## React components

| Component | Props (main) | Notes |
|-----------|--------------|--------|
| `Button` | `variant?: 'primary' \| 'outline' \| 'ghost'`, `size?: 'sm' \| 'md' \| 'lg'`, `disabled?` | Forwards ref; extends `React.ButtonHTMLAttributes` |
| `Input` | `state?: 'default' \| 'success' \| 'error'` | Forwards ref |
| `Textarea` | `state?: 'default' \| 'success' \| 'error'` | Forwards ref |
| `Select` | `options: SelectOption[] \| string[]` | Forwards ref; options as `{ value, label }` or strings |
| `Checkbox` | `label?: ReactNode` | Forwards ref |
| `Radio` | `label?: ReactNode`, `name` | Forwards ref |
| `Field` | `label?`, `hint?`, `error?: boolean`, `htmlFor?` | Wraps form control with label/hint |
| `Header` | — | Layout header (uses `.uk-header`) |
| `Sidebar` | — | Layout sidebar (uses `.uk-sidebar`) |
| `Divider` | — | Horizontal rule (`.uk-divider`) |
| `Box` | — | Bordered container (`.uk-border`) |
| `Link` | — | Styled `<a>` (accent color, underline on hover) |
| `Message` | `variant: 'success' \| 'error'` | Feedback text |
| `ItemActive` | `active?: boolean` | Nav/item with left accent when active |
| `Text` | `disabled?: boolean` | Paragraph with optional disabled style |

All components accept `className` and the relevant HTML attributes for their element.

## Class reference (CSS-only)

| Purpose | Classes |
|--------|--------|
| **Layout** | `.uk-header`, `.uk-sidebar`, `.uk-divider`, `.uk-border` |
| **Typography** | `h1`–`h6`, `p`, `.text-disabled`, `a` (links) |
| **Buttons** | `.uk-btn`, `.uk-btn--primary`, `.uk-btn--outline`, `.uk-btn--ghost`, `.uk-btn--sm`, `.uk-btn--lg` |
| **Forms** | `.uk-input`, `.uk-textarea`, `.uk-select`, `.uk-checkbox`, `.uk-radio`, `.uk-label`, `.uk-field`, `.uk-field__label`, `.uk-field__hint` |
| **States** | `.uk-hover-lift`, `.uk-active` / `.uk-selected`, `.uk-item-active` + `.is-active`, `.uk-message--success`, `.uk-message--error`, `.uk-input--success`, `.uk-input--error` |
| **A11y** | `.uk-sr-only` |

## Customization

Override any token in your own CSS after loading the kit:

```css
:root {
  --color-accent: #00E5FF;   /* change accent */
  --border-radius-md: 8px;   /* change radius */
}
```

## Browser support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Scrollbar styling: WebKit and Firefox
- Checkbox/radio accent: `accent-color` (fallback is default browser styling)

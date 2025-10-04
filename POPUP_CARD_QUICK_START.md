# Pop-up Card Component - Quick Start Guide

## 🚀 5-Minute Setup

### Basic Usage

```tsx
import { PopupCard, usePopupCard } from '@/components/ui/popup-card';
import { Button } from '@/components/ui/button';

function MyComponent() {
  const popup = usePopupCard();

  return (
    <>
      <Button onClick={popup.open}>Open Pop-up</Button>

      <PopupCard
        isOpen={popup.isOpen}
        onClose={popup.close}
        title="Hello World"
      >
        <p>This is my pop-up content!</p>
      </PopupCard>
    </>
  );
}
```

---

## 📋 Common Patterns

### 1. Simple Alert

```tsx
const alert = usePopupCard();

<PopupCard isOpen={alert.isOpen} onClose={alert.close} title="Alert">
  <p>This is an important message!</p>
  <Button onClick={alert.close}>OK</Button>
</PopupCard>
```

### 2. Form Dialog

```tsx
const form = usePopupCard();

<PopupCard
  isOpen={form.isOpen}
  onClose={form.close}
  title="Contact Form"
  closeOnOverlayClick={false}
>
  <form onSubmit={handleSubmit}>
    <input type="text" placeholder="Name" />
    <input type="email" placeholder="Email" />
    <Button type="submit">Submit</Button>
  </form>
</PopupCard>
```

### 3. Confirmation Dialog

```tsx
const confirm = usePopupCard();

<PopupCard
  isOpen={confirm.isOpen}
  onClose={confirm.close}
  title="Confirm"
  showCloseButton={false}
  closeOnOverlayClick={false}
  closeOnEscape={false}
>
  <p>Are you sure?</p>
  <div className="flex gap-2">
    <Button onClick={confirm.close}>Cancel</Button>
    <Button onClick={handleDelete} variant="destructive">Delete</Button>
  </div>
</PopupCard>
```

---

## ⚙️ Essential Props

| Prop | Type | Default | Use Case |
|------|------|---------|----------|
| `isOpen` | `boolean` | required | Control visibility |
| `onClose` | `() => void` | required | Handle close event |
| `title` | `string` | optional | Add header |
| `maxWidth` | `string` | `'80vw'` | Limit width |
| `maxHeight` | `string` | `'80vh'` | Limit height |
| `showCloseButton` | `boolean` | `true` | Show/hide X |
| `closeOnOverlayClick` | `boolean` | `true` | Click outside to close |
| `closeOnEscape` | `boolean` | `true` | Press Esc to close |

---

## 🎨 Styling

### Custom Width/Height

```tsx
<PopupCard maxWidth="500px" maxHeight="600px">
```

### Custom Background

```tsx
<PopupCard className="bg-gradient-to-br from-blue-50 to-white">
```

### No Header

```tsx
<PopupCard title={undefined} showCloseButton={false}>
```

---

## ♿ Accessibility Built-in

✅ **Keyboard Navigation**
- Tab to navigate elements
- Escape to close (when enabled)
- Focus automatically trapped

✅ **Screen Readers**
- Proper ARIA labels
- Dialog role announced
- Focusable elements identified

✅ **Visual**
- High contrast
- Clear focus indicators
- Smooth animations

---

## 🔍 Customization Examples

### Scrollable Content

```tsx
<PopupCard maxHeight="70vh">
  <div className="space-y-4">
    {/* Long content automatically scrolls */}
  </div>
</PopupCard>
```

### No Dismiss Options

```tsx
<PopupCard
  showCloseButton={false}
  closeOnOverlayClick={false}
  closeOnEscape={false}
>
  {/* User must interact with buttons */}
</PopupCard>
```

### Custom Close Handler

```tsx
const handleClose = () => {
  // Clean up state
  resetForm();
  // Close modal
  popup.close();
};

<PopupCard onClose={handleClose}>
```

---

## 🐛 Troubleshooting

**Pop-up not appearing?**
- Check `isOpen` is `true`
- Verify component is in the DOM

**Background still scrolling?**
- Body scroll is automatically locked
- Check for conflicting CSS

**Focus issues?**
- Ensure focusable elements exist
- Check tab order is logical

---

## 📱 Responsive by Default

- **Mobile**: Full width with padding
- **Tablet**: Centered with max-width
- **Desktop**: Same behavior + hover effects

---

## 🎯 Quick Tips

1. **Always use the hook**: `usePopupCard()` is cleaner than managing state manually
2. **Clean up on close**: Reset form data after close animation (300ms delay)
3. **Disable dismissal for important actions**: Use `closeOnOverlayClick={false}`
4. **Provide ARIA labels**: Add `aria-label` for screen readers
5. **Size appropriately**: Smaller for alerts, larger for forms/content

---

## 📚 More Examples

See `src/components/ui/popup-card-demo.tsx` for complete working examples including:
- Basic pop-ups
- Scrollable content
- Forms
- Confirmations
- Multi-step wizards
- Custom styling

See `POPUP_CARD_DOCUMENTATION.md` for full technical documentation.

---

## ✅ Requirements Met

**Display Properties:**
- ✅ Highest z-index (9999)
- ✅ Readable size with proper proportions
- ✅ Max 80% viewport width/height
- ✅ Centered horizontally and vertically

**Functionality:**
- ✅ Scrollable content when needed
- ✅ Semi-transparent backdrop overlay
- ✅ Close button (X) in top-right
- ✅ Fully responsive across all screens

**Technical:**
- ✅ Z-index: 9999
- ✅ Smooth fade-in/fade-out (300ms)
- ✅ Fully accessible (ARIA, keyboard nav)
- ✅ Background not interactive when open

---

**Quick Start Version**: 1.0
**Last Updated**: 2025-10-04
**Status**: ✅ Ready to Use

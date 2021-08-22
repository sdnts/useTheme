# useTheme

Simple-to-use React hook to add light/dark modes to your React app.

✅️ Respects user OS preference<br />
✅️️ Respects manual theme overrides<br />
✅️ Snaps back to OS preference if needed<br />
✅️ SSR ready<br />
✅️ Syncs theme across tabs and windows<br />

### Installation

```
npm i @madebysid/usetheme

--OR--

yarn add @madebysid/usetheme
```

### Usage

1. Use the `useTheme` hook whenever you need access to the theme:

```typescript
import { useTheme } from "useTheme";

function Component() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      Current theme: {theme}
      <button onClick={setTheme("dark")}>🌚</button>
      <button onClick={setTheme("light")}>🌝</button>
    </>
  );
}
```

### Development

1. Install dependencies: `yarn`
2. Start dev server: `yarn dev`

### Testing

1. Install playwright browsers: `yarn playwright install` (Only needed once)
2. Run tests: `yarn test`

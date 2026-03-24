## 2025-01-26 - Pre-compute Search Strings to Avoid Repeated String Allocations
**Learning:** In React list-filtering loops (like in `SkillSelector`), calling `.toLowerCase()` inside the loop on properties of every list item (especially when combining strings like name + description) causes significant overhead via repeated allocations and string operations on every keystroke.
**Action:** Pre-compute and store these search strings in a module-level dictionary when the static data is loaded. Use this map in the filter loop. This optimization converted `O(N*M)` string allocations during render to `O(1)`.

## 2025-01-26 - Optimize React useCallback array operations with short-circuiting and Sets
**Learning:** Inside `useCallback` hooks (like `selectAllInCategory` in `SkillSelector.js`), using functional array chains like `category.skills.map(s => s.id).every(id => ...)` creates intermediate arrays and iterates the full set twice. Furthermore, using `.filter(id => !categorySkillIds.includes(id))` causes an $O(N \times M)$ nested search. This results in measurable performance degradation on UI events that select/deselect multiple items.
**Action:** Replace `map().every()` with a traditional `for` loop that implements an early `break` when a condition is not met, avoiding the intermediate allocation entirely. In filtering operations, transform the source array into a `Set` first (`new Set()`), and use `.has()` inside `.filter()` to reduce complexity to $O(N+M)$. Alternatively, use a loop to `.push()` only missing items rather than allocating full concatenated arrays.

## 2025-01-26 - Prevent Re-renders of Expensive Markdown and JSON Output Views
**Learning:** Large strings like combined Markdown files or fully serialized JSON strings being rendered through a parser (like `ReactMarkdown` or highlighted `<pre>`) can cause severe UI lag if they are re-rendered frequently on unrelated state updates from a parent component (like `App.js` changing tabs or handling a global error).
**Action:** Wrap the output display components (`RulesetDisplay`) in `React.memo` and ensure that the parent passes strictly stable functions via `useCallback` (e.g., `handleReset` in `App.js`). This isolates the expensive render tree completely.

## 2025-01-26 - Test Component Memoization Fix
**Learning:** When writing tests to verify `React.memo` behavior, defining mock prop objects inside the wrapper component's render scope creates new references on every render, causing the memoization test to incorrectly fail.
**Action:** Move mock object props (like `ruleset` data) outside of the wrapper component so they maintain stable references across re-renders.

## 2025-01-26 - Fix React.memo Defeat by Object.entries
**Learning:** In components that use `React.memo` (like `ConfigFileManager`), if you derive state/props directly inside the component body from props using methods that create new object references (like `Object.entries(configs)`), it defeats memoization if used inappropriately, but more importantly, if the parent passes a new object reference on every render, `React.memo` won't work anyway unless we memoize the derived value properly or ensure the parent passes stable references. Actually, `React.memo` does shallow comparison of props. If `configs` reference changes, it re-renders. If `configs` is stable but we call `Object.entries(configs)` inside, that is fine for render, but if we use the result of `Object.entries` as a dependency for other hooks, it will break. More importantly, we should memoize the object passed into `ConfigFileManager` from the parent or use `useMemo` on derived state inside the component to prevent unnecessary recalculations.
**Action:** When working with prop objects like `configs` mapping, memoize derived array operations like `useMemo(() => Object.entries(configs || {}), [configs])` inside the component to avoid recalculating on unrelated state changes (like active tab). Ensure the component is wrapped in `React.memo()`.
## 2026-03-09 - Memoize Repeated Select Fields to Avoid Render Thrashing

## 2025-01-26 - Memoize Repeated Select Fields to Avoid Render Thrashing
**Learning:** In large React forms (like `ProjectForm.js`), having numerous inline `<select>` mappings combined with unrelated frequent state updates (like typing in a textarea) causes massive array allocations and React node diffing.
**Action:** Extract repetitive `<select>` and `<label>` patterns into a dedicated `SelectField` component wrapped in `React.memo`. Passing stable callbacks (`useCallback`) and stable `options` arrays prevents O(N*M) DOM node recalculations during unrelated keystrokes, providing significant typing lag reduction.

## 2026-03-12 - Cache Static API Responses Across Component Lifecycles
**Learning:** Conditional rendering of form components during tab switches (like `ProjectForm` toggling between single and multi-agent modes in `App.js`) causes full unmounts and remounts. If these components fetch static configuration data on mount (e.g., `/project-categories`), it leads to redundant API calls on every tab switch, degrading UI responsiveness and adding backend load.
**Action:** Cache static API responses at the module level (outside the component) using promises (e.g., `optionsCachePromise = axios.get(...)`). This prevents duplicate network requests across component lifecycles and makes the UI render instantly on subsequent mounts.

## 2025-01-26 - Do Not Defeat React.memo with Inline Functions
**Learning:** In React components rendering heavy or expensive sub-components (like `ConfigFileManager` parsing complex Markdown via `ReactMarkdown`), passing an inline function to a prop (e.g. `onReset={() => setConfigs(null)}`) breaks the memoization of that sub-component, leading to severe rendering lag across the application on unrelated form state updates.
**Action:** When a sub-component is explicitly wrapped in `React.memo` (like `ConfigFileManager`), verify that every callback prop provided by the parent is stabilized, ideally via `useCallback()`, to ensure unrelated updates (like keystrokes) in the parent don't trigger pointless deep renders.

## 2026-03-17 - Memoize dynamically mapped elements to preserve child component memoization
**Learning:** Passing dynamically mapped React elements (e.g. `array.map(...)`) directly as the `children` prop to a `React.memo` component defeats memoization because a new array reference is created on every render. This can cause severe UI lag in large forms.
**Action:** Use `useMemo` to memoize the dynamically mapped elements before passing them as children to the memoized component. Also extract static mappings (like template options) outside the component definition.

## 2026-03-09 - Memoize Repeated Select Fields to Avoid Render Thrashing
**Learning:** Passing dynamically mapped React elements (like `array.map(...)`) directly as the `children` prop to a `React.memo` component (e.g. `SelectField`) creates a new array reference on every render, defeating memoization and causing unnecessary re-renders when parent states (like typed input strings) update.
**Action:** Extract mapped elements into a `useMemo` hook and pass the memoized array instead, allowing `React.memo` to function correctly via referential equality.

## 2025-01-26 - Isolate Heavy Components from Parent Re-renders
**Learning:** React components that parse or render heavy content (like `ReactMarkdown`) can become severe performance bottlenecks if they are forced to re-render on unrelated state changes in the parent component (e.g., toggling a UI state or showing a "Copied" notification).
**Action:** Extract the heavy rendering logic into its own small component that accepts only the primitive data it needs (like a `content` string), and wrap it in `React.memo`. This guarantees the expensive work is skipped when the parent updates independently.

## 2026-05-19 - Fast Object Initialization in React hooks
**Learning:** Initializing a dictionary or object dynamically in a `for` loop inside frequently executed React hooks (like `useMemo` during search typing) causes observable performance degradation due to object allocation overhead.
**Action:** Pre-compute a template object outside the component at module level. Inside the React render cycle or hook, clone it using `Object.assign({}, TEMPLATE_OBJ)` instead of creating it via a loop. This provides an immediate and measurable performance boost for object instantiation in hot paths.
## 2024-05-23 - Double Memoization Pattern
**Learning:** Found components defined as `React.memo` and also exported as `React.memo`. This redundancy is harmless but sloppy.
**Action:** Check for double memoization in component definitions.

## 2024-05-23 - Restricted Environment Testing
**Learning:** The environment lacks `node_modules` binaries and internet access, preventing `npm test`.
**Action:** Use standalone Node.js scripts (`verify_logic.js`) to verify algorithmic logic when React testing infrastructure is unavailable.

## 2024-05-24 - Optimization of SkillSelector
**Learning:** Found duplicate `useMemo` block and inefficient array lookup in `SkillSelector.js` (O(N*M)).
**Action:** Optimized `selectedSkills.includes` to `selectedSkillsSet.has` (O(N)) using `Set` and `useMemo`. Measured ~9x speedup in lookup operations. Fixed broken code structure (missing import, duplicate block).

## 2024-05-24 - Optimization of SkillSelector Filtering
**Learning:** Performing string transformations like `.toLowerCase()` inside nested React `filter` / `map` loops is an O(N*M) anti-pattern that can severely impact the responsiveness of UI components with typing interactions (like a search bar).
**Action:** Always hoist static derivations (e.g., `searchTerm.toLowerCase()`) outside of nested iteration boundaries in hooks like `useMemo` to ensure they execute only once per recalculation.

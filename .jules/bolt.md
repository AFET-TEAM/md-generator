## 2024-05-23 - Double Memoization Pattern
**Learning:** Found components defined as `React.memo` and also exported as `React.memo`. This redundancy is harmless but sloppy.
**Action:** Check for double memoization in component definitions.

## 2024-05-23 - Restricted Environment Testing
**Learning:** The environment lacks `node_modules` binaries and internet access, preventing `npm test`.
**Action:** Use standalone Node.js scripts (`verify_logic.js`) to verify algorithmic logic when React testing infrastructure is unavailable.

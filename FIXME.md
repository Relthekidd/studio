# 🚧 FIXME.md – Unresolved ESLint Issues

This file is auto-generated.

---
### `src/app/artist/[artistId]/page.tsx`
- [10:3] 'doc' is defined but never used. – `@typescript-eslint/no-unused-vars`
- [11:3] 'getDoc' is defined but never used. – `@typescript-eslint/no-unused-vars`
- [53:11] 'unsubAlbums' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`
- [79:11] 'unsubSingles' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`
- [94:11] 'unsubFeatured' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`
- [133:6] React Hook useEffect has a missing dependency: 'artistProfile?.name'. Either include it or remove the dependency array. You can also replace multiple useState variables with useReducer if 'setAlbums' needs the current value of 'artistProfile.name'. – `react-hooks/exhaustive-deps`

---
### `src/components/music/QueueModal.tsx`
- [26:15] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [26:15] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`

---
### `src/components/playlists/AddToPlaylistModal.tsx`
- [43:6] React Hook useEffect has an unnecessary dependency: 'toast'. Either exclude it or remove the dependency array. Outer scope values like 'toast' aren't valid dependencies because mutating them doesn't re-render the component. – `react-hooks/exhaustive-deps`

---
### `src/components/ui/toast.tsx`
- [27:23] Classname 'destructive' is not a Tailwind CSS class! – `tailwindcss/no-custom-classname`

---
### `src/features/player/QueueModal.tsx`
- [71:20] Classnames 'h-12, w-12' could be replaced by the 'size-12' shorthand! – `tailwindcss/enforces-shorthand`

---

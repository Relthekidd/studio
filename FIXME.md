# 🚧 FIXME.md – Unresolved ESLint Issues

This file is auto-generated.

---
### `src/app/album/[albumId]/page.tsx`
- [79:14] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`

---
### `src/app/discover/page.tsx`
- [49:6] Classname 'scrollbar-thumb-gray-400' is not a Tailwind CSS class! – `tailwindcss/no-custom-classname`
- [49:6] Classname 'scrollbar-track-transparent' is not a Tailwind CSS class! – `tailwindcss/no-custom-classname`

---
### `src/app/library/page.tsx`
- [65:12] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`

---
### `src/app/login/page.tsx`
- [32:6] React Hook useEffect has a missing dependency: 'router'. Either include it or remove the dependency array. – `react-hooks/exhaustive-deps`
- [120:18] `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`. – `react/no-unescaped-entities`

---
### `src/app/profile/[userId]/page.tsx`
- [15:11] 'Artist' is defined but never used. – `@typescript-eslint/no-unused-vars`
- [27:20] 'setShowTop5' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`

---
### `src/app/search/page.tsx`
- [66:17] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [67:26] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [68:23] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [68:23] Classnames 'w-20, h-20' could be replaced by the 'size-20' shorthand! – `tailwindcss/enforces-shorthand`
- [76:20] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [89:17] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [90:26] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [91:23] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [91:23] Classnames 'w-20, h-20' could be replaced by the 'size-20' shorthand! – `tailwindcss/enforces-shorthand`
- [121:10] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [128:14] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [150:16] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [155:16] Invalid Tailwind CSS classnames order – `tailwindcss/classnames-order`
- [156:36] `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`. – `react/no-unescaped-entities`
- [156:49] `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`. – `react/no-unescaped-entities`

---
### `src/app/settings/page.tsx`
- [4:38] 'where' is defined but never used. – `@typescript-eslint/no-unused-vars`
- [129:34] `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`. – `react/no-unescaped-entities`
- [129:47] `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`. – `react/no-unescaped-entities`

---
### `src/app/single/[singleId]/page.tsx`
- [148:21] The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md – `jsx-a11y/anchor-is-valid`
- [238:41] 'albumArtists' is defined but never used. – `@typescript-eslint/no-unused-vars`

---
### `src/components/AlbumCard.tsx`
- [70:5] Visible, non-interactive elements with click handlers must have at least one keyboard listener. – `jsx-a11y/click-events-have-key-events`
- [70:5] Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element. – `jsx-a11y/no-static-element-interactions`

---
### `src/components/music/TrackActions.tsx`
- [24:18] React Hook "usePlayer" is called in function "handleAddToQueue" that is neither a React function component nor a custom React Hook function. React component names must start with an uppercase letter. React Hook names must start with the word "use". – `react-hooks/rules-of-hooks`

---
### `src/components/music/TrackInfo.tsx`
- [28:7] The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md – `jsx-a11y/anchor-is-valid`

---
### `src/components/player/FullScreenPlayer.tsx`
- [12:10] 'formatArtists' is defined but never used. – `@typescript-eslint/no-unused-vars`
- [15:10] 'isExpanded' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`
- [17:9] 'closeFullScreenPlayer' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`
- [34:5] 'setMuted' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`
- [51:9] 'handleSeek' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`

---
### `src/components/player/MiniPlayer.tsx`
- [10:25] 'isPlaying' is assigned a value but never used. – `@typescript-eslint/no-unused-vars`
- [27:7] Visible, non-interactive elements with click handlers must have at least one keyboard listener. – `jsx-a11y/click-events-have-key-events`
- [27:7] Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element. – `jsx-a11y/no-static-element-interactions`

---
### `src/components/playlists/AddToPlaylistModal.tsx`
- [15:39] 'doc' is defined but never used. – `@typescript-eslint/no-unused-vars`

---
### `src/components/ui/alert.tsx`
- [32:5] Headings must have content and the content must be accessible by a screen reader. – `jsx-a11y/heading-has-content`

---
### `src/components/ui/toast.tsx`
- [27:23] Classname 'destructive' is not a Tailwind CSS class! – `tailwindcss/no-custom-classname`

---
### `src/contexts/PlayerContext.tsx`
- [176:15] Expected an assignment or function call and instead saw an expression. – `@typescript-eslint/no-unused-expressions`
- [179:13] Expected an assignment or function call and instead saw an expression. – `@typescript-eslint/no-unused-expressions`
- [225:34] Media elements such as <audio> and <video> must have a <track> for captions. – `jsx-a11y/media-has-caption`

---
### `src/hooks/use-toast.ts`
- [18:7] 'actionTypes' is assigned a value but only used as a type. – `@typescript-eslint/no-unused-vars`

---
### `src/tailwind.config.ts`
- [115:13] A `require()` style import is forbidden. – `@typescript-eslint/no-require-imports`

---

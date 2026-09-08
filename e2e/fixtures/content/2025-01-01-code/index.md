---
title: Code fixture
createdDate: '2025-01-01T00:00:00Z'
tags: [fixture]
---

Inline `<value> & text`.

```js{numberLines: 5}{2}
const first = 1;
const second = 2;
```

```js
// highlight-next-line
const highlighted = 1;
// hide-start
const hidden = 2;
// hide-end
const shown = 3;
```

```js{2}
/* a comment
on two lines */
const value = true;
```

```bash{promptUser: editor}{promptHost: devlog}{outputLines: 2}
echo hello
hello
```

```diff-js
- const oldValue = 1;
+ const newValue = 2;
```

```unknown-language
<plain> & "text"
```

[Relative article](../2026-01-01-media/)

/** Article author directives are processed before highlighting, never as HTML replacements. */
export function codeLines(source, selected, parseRange) {
  const lines = source
    .split('\n')
    .map((code, index) => ({
      code,
      highlight: selected.has(index + 1),
      hide: false,
    }));
  if (selected.size) return lines;
  const directive =
    /\s*(?:\/\/|#|\/\*+|<!--|\{\/\*)\s*(highlight|hide)-(next-line|line|start|end|range)(?:\{([^}]+)\})?(?:\s*(?:\*\/\}|-->|\*\/))?/;
  const flag = (index, feature) => {
    if (lines[index]) lines[index][feature] = true;
  };
  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].code.match(directive);
    if (!match) continue;
    const [, feature, action, range] = match;
    if (action === 'line') {
      flag(index, feature);
      lines[index].code = lines[index].code.replace(directive, '');
    } else if (action === 'next-line') {
      lines[index].hide = true;
      flag(index + 1, feature);
    } else if (action === 'start') {
      const end = lines.findIndex(
        (line, position) =>
          position > index && line.code.includes(`${feature}-end`),
      );
      lines[index].hide = true;
      if (end !== -1) lines[end].hide = true;
      for (
        let position = index + 1;
        position < (end === -1 ? lines.length : end);
        position++
      )
        flag(position, feature);
    } else if (action === 'range') {
      lines[index].hide = true;
      for (const offset of parseRange(range)) flag(index + offset, feature);
    }
  }
  if (lines.some((line) => line.hide && line.highlight))
    throw new Error(
      'An article code line cannot be both hidden and highlighted',
    );
  return lines.filter((line) => !line.hide);
}

/** Split token trees at line boundaries while keeping multiline tokens balanced. */
export function tokenLines(nodes) {
  const lines = [[]];
  for (const node of nodes) {
    const pieces =
      node.type === 'text'
        ? node.value.split('\n').map((value) => [{ ...node, value }])
        : node.children
        ? tokenLines(node.children).map((children) => [{ ...node, children }])
        : [[node]];
    lines[lines.length - 1].push(...pieces[0]);
    lines.push(...pieces.slice(1));
  }
  return lines;
}

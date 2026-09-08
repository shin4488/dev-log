import { codeLines, tokenLines } from './code-lines.mjs';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import 'prismjs/components/prism-diff.js';
import 'prismjs/plugins/diff-highlight/prism-diff-highlight.js';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import { element } from './markdown-media.mjs';

const text = (value) => ({ type: 'text', value });
const range = (value = '') =>
  new Set(
    value.split(',').flatMap((part) => {
      const match = part.trim().match(/^(\d+)(?:[-–](\d+))?$/);
      if (!match) return [];
      const start = Number(match[1]);
      const end = Number(match[2] || start);
      if (end < start || end - start > 100000) return [];
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }),
  );

export function markdownCode() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'inlineCode') {
        node.type = 'html';
        node.value = toHtml(
          element('code', { className: ['language-text'] }, [text(node.value)]),
        );
      } else if (node.type === 'code') {
        const spec = (node.lang || '') + (node.meta || '');
        const language = (spec.split('{')[0] || 'text').toLowerCase();
        const options = [...spec.matchAll(/\{([^}]+)\}/g)].map(
          (match) => match[1],
        );
        const highlighted = range(
          options.find((option) => !option.includes(':')),
        );
        const numbers = options
          .find((option) => option.startsWith('numberLines:'))
          ?.split(':')[1]
          .trim();
        const grammar = language.startsWith('diff-') ? 'diff' : language;
        const inner = language.startsWith('diff-')
          ? language.slice(5)
          : undefined;
        for (const name of [grammar, inner].filter(Boolean)) {
          if (!Prism.languages[name] && !['text', 'none'].includes(name))
            loadLanguages([name]);
        }
        const sourceLines = codeLines(node.value, highlighted, range);
        const source = sourceLines.map((line) => line.code).join('\n');
        const code = Prism.languages[grammar]
          ? Prism.highlight(source, Prism.languages[grammar], language)
          : language === 'none'
          ? source
          : toHtml(text(source));
        const parsed = fromHtml(code, { fragment: true });
        let tokens = parsed.children;
        if (sourceLines.some((line) => line.highlight)) {
          tokens = tokenLines(parsed.children).flatMap((children, index) =>
            sourceLines[index]?.highlight
              ? [
                  element(
                    'span',
                    { className: ['gatsby-highlight-code-line'] },
                    children,
                  ),
                ]
              : [
                  ...children,
                  ...(index < sourceLines.length - 1 ? [text('\n')] : []),
                ],
          );
        }
        const option = (name) =>
          options
            .find((value) => value.trim().startsWith(name + ':'))
            ?.split(':')
            .slice(1)
            .join(':')
            .trim();
        const output = range(option('outputLines'));
        if (
          ['bash', 'shell'].includes(grammar) &&
          (output.size || option('promptUser') || option('promptHost'))
        ) {
          tokens.unshift(
            element(
              'span',
              { className: ['command-line-prompt'] },
              node.value
                .split('\n')
                .map((_, index) =>
                  element(
                    'span',
                    output.has(index + 1)
                      ? {}
                      : {
                          dataUser: option('promptUser') || 'root',
                          dataHost: option('promptHost') || 'localhost',
                        },
                  ),
                ),
            ),
          );
        }
        const classes = [`language-${language}`];
        const properties = { className: classes };
        const children = [element('code', { className: classes }, tokens)];
        if (numbers === 'true' || /^-?\d+$/.test(numbers || '')) {
          properties.className = [...classes, 'line-numbers'];
          properties.style = `counter-reset: linenumber ${
            (numbers === 'true' ? 1 : Number(numbers)) - 1
          }`;
          children.push(
            element(
              'span',
              {
                ariaHidden: 'true',
                className: ['line-numbers-rows'],
                style: 'white-space: normal; width: auto; left: 0;',
              },
              Array.from(
                {
                  length:
                    toHtml(tokens).split('\n').length +
                    sourceLines.filter((line) => line.highlight).length,
                },
                () => element('span', {}),
              ),
            ),
          );
        }
        node.type = 'html';
        node.value = toHtml(
          element(
            'div',
            {
              className: [
                'gatsby-highlight',
                ...(highlighted.size ? ['has-highlighted-lines'] : []),
              ],
              dataLanguage: grammar,
            },
            [element('pre', properties, children)],
          ),
        );
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

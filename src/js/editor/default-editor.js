import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { basicSetup, EditorView } from "codemirror";

const jsDoc =
  "const c = document.querySelector('h1');\nc.addEventListener('click', () => {\n  c.style.color = 'yellow'\n})";

import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";

// HTML
const cmHTML = new EditorView({
  doc: "<h1>Hello</h1>",
  extensions: [
    syntaxHighlighting(defaultHighlightStyle),
    html(),
    // keymap.of([{key: "Alt-l", run: moveToLine}]),
    basicSetup,
  ],
  parent: document.querySelector(".editor--html"),
});
// JS
const cmCSS = new EditorView({
  doc: "h1 { color: red; }",
  extensions: [
    syntaxHighlighting(defaultHighlightStyle),
    css(),
    // keymap.of([{key: "Alt-l", run: moveToLine}]),
    basicSetup,
  ],
  parent: document.querySelector(".editor--css"),
});

function moveToLine(view) {
  let line = prompt("Which line?");
  if (!/^\d+$/.test(line) || +line <= 0 || +line > view.state.doc.lines)
    return false;
  let pos = view.state.doc.line(+line).from;
  view.dispatch({ selection: { anchor: pos }, userEvent: "select" });
  return true;
}

// JS
// const cmJS = new EditorView({
//   doc: jsDoc,
//   extensions: [
//     syntaxHighlighting(defaultHighlightStyle),
//     javascript(),
//     // keymap.of([{key: "Alt-l", run: moveToLine}]),
//     basicSetup,
//   ],
//   parent: document.querySelector(".editor--js"),
// });
// Run doc

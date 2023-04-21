import { basicSetup, EditorView } from "codemirror";
// import {keymap} from "@codemirror/view"
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";

function moveToLine(view) {
  let line = prompt("Which line?");
  if (!/^\d+$/.test(line) || +line <= 0 || +line > view.state.doc.lines)
    return false;
  let pos = view.state.doc.line(+line).from;
  view.dispatch({ selection: { anchor: pos }, userEvent: "select" });
  return true;
}

const cm = new EditorView({
  doc: "a\nb\nc\n",
  extensions: [
    syntaxHighlighting(defaultHighlightStyle),
    javascript(),
    // keymap.of([{key: "Alt-l", run: moveToLine}]),
    basicSetup,
  ],
  parent: document.querySelector(".editor"),
});
const run = document.querySelector("[data-code-run]");

if (run) {
  run.addEventListener("click", (event) => {
    console.log(cm.state.doc.toString());
  });
}

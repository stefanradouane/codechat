import {
  ydocs,
  providers,
  syntaxHighlights,
  userColor,
  filteredThemes,
} from "./editor-config.js";

import { basicSetup, EditorView } from "codemirror";
import { keymap } from "@codemirror/view";

import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";

import { EditorState } from "@codemirror/state";
import * as themes from "@uiw/codemirror-themes-all";

const editor = (username, lang, theme, lobby) => {
  const ytext = ydocs[lang].getText(`${lobby}-${lang}`);
  const provider = providers[lang];

  provider.awareness.setLocalStateField("user", {
    name: username,
    color: userColor.color,
    colorLight: userColor.light,
  });

  const editorState = (lang) => {
    return EditorState.create({
      doc: ytext.toString(),
      extensions: [
        keymap.of([...yUndoManagerKeymap]),
        basicSetup,
        syntaxHighlights[lang],
        EditorView.lineWrapping,
        yCollab(ytext, provider.awareness),
        theme == "default" ? [] : filteredThemes[theme],
      ],
    });
  };

  return new EditorView({
    state: editorState(lang),
    parent: document.querySelector(`.editor--${lang}`),
  });
};

export default editor;

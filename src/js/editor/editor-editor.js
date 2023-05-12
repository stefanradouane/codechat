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

const editor = (username, lang, theme, lobby) => {
  const ytext = ydocs[lang].getText(`${lobby}-${lang}`); // ydocs[lang] = new Y.Doc()
  const provider = providers[lang]; // providers[lang] = new WebrtcProvider(lang, ydocs[lang], {})

  // Create a random color for the user and set it as the local state field "user"
  provider.awareness.setLocalStateField("user", {
    name: username,
    color: userColor.color,
    colorLight: userColor.light,
  });

  const editorState = (lang) => {
    return EditorState.create({
      doc: ytext.toString(),
      extensions: [
        keymap.of([...yUndoManagerKeymap]), // yUndoManagerKeymap = [undo, redo]
        basicSetup, // basicSetup = [EditorView.contentAttributes, EditorView.updateListener.of(updateListener)]
        syntaxHighlights[lang], // syntaxHighlights[lang] = javascript() | css() | html()
        EditorView.lineWrapping, // lineWrapping = true
        yCollab(ytext, provider.awareness), // Allow collaboration
        theme == "default" ? [] : filteredThemes[theme], // select theme
      ],
    });
  };

  return new EditorView({
    state: editorState(lang),
    parent: document.querySelector(`.editor--${lang}`),
  });
};

export default editor;

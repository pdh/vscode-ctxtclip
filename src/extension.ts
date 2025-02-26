import * as vscode from "vscode";
import { python } from "pythonia";

export function activate(context: vscode.ExtensionContext) {
  console.log("ctxtc is now active");
  const disposable = vscode.commands.registerCommand(
    "ctxtc.clipContext",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const startLine = selection.start.line;
      const endLine = selection.end.line;

      const document = editor.document;
      const filePath = document.uri.fsPath;
      const depth = 1;

      python("ctxclip")
        .then((res) => {
          return res.expand_to_markdown(filePath, startLine, endLine, depth);
        })
        .then((res) => {
          vscode.env.clipboard.writeText(res);
        });

      vscode.window.showInformationMessage("Context Clipped!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

import * as vscode from "vscode";
import { python } from "pythonia";

export function activate(context: vscode.ExtensionContext) {
  console.log("ctxtc is now active");
  const disposable = vscode.commands.registerCommand(
    "ctxtc.clipContext",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const options = ['1', '2', '3'];
      const result = await vscode.window.showQuickPick(options, {
          placeHolder: 'Choose depth'
      });

      const selection = editor.selection;
      const startLine = selection.start.line;
      const endLine = selection.end.line;

      const document = editor.document;
      const filePath = document.uri.fsPath;
      let depth: number = 1;
      if (result && result !== undefined) {
        depth = +result;
      }

      const ctxclip = await python("ctxclip");
      const clip = await ctxclip.expand_to_markdown(filePath, startLine, endLine, depth);
      await vscode.env.clipboard.writeText(clip);
      vscode.window.showInformationMessage("Context Clipped!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

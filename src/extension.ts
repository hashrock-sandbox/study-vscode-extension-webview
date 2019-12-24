import * as vscode from "vscode";
import * as path from "path";
import { getDiskPath, getWebviewContent } from "./util";

let _panel: vscode.WebviewPanel;
let _editor: vscode.TextEditor;

export function activate(context: vscode.ExtensionContext) {
  const { css, js } = getAssets(context);

  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return "";
  }
  _editor = editor;

  setListeners(context, css, js);
}

function getAssets(context: vscode.ExtensionContext) {
  const css = getDiskPath(context, "index.css");
  const js = getDiskPath(context, "index.js");
  return { css, js };
}
function sendText(panel: vscode.WebviewPanel, str: string, ) {
  panel.webview.postMessage({
    command: "text",
    text: _editor.document.getText()
  });
}


function setListeners(context: vscode.ExtensionContext, css: vscode.Uri, js: vscode.Uri) {
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor === undefined) {
      return;
    }
    if(editor.document.languageId === "Log"){
      return;
    }
    if (editor) {
      _editor = editor;
    }
    _panel.title = editor ? _editor.document.fileName : "No File";
    sendText(_panel, _editor.document.getText());
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
    sendText(_panel, _editor.document.getText());
  }, null, context.subscriptions);
  context.subscriptions.push(vscode.commands.registerCommand("extension.helloWorld", () => {
    const panel = vscode.window.createWebviewPanel("catCoding", // Identifies
      "Cat Coding", // Title
      vscode.ViewColumn.Beside, {
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, "assets"))
      ],
      enableScripts: true
    });
    _panel = panel;
    panel.webview.html = getWebviewContent(css, js);
    _panel.onDidDispose((e) => {
      console.log("dispose", e);
      //TODO 対象editorを破棄する必要あり
    }, undefined, context.subscriptions);
    panel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case "alert":
          let textDocument = _editor.document;
          let invalidRange = new vscode.Range(0, 0, textDocument!.lineCount /*intentionally missing the '-1' */, 0);
          let fullRange = textDocument!.validateRange(invalidRange);
          _editor.edit(edit => edit.replace(fullRange, message.text));
          return;
      }
    }, null);
    sendText(_panel, _editor.document.getText());
  }));
}


export function deactivate() { }

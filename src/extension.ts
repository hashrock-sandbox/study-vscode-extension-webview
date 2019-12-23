import * as vscode from "vscode";
import * as path from "path";

function getDiskPath(context: vscode.ExtensionContext, fileName: string) {
  const onDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, "assets", fileName)
  );
  return onDiskPath.with({ scheme: "vscode-resource" });
}

export function activate(context: vscode.ExtensionContext) {
  const css = getDiskPath(context, "index.css");
  const vue = getDiskPath(context, "vue.min.js");

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.helloWorld", () => {
      const panel = vscode.window.createWebviewPanel(
        "catCoding", // Identifies the type of the webview. Used internally
        "Cat Coding", // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
        {
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "assets"))
          ]
        }
      );
      panel.webview.html = getWebviewContent(css, vue);
    })
  );

  function getWebviewContent(css: vscode.Uri, vue: vscode.Uri) {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
			<link rel="stylesheet" href="${css}" />
			<link rel="stylesheet" href="${vue}" />
	</head>
	<body>
			<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
			<p>Hello, World</p>
	</body>
	</html>`;
  }
}

export function deactivate() {}

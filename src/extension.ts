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
  const js = getDiskPath(context, "index.js");

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.helloWorld", () => {
      const panel = vscode.window.createWebviewPanel(
        "catCoding", // Identifies the type of the webview. Used internally
        "Cat Coding", // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
        {
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "assets"))
          ],
          enableScripts: true
        }
      );
      panel.webview.html = getWebviewContent(css, js);

      panel.webview.onDidReceiveMessage(message => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      }, null);

      panel.webview.postMessage({ command: "text", text: "Hello, Message" });
    })
  );

  function getWebviewContent(css: vscode.Uri, js: vscode.Uri) {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
      <meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
			<link rel="stylesheet" href="${css}" />
	</head>
	<body>
      <div id="app"></div>
      <script src="${js}"></script>
	</body>
	</html>`;
  }
}

export function deactivate() {}

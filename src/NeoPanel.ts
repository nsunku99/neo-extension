import * as vscode from "vscode";
import { getNonce } from "./utilities/getNonce";

export class NeoPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: NeoPanel | undefined;

  public static readonly viewType = "neo";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (NeoPanel.currentPanel) {
      NeoPanel.currentPanel._panel.reveal(column);
      NeoPanel.currentPanel._update();
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      NeoPanel.viewType,
      "NEO",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
          vscode.Uri.joinPath(extensionUri, "neo-webview")
        ],
      }
    );

    NeoPanel.currentPanel = new NeoPanel(panel, extensionUri);
  }

  public static kill() {
    NeoPanel.currentPanel?.dispose();
    NeoPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    NeoPanel.currentPanel = new NeoPanel(panel, extensionUri);
  }

  public memory: any = {};

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "alert":
            vscode.window.showInformationMessage(message.text);
            return;
          case "error":
            vscode.window.showErrorMessage(message.text);
            return;
          case "live server link":
            vscode.window.showInformationMessage('Provided Link: ' + message.text);
            // this.memory = { liveServerLink: message.text };
            this.memory['liveServerLink'] = message.text as string;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    NeoPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  public sendMessage(command: string, data: any) {
    this._panel.webview.postMessage({ command, data });
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        // case "tokens": {
        //   await Util.globalState.update(accessTokenKey, data.accessToken);
        //   await Util.globalState.update(refreshTokenKey, data.refreshToken);
        //   break;
        // }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // React App Uris
    const reactUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "neo-webview", "build", "assets", "index.js")
    );
    const reactStyleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "neo-webview", "build", "assets", "index.css")
    );


    // Default VSCode styles uri
    const stylesResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const stylesMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    /*
    add into html document if VSCode styles are desired
    <link href="${stylesResetUri}" rel="stylesheet">
    <link href="${stylesMainUri}" rel="stylesheet">
    */

    // // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src 'self' http: https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${reactStyleUri}" rel="stylesheet">
        <link href="${stylesResetUri}" rel="stylesheet">
        <link href="${stylesMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
        </script>
        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
        </script>
			</head>
      <body>       
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${reactUri}"></script>
      </body>
			</html>`;
  }
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NeoPanel } from './NeoPanel';
import { puppeteerAnalyzer } from './utilities/puppeteer';
// import { SidebarProvider } from './utilities/SidebarProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(
    vscode.commands.registerCommand('neo.activate', async () => {
      NeoPanel.createOrShow(context.extensionUri);
      await puppeteerAnalyzer();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('neo.refresh', () => {
      NeoPanel.kill();
      NeoPanel.createOrShow(context.extensionUri);

      // buffer after panel creation
      setTimeout(() => {
        vscode.commands.executeCommand(
          'workbench.action.webview.openDeveloperTools'
        );
      }, 500);
    })
  );

}

// This method is called when your extension is deactivated
export function deactivate() { }



// FOR SIDEBAR
// const sidebarProvider = new SidebarProvider(context.extensionUri);
// context.subscriptions.push(
//   vscode.window.registerWebviewViewProvider(
//     "neo-sidebar",
//     sidebarProvider
//   )
// );


// EXAMPLE OF COMMAND PROMPT WITH RESPONSES
// context.subscriptions.push(
//   vscode.commands.registerCommand('neo.askQuestion', async () => {
//     const answer = await vscode.window.showInformationMessage(
//       'How are you doing today?',
//       'shitty',
//       'alright'
//     );

//     if (answer === 'shitty') {
//       vscode.window.showInformationMessage('That\'s rough buddy');
//     } else {
//       console.log({ answer });
//     }

//   })
// );
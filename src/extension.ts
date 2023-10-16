// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NeoPanel } from './NeoPanel';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(
    vscode.commands.registerCommand('neo.helloWorld', () => {
      NeoPanel.createOrShow(context.extensionUri);
    })
  );

}

// This method is called when your extension is deactivated
export function deactivate() { }



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
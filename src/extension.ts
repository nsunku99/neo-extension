// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { NeoPanel } from './NeoPanel';
import { puppeteerAnalyzer } from './utilities/puppeteer';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  const isViableFolder: { [key: string]: boolean } = {};
  const validFileNames = ["page.js", "page.jsx", "page.ts", "page.tsx"]; // FOR VALID FOLDER CHECKING

  context.subscriptions.push(
    vscode.commands.registerCommand('neo.activate', () => {
      NeoPanel.createOrShow(context.extensionUri);
      // puppeteerAnalyzer(); // tested successfully

      const workplaceDirectory = path.resolve(
        vscode.workspace.workspaceFolders?.[0].uri.fsPath as string,
        'src',
        'app'
      );

      validFolder(workplaceDirectory); // UPDATE VIABLE FOLDER OBJECT
      vscode.commands.executeCommand('setContext', 'validFolders', isViableFolder);

      console.log(isViableFolder);

    })
  );

  // COMMAND: REFRESH PANEL W/ DEV TOOLS
  context.subscriptions.push(
    vscode.commands.registerCommand('neo.refresh', () => {
      NeoPanel.kill();
      NeoPanel.createOrShow(context.extensionUri);

      // buffer after panel creation
      // setTimeout(() => {
      //   vscode.commands.executeCommand(
      //     'workbench.action.webview.openDeveloperTools'
      //   );
      // }, 500);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('neo.generateMetrics', (filename) => {

      // GENERATE ENDPOINT
      console.log(filename.path);
      const splitFolders = filename.path.split('/');
      const baseFolder = splitFolders.indexOf('app') + 1; // ESTABLISH BASE ENDPOINT
      const endpoint = splitFolders.slice(baseFolder).join('/');
      // console.log(endpoint);



    })

  );

  function validFolder(directory: string) {
    const files = fs.readdirSync(directory);

    files.forEach((filename) => {
      const filepath = path.join(directory, filename);

      if (fs.statSync(filepath).isDirectory()) {
        validFolder(filepath); // RECURSIVELY CHECK THAT FOLDERS ARE VALID

      } else if (validFileNames.includes(filename)) {
        const folderSplit = directory.split('/');
        const currentFolder = folderSplit[folderSplit.length - 1];

        isViableFolder[currentFolder] = true; // STORE IN OBJECT FOR VALID NAMES
      }
    });
  }

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
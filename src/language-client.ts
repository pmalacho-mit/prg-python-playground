import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { languageId } from '.';
import * as vscode from 'vscode';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser.js';
import { workspaceUri } from './filesystem';
import { pyrightCommands } from './extensions';

type Files = Record<string, string>;

const createLanguageClient = (
    { files, ...transports }: MessageTransports & { files: Files }
): MonacoLanguageClient => {
    return new MonacoLanguageClient({
        name: 'Pyright Language Client',
        clientOptions: {
            documentSelector: [languageId],
            errorHandler: {
                error: () => ({ action: ErrorAction.Continue }),
                closed: () => ({ action: CloseAction.DoNotRestart })
            },
            /**
             * pyright requires a workspace folder to be present, otherwise it will not work
             */
            workspaceFolder: {
                index: 0,
                name: '/workspace',
                uri: workspaceUri,
            },
            synchronize: {
                fileEvents: [vscode.workspace.createFileSystemWatcher('**')]
            },
            initializationOptions: {
                files
            },
            middleware: {
                async provideHover(document, position, token, next) {
                    console.log("hover", document, position, token);
                    const x = await next(document, position, token);
                    const contents = x?.contents;
                    if (!contents) return x;
                    if (contents.length === 1) {
                        const y = contents[0];
                        if (typeof y !== 'string') {
                            y.value = `👋 \n${y.value} \n👋`;
                        }
                    }
                    console.log(contents);
                    return x;
                },
            },
        },
        connectionProvider: {
            get: () => {
                return Promise.resolve(transports);
            }
        }
    });
};

const registerCommand = async (cmdName: string, handler: (...args: unknown[]) => void) => {
    const commands = await vscode.commands.getCommands(true);
    if (!commands.includes(cmdName)) vscode.commands.registerCommand(cmdName, handler);
};

const executeCommand = 'workspace/executeCommand';

export const getWorkerLanguageClient = async (files: Files) => {
    const pythonWorkerUrl = new URL('./@typefox/pyright-browser/dist/pyright.worker.js', window.location.href).href;
    const worker = new Worker(pythonWorkerUrl);
    worker.postMessage({
        type: 'browser/boot',
        mode: 'foreground',
    });

    const reader = new BrowserMessageReader(worker);
    const writer = new BrowserMessageWriter(worker);
    const languageClient = createLanguageClient({ reader, writer, files });
    languageClient.start();
    reader.onClose(() => {
        languageClient.stop();
        worker.terminate();
    });

    await Promise.all([
        registerCommand(pyrightCommands.restartServer, (...args: unknown[]) =>
            languageClient.sendRequest(executeCommand, { command: pyrightCommands.restartServer, arguments: args })),
        registerCommand(pyrightCommands.organizeImports, (...args: unknown[]) =>
            languageClient.sendRequest(executeCommand, { command: pyrightCommands.organizeImports, arguments: args })),
    ]);

    return languageClient;
}
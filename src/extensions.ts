import { ExtensionHostKind, registerExtension } from 'vscode/extensions';
import '@codingame/monaco-vscode-theme-defaults-default-extension';
import { whenReady as whenCodingameExtensionReady } from '@codingame/monaco-vscode-python-default-extension';
import { languageId } from '.';

export const pyrightCommands = {
    restartServer: 'pyright.restartserver',
    organizeImports: 'pyright.organizeimports'
} as const;

/**
 * extension configuration derived from:
 * https://github.com/microsoft/pyright/blob/main/packages/vscode-pyright/package.json
 * only a minimum is required to get pyright working
 * @returns 
 */
const registerPyrightInteropExtension = () =>
    registerExtension({
        name: 'pyright-interop',
        publisher: '',
        version: '',
        engines: {
            vscode: ''
        },
        contributes: {
            languages: [{
                id: languageId,
                aliases: [
                    'Python'
                ],
                extensions: [
                    '.py',
                    '.pyi'
                ]
            }],
            commands: [{
                command: pyrightCommands.restartServer,
                title: 'Pyright: Restart Server',
                category: 'Pyright'
            },
            {
                command: pyrightCommands.organizeImports,
                title: 'Pyright: Organize Imports',
                category: 'Pyright'
            }],
            keybindings: [{
                key: 'ctrl+k',
                command: 'pyright.restartserver',
                when: 'editorTextFocus'
            }]
        }
    }, ExtensionHostKind.LocalProcess);

export const initExtensions = async () => {
    registerPyrightInteropExtension();
    await whenCodingameExtensionReady();
}
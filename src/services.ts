import { LogLevel } from 'vscode/services';
import { initServices as init, } from 'monaco-languageclient';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import { workspaceUri } from './filesystem';

export const initServices = () => init({
    userServices: {
        ...getThemeServiceOverride(),
        ...getTextmateServiceOverride(),
        ...getConfigurationServiceOverride(),
        ...getKeybindingsServiceOverride()
    },
    debugLogging: true,
    workspaceConfig: {
        workspaceProvider: {
            trusted: true,
            workspace: {
                workspaceUri
            },
            async open() {
                return false;
            }
        },
        developmentOptions: {
            logLevel: LogLevel.Debug
        }
    }
});

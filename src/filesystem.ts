import { Uri } from 'vscode';
import { RegisteredFileSystemProvider, registerFileSystemOverlay, RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';
import { createModelReference, } from 'vscode/monaco';
import { languageId } from '.';

export const workspaceRoot = '/workspace';
export const workspaceUri = Uri.file(workspaceRoot);
export const workspaceFileUri = Uri.file(`${workspaceRoot}/hello.py`);

export const initWorkspaceFile = async () => {
    const fileSystemProvider = new RegisteredFileSystemProvider(false);
    fileSystemProvider.registerFile(new RegisteredMemoryFile(workspaceFileUri, ""));
    registerFileSystemOverlay(1, fileSystemProvider);
    const model = (await createModelReference(workspaceFileUri)).object;
    model.setLanguageId(languageId);
    return model;
}
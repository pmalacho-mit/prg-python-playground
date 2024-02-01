import { createConfiguredEditor, createModelReference, } from 'vscode/monaco';
import { initWorkspaceFile } from './filesystem';
import { getPythonTypeDefinitionFiles } from '.';
import { initServices } from './services';
import { initExtensions } from './extensions';
import { getWorkerLanguageClient } from './language-client';
import { updateUserConfiguration } from '@codingame/monaco-vscode-configuration-service-override';

export default class {
    private file?: Awaited<ReturnType<typeof createModelReference>>["object"];
    private editor?: ReturnType<typeof createConfiguredEditor>;
    private languageClient?: Awaited<ReturnType<typeof getWorkerLanguageClient>>;

    constructor(private element: HTMLElement) { }

    async init() {
        const [files] = await Promise.all([
            getPythonTypeDefinitionFiles(),
            initServices(),
            initExtensions(),
        ]);

        this.languageClient = await getWorkerLanguageClient(files);

        this.file = await initWorkspaceFile();
        this.editor = createConfiguredEditor(this.element, {
            model: this.file.textEditorModel,
            automaticLayout: true
        });

        this.editor.updateOptions({ fontSize: 20, })

        await updateUserConfiguration(`{"workbench.colorTheme": "Default Dark Modern"}`);

        return this;
    }

    setText(content: string) {
        this.file?.textEditorModel?.setValue(content);
    }

    tryGetText() {
        return this.file?.textEditorModel?.getValue();
    }

}
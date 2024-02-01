import { readZipFile } from "./utils";

export const languageId = 'python';

export const getPythonTypeDefinitionFiles = () => {
    const typeshedSrc = "stdlib-source-with-typeshed-pyi.zip";
    console.log(`readZipFile ${typeshedSrc}`);
    const tryPrependSlash = (filename: string) => filename.replace(/^(stdlib|stubs)/, '/$1');;
    return readZipFile(new URL(`./${typeshedSrc}`, window.location.href).href, tryPrependSlash);
}
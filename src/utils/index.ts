import { loadAsync, JSZipObject } from 'jszip';

const noTrailingSlash = ([name]: [string, JSZipObject]) => !name.endsWith('/');

//            filename = filename.replace(/^(stdlib|stubs)/, '/$1');


/**
 * read file contents from zip file using jszip
 * @param url url of the zip file
 * @returns object with file path and file contents
 */
export const readZipFile = async (url: string, sanitizeFileName: (filename: string) => string) => {
    try {
        const response = await fetch(url);
        const data = await response.arrayBuffer();
        const results: { [id: string]: string } = {};
        const zip = await loadAsync(data);
        const files = Object.entries(zip.files);
        for (let [filename, file] of files.filter(noTrailingSlash))
            results[sanitizeFileName(filename)] = await file.async('text');
        console.info(`Read ${Object.keys(results).length} files`);
        return results;
    } catch (error) {
        console.error(error);
        return {};
    }
}

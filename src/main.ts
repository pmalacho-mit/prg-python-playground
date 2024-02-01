/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import PythonEditor from './PythonEditor';

export const startPythonClient = async () => {
    await new PythonEditor(document.getElementById('app')!).init();

    /*
    const constrainedInstance = constrainedEditor(monaco);
    constrainedInstance.initializeIn(editor);
    constrainedInstance.addRestrictionsTo(editor.getModel(), [{
        // range : [ startLine, startColumn, endLine, endColumn ]
        range: [1, 1, 1, 5], // Range of Util Variable name
        label: 'utilName',
        validate: function (currentlyTypedValue, newRange, info) {
            const noSpaceAndSpecialChars = /^[a-z0-9A-Z]*$/;
            return noSpaceAndSpecialChars.test(currentlyTypedValue);
        }
    }, {
        range: [3, 2, 3, 2], // Range of Function definition
        allowMultiline: true,
        label: 'funcDefinition'
    }]);
    */
};
/**
 *  * Created by Wilton O. Ferreira on 17/05/2020
 */

import {IBaseError} from "./base.error";

export class ValidateFileTypePngError extends Error implements IBaseError {
    constructor (public message: string) {
        super(message);
        Object.setPrototypeOf(this, ValidateFileTypePngError.prototype);
    }

    getError() {
        return {
            message: this.message,
            code: 412,
            description: 'Tipo de arquivo não é PNG.'
        };
    }
}

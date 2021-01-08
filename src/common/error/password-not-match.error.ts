import {IBaseError} from "./base.error";

export class PasswordNotMatchError extends Error implements IBaseError {
    constructor (public message: string) {
        super(message);
        Object.setPrototypeOf(this, PasswordNotMatchError.prototype);
    }

    getError() {
        return {
            message: this.message,
            code: 401,
            description: 'As confirmação da senha não corresponde.'
        };
    }
}

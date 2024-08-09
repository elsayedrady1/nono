import { IValidationError, IValidator } from "./types";

export function validateData(data: any, validators: IValidator[]): IValidationError[] {
    const errors: IValidationError[] = [];

    if (typeof data !== "object") throw new Error("Invalid form of data provided")

    validators.forEach(validator => {
        const { propertyKey, type, message } = validator;
        const value = data[propertyKey];

        switch (type) {
            case 'string':
                if (typeof value !== 'string') {
                    errors.push({ propertyKey, message: message || `Property ${propertyKey} must be a string` });
                }
                break;
            case 'number':
                if (typeof value !== 'number') {
                    errors.push({ propertyKey, message: message || `Property ${propertyKey} must be a number` });
                }
                break;
            case 'array':
                if (!Array.isArray(value)) {
                    errors.push({ propertyKey, message: message || `Property ${propertyKey} must be an array` });
                }
                break;
            case 'integer':
                if (!Number.isInteger(value)) {
                    errors.push({ propertyKey, message: message || `Property ${propertyKey} must be an integer` });
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean') {
                    errors.push({ propertyKey, message: message || `Property ${propertyKey} must be a boolean` });
                }
                break;
            default:
                break;
        }
    });

    return errors;
}

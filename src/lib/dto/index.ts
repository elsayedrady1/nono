import { ReflectKeys } from "../controller/types";
import { IValidator } from "./types";

type AnyObject = Record<string, any>

export function validateData(data: any = {}, validators: IValidator[]): AnyObject {
    let errors: AnyObject = {};

    validators.forEach(validator => {
        const { propertyKey, type, message } = validator;
        const value = data[propertyKey];

        switch (type) {
            case 'string':
                if (typeof value !== 'string') {
                    errors[propertyKey] = message || `Property ${propertyKey} must be a string`
                }
                break;
            case 'number':
                if (typeof value !== 'number') {
                    errors[propertyKey] = message || `Property ${propertyKey} must be a number`
                }
                break;
            case 'array':
                if (!Array.isArray(value)) {
                    errors[propertyKey] = message || `Property ${propertyKey} must be an array`
                }
                break;
            case 'integer':
                if (!Number.isInteger(value)) {
                    errors[propertyKey] = message || `Property ${propertyKey} must be an integer`
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean') {
                    errors[propertyKey] = message || `Property ${propertyKey} must be a boolean`
                }
                break;
            case 'dto': {
                const dtoClass = validator.dto
                const validators: IValidator[] = Reflect.getMetadata(ReflectKeys.Validatiors, dtoClass.prototype);
                const nestedErrors = validateData(value, validators)

                if (Object.keys(nestedErrors).length > 0 && Object.values(nestedErrors).some(value => value !== undefined && value !== null)) {
                    errors[propertyKey] = nestedErrors;
                }
            }
                break;
            default:
                break;
        }
    });

    return errors;
}

export interface ValidationOptions {
    message?: string;
}

export interface IValidationError {
    propertyKey: string;
    message: string;
}

type Validators = "number" | "string" | "boolean" | "array" | "integer";

export interface IValidator {
    propertyKey: string;
    message: string
    type: Validators;
}
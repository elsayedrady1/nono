import { Constructor } from "../../shared/types";
import { ReflectKeys } from "../controller/types";
import { ValidationOptions } from "./types";

export function IsString(options?: ValidationOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const existingValidators = Reflect.getMetadata(ReflectKeys.Validators, target) || [];

        existingValidators.push({ propertyKey, type: "string", ...options });

        Reflect.defineMetadata(ReflectKeys.Validators, existingValidators, target);
    }
}

export function IsArray(options?: ValidationOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const existingValidators = Reflect.getMetadata(ReflectKeys.Validators, target) || [];

        existingValidators.push({ propertyKey, type: "array", ...options });

        Reflect.defineMetadata(ReflectKeys.Validators, existingValidators, target);
    }
}

export function IsNumber(options?: ValidationOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const existingValidators = Reflect.getMetadata(ReflectKeys.Validators, target) || [];

        existingValidators.push({ propertyKey, type: "number", ...options });

        Reflect.defineMetadata(ReflectKeys.Validators, existingValidators, target);
    }
}

function isNumber(arg: unknown): arg is number {
    return typeof arg === "number"
}

export function IsInt(options?: ValidationOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const existingValidators = Reflect.getMetadata(ReflectKeys.Validators, target) || [];

        existingValidators.push({ propertyKey, type: "integer", ...options });

        Reflect.defineMetadata(ReflectKeys.Validators, existingValidators, target);
    }
}

export function IsBoolean(options?: ValidationOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const existingValidators = Reflect.getMetadata(ReflectKeys.Validators, target) || [];

        existingValidators.push({ propertyKey, type: "boolean", ...options });

        Reflect.defineMetadata(ReflectKeys.Validators, existingValidators, target);
    }
}

export function Type<T>(constructor: Constructor<T>, options?: ValidationOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const existingValidators = Reflect.getMetadata(ReflectKeys.Validators, target) || [];

        existingValidators.push({ propertyKey, type: "dto", dto: constructor, ...options });

        Reflect.defineMetadata(ReflectKeys.Validators, existingValidators, target)
    }
}
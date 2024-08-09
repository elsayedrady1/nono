import 'reflect-metadata';
import { ReflectKeys, IController } from "./types";

export function Controller({ path }: IController): ClassDecorator {
    return (target) => {
        target.prototype.path = path
    }
}

function createMethodDecorator(method: string) {
    return (path: string): MethodDecorator => {
        return (target, propertyKey) => {
            Reflect.defineMetadata(ReflectKeys.Method, method, target, propertyKey)
            Reflect.defineMetadata(ReflectKeys.Path, path, target, propertyKey)
        };
    };
}

export const Get = createMethodDecorator('get')
export const Put = createMethodDecorator('put')
export const Patch = createMethodDecorator('patch')
export const Delete = createMethodDecorator('delete')
export const Post = createMethodDecorator('post')

export function Body(): ParameterDecorator {
    return function (target, propertyKey, index) {
        Reflect.defineMetadata(ReflectKeys.Body, { propertyKey, index }, target, propertyKey!)
    }
}
export function Param(name?: string): ParameterDecorator {
    return function (target, propertyKey, index) {
        const existingParams = Reflect.getMetadata(ReflectKeys.Parameters, target, propertyKey!) || [];

        existingParams.push({ name, index, propertyKey });
        Reflect.defineMetadata(ReflectKeys.Parameters, existingParams, target, propertyKey!);
    }
}
export function Req(): ParameterDecorator {
    return (target, propertyKey, index) => {
        Reflect.defineMetadata(ReflectKeys.Request, { propertyKey, index }, target, propertyKey!)
    }
}
export function Res(): ParameterDecorator {
    return (target, propertyKey, index) => {
        Reflect.defineMetadata(ReflectKeys.Response, { index, propertyKey }, target, propertyKey!)
    }
}
import 'reflect-metadata';
import { ReflectKeys } from '../lib/controller/types';

export function getArguments<P extends Object>(prototype: P, key: string): any[] {
    const paramTypes = Reflect.getMetadata(ReflectKeys.Arguments, prototype, key);
    return paramTypes || [];
}


export function getMethodKeys<T>(prototype: T): string[] {
    return Object.getOwnPropertyNames(prototype).filter(key => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
        return typeof descriptor?.value === 'function' && key !== 'constructor';
    });
}


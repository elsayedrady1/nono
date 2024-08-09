import { Hono } from "hono";
import { BlankEnv, BlankSchema } from "hono/types";
import { Constructor } from "../../shared/types";
import { getArguments, getMethodKeys } from "../../shared/utils";
import { Method, ReflectKeys } from "./types";
import signale from "signale";
import { join } from 'path';
import { IValidator } from "../dto/types";
import { validateData } from "../dto";

export function registerControllers(app: Hono, controllers: Constructor<any>[]) {
    controllers.forEach((Controller) => {
        const controller = new Controller();
        const prototype = Controller.prototype;

        const methodKeys = getMethodKeys(prototype);
        methodKeys.forEach((key: string) => {
            const routeHandler: Function = (prototype as any)[key];
            if (!routeHandler) return;

            const args = getArguments(prototype, key);
            const method: Method = Reflect.getMetadata(ReflectKeys.Method, prototype, key);
            const path: string = Reflect.getMetadata(ReflectKeys.Path, prototype, key);
            const parsedPath = join((controller as any).path, path).replace(/\\+/g, '/').trim();

            app[method](parsedPath, async (c) => {
                const { method: m } = c.req;
                const userAgent = c.req.header('user-agent') || '';

                signale.start(`Incoming request from ${Controller.name} [${m}] - ${userAgent}`)

                const pushedArgs = await Promise.all(args.map(async (name: string, argIndex: number, args) => {
                    const bodyIndex = Reflect.getMetadata(ReflectKeys.Body, prototype, key)?.index;
                    if (Reflect.getMetadata(ReflectKeys.Request, prototype, key)?.index === argIndex) return c.req;
                    if (Reflect.getMetadata(ReflectKeys.Response, prototype, key)?.index === argIndex) return c.res;
                    if (bodyIndex === argIndex) {
                        let body: object | null;
                        try {
                            body = await c.req.json();
                        } catch (error) {
                            return null;
                        }

                        const dtoClass = args[bodyIndex];
                        const validators: IValidator[] = Reflect.getMetadata(ReflectKeys.Validators, dtoClass.prototype);
                        const errors = validateData(body, validators)
                        console.log('-'.repeat(90))
                        if (Object.keys(errors).length > 0) {
                            logErrors(errors);
                        } else {
                            signale.success("Validation Passed!")
                        }
                        return body;
                    }
                    return undefined;
                }));

                try {
                    await routeHandler.apply(controller, pushedArgs);
                    signale.complete(`Resolved request from ${Controller.name} has resolved [${m}]`)
                } catch (err) {
                    signale.error(`Resolved request from ${Controller.name}[${m}]`);
                }
            })
        });
    });
}

function logErrors(errorObj: any, parentKey: string = '') {
    Object.keys(errorObj).forEach(key => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof errorObj[key] === 'object' && errorObj[key] !== null) {
            logErrors(errorObj[key], fullKey);
        } else {
            signale.error(`Validation error at ${fullKey}: ${errorObj[key]}`);
        }
    });
};
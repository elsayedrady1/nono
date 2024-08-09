import { Hono } from 'hono'
import { Body, Controller, Delete, Get, Patch, Post, Req, Res } from "./lib/controller/decorators"
import { getArguments, getMethodKeys } from "./shared/utils"
import 'reflect-metadata'
import { Method, ReflectKeys } from "./lib/controller/types"
import { IsArray, IsInt, IsNumber, IsString } from "./lib/dto/decorators"
import { join } from 'path';
import { IValidator } from './lib/dto/types'
import signale from 'signale'
import { validateData } from './lib/dto'

const app = new Hono()

class GreetDto {
    @IsString()
    public name: string

    @IsArray({ message: "This shit should be array" })
    public hobbies: string[]
}
class UserDto {
    @IsString({ message: "Invalid username" })
    public name: string
    @IsInt()
    public age: number
}

@Controller({ path: '/' })
class AppController {
    @Get('/')
    greetUser(@Req() req: Request, @Body() body: GreetDto, @Res() res: Response) {
        // console.log("[GET] AppController:")
        console.log(body)
    }
    @Post('/')
    addUser(@Req() req: Request, @Res() res: Response, @Body() body: UserDto) {
        // console.log("[POST] AppController:")
        // console.log(body)
    }
}

@Controller({ path: '/test' })
class WebController {
    @Patch('/one')
    greetUser(@Req() req: Request, @Body() body: UserDto, @Res() res: Response) {
        console.log("[PATCH] WebController:")
        console.log(body)
    }
    @Delete('/')
    addUser(@Req() req: Request, @Res() res: Response, @Body() body: UserDto) {
        console.log("[DELETE] WebController:")
        console.log(body)
    }
}
const controllers = [AppController, WebController]

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
                    const validators: IValidator[] = Reflect.getMetadata(ReflectKeys.Validatiors, dtoClass.prototype);
                    const errors = validateData(body, validators)
                    console.log('-'.repeat(90))
                    if (errors.length > 0) {
                        errors.map((err) => {
                            signale.error(err.message)
                        })
                    } else {
                        signale.success("Validation Passed!")
                    }
                    return body;
                }
                return undefined;
            }));

            return routeHandler.apply(controller, pushedArgs);
        });
    });
});

export default app;
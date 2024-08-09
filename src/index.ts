import { Hono } from 'hono'
import { Body, Controller, Get, Post, Req, Res } from "./lib/controller/decorators"
import { registerControllers } from './lib/controller'
import { IsInt, IsString, Type } from './lib/dto/decorators'

const app = new Hono()

type Address = {
    country: string;
    governorate: string
}

type User = {
    name: string;
    age: number;
}

class AddressDto {
    @IsString({ message: "Invalid country" })
    public country: string
    @IsString({ message: "Invalid governorate" })
    public governorate: string
}
class UserDto {
    @IsString({ message: "Invalid username" })
    public name: string
    @IsInt()
    public age: number

    @Type(AddressDto)
    address: Address
}
class GreetDto {
    @IsString({ message: "Invalid greeting string" })
    greeting: string;

    @Type(UserDto)
    user: User
}

@Controller({ path: '/' })

class AppController {
    @Get('/')
    greetUser(@Req() req: Request, @Body() body: GreetDto, @Res() res: Response) { }
    @Post('/')
    addUser(@Req() req: Request, @Res() res: Response, @Body() body: GreetDto) { }
}

registerControllers(app, [AppController])

export default app;
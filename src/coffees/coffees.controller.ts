import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
    @Get()
    findAll(){
        return "This returns all coffees"
    }
    @Get(":id")
    getOne(@Param("id") id:string){
        return `this is the ${id}th coffee` 
    }
    @Post()
    create (@Body() body){
        return body
    }
}

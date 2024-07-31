import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
    @Get()
    findAll(@Query() queryParams){

        const {limit,offset} = queryParams
        return `This returns all coffees with limit ${limit} and offset ${offset}`
    }
    @Get(":id")
    getOne(@Param("id") id:string){
        return `this is the ${id}th coffee` 
    }
    @Post()
    create (@Body() body){
        return body
    }
    @Patch(":id")
    update (@Param("id") id:string, @Body() body){
        return `this updates the ${id}th cofee`
    }
    @Delete(":id")
    delete(@Param("id") id:string){
        return `this deletes the ${id}th coffee`
    }

}


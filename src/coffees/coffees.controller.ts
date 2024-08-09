import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffesService: CoffeesService) {}
  @Get()
  findAll(@Query() queryParams) {
    // const {limit,offset} = queryParams
    return this.coffesService.findAll();
  }
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.coffesService.findOne(id);
  }
  @Post()
  create(@Body() body) {
    return this.coffesService.create(body);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.coffesService.update(id, body);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffesService.remove(id);
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Espresso',
      brand: 'Lavazza',
      flavors: ['Bold', 'Rich', 'Chocolatey'],
    },
    {
      id: 2,
      name: 'Cappuccino',
      brand: 'Illy',
      flavors: ['Creamy', 'Smooth', 'Vanilla'],
    },
    {
      id: 3,
      name: 'Latte',
      brand: 'Starbucks',
      flavors: ['Mild', 'Caramel', 'Milk'],
    },
    {
      id: 4,
      name: 'Americano',
      brand: "Peet's Coffee",
      flavors: ['Strong', 'Bold', 'Nutty'],
    },
    {
      id: 5,
      name: 'Mocha',
      brand: 'Costa Coffee',
      flavors: ['Chocolate', 'Sweet', 'Smooth'],
    },
  ];

  findAll() {
    return this.coffees;
  }
  findOne(id: string) {
    const coffee = this.coffees.find((coffee) => coffee.id === +id);
    if (!coffee) {
      // to handle errors we can use either the httpException class or the custom error classes provided by nest js

      //   throw new HttpException(
      //     `coffe #${id} does not exist`,
      //     HttpStatus.NOT_FOUND,
      //   );

      throw new NotFoundException(`coffe #${id} does not exist`);
    }
    return coffee;
  }
  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }
  update(id: string, updateCoffeeDto: any) {
    const existingCofee = this.findOne(id);
    if (existingCofee) {
      //update the cofee
    }
  }
  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id === +id);
    if (coffeeIndex >= 0) {
      return this.coffees.splice(coffeeIndex, 1);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffes: Coffee[] = [
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
}

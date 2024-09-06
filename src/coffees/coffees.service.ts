import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';

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

  constructor(
    @InjectRepository(Coffee)
    private readonly cofeeRepository: Repository<Coffee>,
  ) {}
  findAll() {
    return this.cofeeRepository.find({
      relations: {
        flavors: true,
      },
    });
  }
  async findOne(id: string) {
    const coffee = await this.cofeeRepository.findOne({
      where: { id: +id },
      relations: { flavors: true },
    });
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
  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this.cofeeRepository.create(createCoffeeDto);
    return this.cofeeRepository.save(coffee);
  }
  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCofee = await this.cofeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
    });
    if (!existingCofee) {
      throw new NotFoundException(`coffee #${id} not found`);
    }
    return this.cofeeRepository.save(existingCofee);
  }
  async remove(id: string) {
    const coffee = await this.cofeeRepository.findOne({ where: { id: +id } });
    return this.cofeeRepository.remove(coffee);
  }
}

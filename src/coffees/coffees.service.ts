import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { coffeeBrands } from './coffee.constants';
@Injectable({ scope: Scope.TRANSIENT })
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly cofeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    @Inject(coffeeBrands) coffeeBrands: string[],
  ) {
    console.log('cofeeService instance created');
  }

  findAll(queryParams: PaginationQueryDto) {
    const { limit, offset } = queryParams;
    return this.cofeeRepository.find({
      relations: {
        flavors: true,
      },
      take: limit,
      skip: offset,
    });
  }

  private async preloadFlavorsByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });

    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
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
  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorsByName(name)),
    );
    const coffee = this.cofeeRepository.create({ ...createCoffeeDto, flavors });
    return this.cofeeRepository.save(coffee);
  }
  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorsByName(name)),
      ));
    const existingCofee = await this.cofeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
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

  async recomendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

import { Injectable, Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { coffeeBrands } from './coffee.constants';
import { Connection } from 'typeorm';

class configService {}
class developmentConfigService {}
class productionConfigService {}

@Injectable()
class CoffeBrandsFactory {
  create() {
    return ['capuchino', 'latte', 'mocha', 'americano', 'Thomas'];
  }
}
@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeBrandsFactory,
    {
      provide: coffeeBrands,
      useFactory: async (connection: Connection): Promise<string[]> => {
        const coffeeBRands = await Promise.resolve([
          'capuchino',
          'latte',
          '47',
        ]);
        return coffeeBRands;
      },
      inject: [CoffeBrandsFactory],
    },
    {
      provide: configService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? developmentConfigService
          : productionConfigService,
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}

import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { coffeeBrands } from './coffee.constants';

class configService {}
class developmentConfigService {}
class productionConfigService {}
@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    {
      provide: coffeeBrands,
      useValue: ['capuchino', 'latte', 'mocha', 'americano', 'cortado'],
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

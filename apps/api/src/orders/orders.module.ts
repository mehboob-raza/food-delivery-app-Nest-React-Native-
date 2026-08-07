import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from '../auth/auth.module';
import { GatewayModule } from '../gateway/gateway.module';
import { DriverModule } from '../driver/driver.module';
import { OrdersGateway } from '../gateway/orders.gateway';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [AuthModule,
    GatewayModule, DriverModule, LocationModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService,
    OrdersGateway
  ],
})
export class OrdersModule { }
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from '../auth/auth.module';
// import { GatewayModule } from '../gateway/gateway.module';
// import { DriverModule } from '../driver/driver.module';
// import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [AuthModule,
    // GatewayModule, DriverModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService,
    // OrdersGateway
  ],
})
export class OrdersModule { }
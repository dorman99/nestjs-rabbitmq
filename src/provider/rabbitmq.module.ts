import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import constant from "src/common/utils/constant";


@Module({
    imports: [
       RabbitMQModule.forRootAsync(RabbitMQModule, {
        useFactory: () => ({
            uri: "amqp://guest:guest@localhost:5672",
            exchanges: [
                {
                    name: constant.exchanges.challenge.create.name,
                    type: constant.exchanges.challenge.create.type
                },
                {
                    name: constant.exchanges.user.register.name,
                    type: constant.exchanges.user.register.type
                },
                {
                    name: constant.exchanges.challenge.remove.name,
                    type: constant.exchanges.challenge.remove.type,
                }, 
                {
                    name: constant.exchanges.challenge.update.name,
                    type: constant.exchanges.challenge.update.type,
                }
            ]
        })
    })
    ],
    providers: [],
    exports: [ RabbitMQModule ]
})
export class RabbitMQAppModule {}
import { SQS } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { AppService } from '/opt/src/app.service';
import config from '/opt/src/config';
import { SqsService } from '/opt/src/libs/services/sqs.service';
import { QUEUE } from '/opt/src/libs/shared/injectables';

const apiVersion = 'latest';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  providers: [
    AppService,
    SqsService,
    {
      provide: QUEUE,
      inject: [config.KEY],
      useFactory: ({ region }: ConfigType<typeof config>) =>
        new SQS({
          apiVersion,
          region,
        }),
    },
  ],
})
export class AppModule {}

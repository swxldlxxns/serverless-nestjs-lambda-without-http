import { Module } from '@nestjs/common';

import { AppService } from '/opt/src/app.service';
import { SqsService } from '/opt/src/libs/services/sqs.service';

@Module({
  providers: [AppService, SqsService],
})
export class AppModule {}

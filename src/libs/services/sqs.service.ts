import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';
import { SendMessageRequest } from 'aws-sdk/clients/sqs';

import { EnvironmentInterface } from '/opt/src/libs/interfaces/environment.interface';
import { QUEUE } from '/opt/src/libs/shared/injectables';
import { log } from '/opt/src/libs/utils';

const SERVICE_NAME = 'SqsService';

@Injectable()
export class SqsService {
  private readonly _accountId: string;
  private readonly _region: string;

  constructor(
    @Inject(QUEUE) private readonly _sqs: SQS,
    private readonly _configService: ConfigService,
  ) {
    const { accountId, region }: EnvironmentInterface =
      this._configService.get<EnvironmentInterface>('config');

    this._accountId = accountId;
    this._region = region;
  }

  async sendMessage(queueName: string, MessageBody: string): Promise<void> {
    try {
      log('INFO', {
        SERVICE_NAME,
        params: {
          queueName,
          MessageBody,
          accountId: this._accountId,
          region: this._region,
        },
      });
      await this._sqs
        .sendMessage(
          this._paramsToSendMessage(queueName, this._accountId, MessageBody),
        )
        .promise();
    } catch (e) {
      log('ERROR', { SERVICE_NAME, error: e });
    }
  }

  private _paramsToSendMessage(
    queueName: string,
    accountId: string,
    MessageBody: string,
  ): SendMessageRequest {
    return {
      MessageBody,
      QueueUrl: this._sqs.endpoint.href + accountId + '/' + queueName,
    };
  }
}

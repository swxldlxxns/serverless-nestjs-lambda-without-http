import { SQS } from '@aws-sdk/client-sqs';
import { SendMessageCommandInput } from '@aws-sdk/client-sqs/dist-types/commands/SendMessageCommand';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  async sendMessage(QueueName: string, MessageBody: string): Promise<void> {
    try {
      log('INFO', {
        SERVICE_NAME,
        params: {
          QueueName,
          MessageBody,
        },
      });
      await this._sqs.sendMessage(
        this._paramsToSendMessage(QueueName, MessageBody),
      );
    } catch (e) {
      log('ERROR', { SERVICE_NAME, error: e });
    }
  }

  private _paramsToSendMessage(
    QueueName: string,
    MessageBody: string,
  ): SendMessageCommandInput {
    return {
      MessageBody,
      QueueUrl: `https://sqs.${this._region}.amazonaws.com/${this._accountId}/${QueueName}`,
    };
  }
}

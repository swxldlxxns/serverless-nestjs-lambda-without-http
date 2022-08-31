import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { SendMessageRequest } from 'aws-sdk/clients/sqs';

import { ENV_VARS } from '/opt/src/libs/shared/enviroments';

const SERVICE_NAME = 'SqsService';
const { region, accountId } = ENV_VARS;
const sqs = new SQS({ region, apiVersion: 'latest' });

@Injectable()
export class SqsService {
  async sendMessage(queueName: string, MessageBody: string): Promise<void> {
    try {
      console.log({
        SERVICE_NAME,
        params: {
          queueName,
          region,
          accountId,
          MessageBody,
        },
      });
      const response = await sqs
        .sendMessage(
          this._paramsToSendMessage(queueName, accountId, MessageBody),
        )
        .promise();
      console.log({ SERVICE_NAME, response });
    } catch (e) {
      console.error({ SERVICE_NAME, error: e });
    }
  }

  private _paramsToSendMessage(
    queueName: string,
    accountId: string,
    MessageBody: string,
  ): SendMessageRequest {
    return {
      MessageBody,
      QueueUrl: sqs.endpoint.href + accountId + '/' + queueName,
    };
  }
}

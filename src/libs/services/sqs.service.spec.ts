import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SQS } from 'aws-sdk';

import { SqsService } from '/opt/src/libs/services/sqs.service';
import { QUEUE } from '/opt/src/libs/shared/injectables';

describe('SqsService', () => {
  let service: SqsService;
  let sqs: SQS;

  beforeEach(async () => {
    global.console = require('console');
    const MODULE: TestingModule = await Test.createTestingModule({
      providers: [
        SqsService,
        SQS,
        {
          provide: ConfigService,
          useFactory: () => ({
            get: () => ({
              accountId: process.env.ACCOUNT_ID,
              stage: process.env.STAGE,
              region: process.env.REGION,
              appQueue: process.env.APP_QUEUE,
            }),
          }),
        },
        {
          provide: QUEUE,
          useValue: SQS,
        },
      ],
    }).compile();

    service = MODULE.get<SqsService>(SqsService);
    sqs = MODULE.get<SQS>(QUEUE);
  });

  it('should return a successful message', async () => {
    sqs.sendMessage = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue(null),
    }));

    expect(await service.sendMessage('queue', 'data')).toBeUndefined();
  });

  it('should return a wrong message', async () => {
    sqs.sendMessage = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockRejectedValueOnce(new Error()),
    }));

    expect(await service.sendMessage('queue', 'data')).toBeUndefined();
  });
});

import { SQS } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SQSEvent } from 'aws-lambda';
import { SQSRecord } from 'aws-lambda/trigger/sqs';

import { AppService } from '/opt/src/app.service';
import { SqsService } from '/opt/src/libs/services/sqs.service';
import { QUEUE } from '/opt/src/libs/shared/injectables';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

describe('AppService', () => {
  const appQueueStreamParam: SQSEvent = {
    Records: [<SQSRecord>{ body: 'test' }],
  };
  let sqsService: SqsService;
  let service: AppService;

  beforeEach(async () => {
    global.console = require('console');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        SqsService,
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

    service = module.get<AppService>(AppService);
    sqsService = module.get<SqsService>(SqsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should return a message', async () => {
    jest
      .spyOn(sqsService, 'sendMessage')
      .mockImplementation(async (): Promise<void> => null);
    expect(await service.app({ code: '123', date: new Date() })).toEqual(
      formatResponse(
        {
          message: `${new Date()}: ${123}`,
        },
        SERVICE_NAME,
      ),
    );
  });

  it('should return a error', async () => {
    jest
      .spyOn(sqsService, 'sendMessage')
      .mockRejectedValue(new Error('Test Error'));
    expect(await service.app({ code: '123', date: new Date() })).toEqual(
      errorResponse(
        {
          message: 'Test Error',
        },
        SERVICE_NAME,
      ),
    );
  });

  it('should return true', async () => {
    expect(await service.test({ email: 'email@mail.com' })).toEqual(
      formatResponse({ email: 'email@mail.com' }, SERVICE_NAME),
    );
  });

  it('should print a message', async () => {
    expect(await service.appQueueStream(appQueueStreamParam)).toBeUndefined();
  });
});

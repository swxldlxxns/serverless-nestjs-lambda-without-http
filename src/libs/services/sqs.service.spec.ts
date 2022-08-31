import { Test, TestingModule } from '@nestjs/testing';
import * as AWS from 'aws-sdk';

import { SqsService } from '/opt/src/libs/services/sqs.service';

jest.mock('aws-sdk', () => {
  const SQS_MOCKED = {
    sendMessage: jest.fn().mockReturnThis(),
    endpoint: jest.fn(),
    promise: jest.fn(),
  };
  return {
    SQS: jest.fn(() => SQS_MOCKED),
  };
});
const SQS = new AWS.SQS({
  region: 'test',
});

describe('SqsService', () => {
  let service: SqsService;

  beforeEach(async () => {
    global.console = require('console');
    const MODULE: TestingModule = await Test.createTestingModule({
      providers: [SqsService],
    }).compile();
    service = MODULE.get<SqsService>(SqsService);
    (SQS.sendMessage().promise as jest.MockedFunction<any>).mockReset();
  });

  it('should return a successful message', async () => {
    expect(jest.isMockFunction(SQS.sendMessage)).toBeTruthy();
    expect(jest.isMockFunction(SQS.sendMessage().promise)).toBeTruthy();
    (
      SQS.sendMessage().promise as jest.MockedFunction<any>
    ).mockResolvedValueOnce({});
    await service.sendMessage('queue', 'data');
    expect(SQS.sendMessage().promise).toBeCalledTimes(1);
  });

  it('should return a wrong message', async () => {
    (
      SQS.sendMessage().promise as jest.MockedFunction<any>
    ).mockRejectedValueOnce('network error');
    await service.sendMessage('queue', 'data');
    expect(SQS.sendMessage().promise).toBeCalledTimes(1);
  });
});

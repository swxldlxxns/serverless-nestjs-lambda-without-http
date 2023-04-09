import { SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';

import { AppRequestsDto } from '/opt/src/libs/dtos/requests/app-requests.dto';
import { TestRequestsDto } from '/opt/src/libs/dtos/requests/test-requests.dto';
import { AppResponseDto } from '/opt/src/libs/dtos/responses/app-response.dto';
import { TestResponseDto } from '/opt/src/libs/dtos/responses/test-response.dto';
import { EnvironmentInterface } from '/opt/src/libs/interfaces/environment.interface';
import { SqsService } from '/opt/src/libs/services/sqs.service';
import { errorResponse, formatResponse, log } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';

@Injectable()
export class AppService {
  private readonly _appQueue: string;

  constructor(
    private readonly _sqsService: SqsService,
    private readonly _configService: ConfigService,
  ) {
    const { appQueue }: EnvironmentInterface =
      this._configService.get<EnvironmentInterface>('config');

    this._appQueue = appQueue;
  }

  async app(request: AppRequestsDto): Promise<APIGatewayProxyResult> {
    try {
      const { MessageId: id }: SendMessageCommandOutput =
        await this._sqsService.sendMessage(
          this._appQueue,
          `Mensaje de prueba ${new Date()}`,
        );

      return formatResponse<AppResponseDto>(
        {
          id,
          message: `${request.date}: ${request.code}`,
        },
        SERVICE_NAME,
      );
    } catch (e) {
      return errorResponse(e, SERVICE_NAME);
    }
  }

  async test(request: TestRequestsDto): Promise<APIGatewayProxyResult> {
    return formatResponse<TestResponseDto>(
      { email: `${request.email}` },
      SERVICE_NAME,
    );
  }

  async appQueueStream({ Records }: SQSEvent): Promise<void> {
    log('INFO', { SERVICE_NAME, Records });
  }
}

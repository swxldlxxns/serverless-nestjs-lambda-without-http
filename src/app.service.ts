import { Injectable } from '@nestjs/common';
import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';

import { AppRequestsDto } from '/opt/src/libs/interfaces/request/app-requests.dto';
import { TestRequestsDto } from '/opt/src/libs/interfaces/request/test-requests.dto';
import { AppResponseDto } from '/opt/src/libs/interfaces/response/app-response.dto';
import { TestResponseDto } from '/opt/src/libs/interfaces/response/test-response.dto';
import { SqsService } from '/opt/src/libs/services/sqs.service';
import { ENV_VARS } from '/opt/src/libs/shared/enviroments';
import { errorResponse, formatResponse } from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppService';
const { appQueue } = ENV_VARS;

@Injectable()
export class AppService {
  constructor(private readonly _sqsService: SqsService) {}

  async app(request: AppRequestsDto): Promise<APIGatewayProxyResult> {
    try {
      await this._sqsService.sendMessage(
        appQueue,
        `Mensaje de prueba ${new Date()}`,
      );
      return formatResponse<AppResponseDto>(
        {
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
    console.info({ SERVICE_NAME, Records });
  }
}

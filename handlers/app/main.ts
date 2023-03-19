import { HttpStatus, INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { AppModule } from '/opt/src/app.module';
import { AppService } from '/opt/src/app.service';
import { AppRequestsDto } from '/opt/src/libs/dtos/requests/app-requests.dto';
import {
  checkBody,
  errorResponse,
  errorsDto,
  log,
  validateDto,
} from '/opt/src/libs/utils';

const SERVICE_NAME = 'AppModule';

async function bootstrap(): Promise<INestApplicationContext> {
  return await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
}

exports.handler = async function (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  log('INFO', { SERVICE_NAME, event, context });
  const app = await bootstrap();
  const appService = app.get(AppService);
  const param = await validateDto(AppRequestsDto, checkBody(event.body));
  const errors = await errorsDto(param);

  if (errors.length)
    return errorResponse(
      { message: errors },
      SERVICE_NAME,
      HttpStatus.BAD_REQUEST,
    );

  return await appService.app(param);
};

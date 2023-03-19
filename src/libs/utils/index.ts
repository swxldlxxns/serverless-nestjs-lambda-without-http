import { HttpStatus, ValidationError } from '@nestjs/common';
import { APIGatewayProxyResult } from 'aws-lambda';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { validate } from 'class-validator';
import { isEmpty, isObject } from 'lodash';

export async function validateDto<T>(
  DTO: ClassConstructor<T>,
  param: object,
): Promise<T> {
  return plainToInstance(DTO, param, {
    excludeExtraneousValues: true,
  });
}

export async function errorsDto(data): Promise<ValidationError[]> {
  return await validate(<object>(<unknown>data));
}

export function checkBody(body: any): object {
  return isJsonString(body) ? JSON.parse(body) : {};
}

export function isJsonString(str: any): boolean {
  try {
    return !isEmpty(str) && isObject(JSON.parse(str));
  } catch {
    return false;
  }
}

export function formatResponse<T>(
  response: T,
  SERVICE_NAME: string,
  statusCode: HttpStatus = HttpStatus.OK,
): APIGatewayProxyResult {
  log('INFO', { SERVICE_NAME, response });

  return {
    statusCode,
    body: JSON.stringify(response),
  };
}

export function errorResponse(
  catchErrors,
  SERVICE_NAME: string,
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
): APIGatewayProxyResult {
  log('ERROR', { SERVICE_NAME, catchErrors });

  return formatResponse(
    {
      errors: isJsonString(catchErrors.message)
        ? JSON.parse(catchErrors.message)
        : catchErrors.message,
    },
    SERVICE_NAME,
    statusCode,
  );
}

export function log(type: 'INFO' | 'ERROR', data: object): void {
  switch (type) {
    case 'INFO':
      console.info(data);
      break;
    case 'ERROR':
      console.error(data);
      break;
  }
}

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto } from './response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let responseJson: {
        statusCode: number,
        timestamp: string,
        path: string
    } | ResponseDto = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
      console.log("error happend");
    if (status == 400) {
        const validationRaw = exception.getResponse()['message'];
        const validation = validationRaw.map(v => JSON.parse(v));
        responseJson = new ResponseDto(false, "Bad Request", null, validation)
    };
    response
      .status(status)
      .json(responseJson);
  }
}
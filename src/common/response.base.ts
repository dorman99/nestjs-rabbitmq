import { Res, HttpStatus, Response } from '@nestjs/common';
import { ResponseDto } from "./response.dto";
export class AppResponse {
    static ok(@Res() res, values: any): Response {
        return res.status(HttpStatus.OK).json(new ResponseDto(true, "success", values))
    }

    static badRequest(@Res() res, validation: object[]): Response {
        return res.status(HttpStatus.BAD_REQUEST).json(new ResponseDto(false, "bad request", null, validation))
    }

    static forbidden(@Res() res): Response {
        return res.status(HttpStatus.FORBIDDEN).json({})
    }

    static accepted(@Res() res): Response {
        return res.status(HttpStatus.ACCEPTED).json(new ResponseDto(true, "accepted", null));
    }

    static duplicated(@Res() res, validation: Object[]): Response {
        return res.status(HttpStatus.CONFLICT).json(new ResponseDto(false, "Conflict", null, validation));
    }
}
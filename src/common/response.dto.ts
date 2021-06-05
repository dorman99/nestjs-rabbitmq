import { ResponseInterface } from './interfaces/response.interface';

export class ResponseDto implements ResponseInterface {
    ok: Boolean;
    message: String;
    data: any;
    validation: Object[];
    
    constructor(ok: Boolean, message: String, data: any, validation?: Object[]) {
        this.ok = ok;
        this.message = message;
        this.data = data
        this.validation = validation
    }
}
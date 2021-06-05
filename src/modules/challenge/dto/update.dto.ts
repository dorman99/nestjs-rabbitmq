import { IsNotEmpty, IsString, Length } from "class-validator";
import { UpdateDtoInterface } from "../interface/update.dto.interface";

export class UpdateDto implements UpdateDtoInterface {
    @IsNotEmpty({message: JSON.stringify({name: ['Must Be Provide']})})
    @IsString({message: JSON.stringify({name: ['Must Be A String']})})
    @Length(2, 10, {message: JSON.stringify({name: ['Min 2 Max 10']})})
    name: string;
}
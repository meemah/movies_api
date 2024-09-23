import { IsEmail, IsString, Length } from "class-validator";

export class LogInRequest {
    @IsString()
    @Length(6)
    password: string;

    @IsEmail()
    email: string;
}
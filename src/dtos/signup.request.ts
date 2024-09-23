import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class SignUpRequest {
    @IsNotEmpty({ message: 'Full Name is required' })
    firstName: string

    @IsNotEmpty({ message: 'Last Name is required' })
    lastName: string

    @IsString()
    @Length(6)
    password: string

    @IsEmail()
    email: string
}
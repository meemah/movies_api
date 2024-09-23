import { IsNotEmpty } from "class-validator"

export class GenreRequest {
    @IsNotEmpty({ message: 'Name is required' })
    name: string
    imageUrl: string | null
}
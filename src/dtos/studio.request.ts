import { IsNotEmpty } from "class-validator"

export class StudioRequest {
    @IsNotEmpty({ message: 'Name is required' })
    name: string
    imageUrl: string | null
    @IsNotEmpty({ message: 'Location is required' })
    location: string
}
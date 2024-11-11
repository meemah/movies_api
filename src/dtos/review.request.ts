import { IsNotEmpty, IsNumber, Max, Min } from "class-validator"

export class ReviewRequest {
    @IsNotEmpty({ message: 'Comment is required' })
    comment: string

    @IsNumber({}, { message: "Average rating must be a number" })
    @Min(0, { message: "Average rating must be at least 0" })
    @Max(5, { message: "Average rating must not exceed 5" })
    rating: number

}
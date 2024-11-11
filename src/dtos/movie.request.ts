import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsUrl } from "class-validator";

export class MovieRequest {

    @IsNotEmpty({ "message": "Movie title is required" })
    title: string

    @IsArray({ "message": "Genre should be an array" })
    @ArrayNotEmpty({ message: "At least one genre is required" })
    genres: string[]

    @IsNotEmpty({ message: "Release date is required" })
    @IsDate({ message: "Release date must be a valid date" })
    @Type(() => Date)
    releaseDate: Date;

    @IsNotEmpty({ message: "Poster URL is required" })
    @IsUrl({}, { message: "Poster URL must be a valid URL" })
    posterUrl: string;


    @IsArray({ message: "Cast should be an array" })
    @ArrayNotEmpty({ message: "At least one cast is required" })
    casts: string[]


    directorId: string

    studioId: string
}
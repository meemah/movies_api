import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    userId: string

    @Column()
    comment: string

    @Column()
    rating: number

    @ManyToOne(() => Movie, movie => movie.reviews)
    @JoinColumn({ name: "movieId" })
    movie: Movie

}
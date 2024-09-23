import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    userId: string

    @Column()
    movieId: string

    @Column()
    comment: string

    @Column()
    rating: number
}
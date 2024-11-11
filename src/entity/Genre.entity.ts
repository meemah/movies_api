import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "./Movie.entity";

@Entity()
export class Genre {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @Column({ nullable: true })
    imageUrl: string



    @ManyToMany(() => Movie, movie => movie.genres)
    movies: Movie[]

}
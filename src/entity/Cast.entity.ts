import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "./Movie.entity";


@Entity()
export class Cast {
    @PrimaryGeneratedColumn()
    id: string
    @Column()
    name: string
    @Column({ nullable: true })
    gender: string
    @Column({ nullable: true })
    imageUrl: string
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updateAt: Date
    @ManyToMany(() => Movie, movie => movie.cast)
    movies: Movie[]
}
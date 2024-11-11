import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Movie } from "./Movie.entity"


@Entity()
export class Director {
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
    @OneToMany(() => Movie, movie => movie.director)
    movies: Movie[]
}
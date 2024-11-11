import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "./Movie.entity";

@Entity()
export class Studio {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @Column()
    location: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @Column({ nullable: true })
    imageUrl: string

    @OneToMany(() => Movie, movie => movie.studio)
    movies: Movie[]
}
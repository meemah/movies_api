import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cast } from './Cast.entity';
import { Director } from './Director.entity';
import { Genre } from "./Genre.entity";
import { Studio } from './Studio.entity';
@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    title: string

    @Column({ type: 'timestamp' })
    releaseDate: Date

    @Column()
    posterUrl: String

    @Column({ default: 0 })
    averageRating: number

    @JoinTable()
    @ManyToMany(() => Genre, genre => genre.movies)
    genres: Genre[]


    @JoinTable()
    @ManyToMany(() => Cast, cast => cast.movies)
    cast: Cast[]

    @ManyToOne(() => Director, director => director.movies,)
    director: Director

    @ManyToOne(() => Studio, studio => studio.movies,)
    studio: Movie
}
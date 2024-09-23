import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}
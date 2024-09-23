import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"


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
}
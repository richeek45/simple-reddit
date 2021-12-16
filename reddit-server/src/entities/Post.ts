import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Updoot } from "./Updoot";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  _id!: number;
  
  @Field()  // exposes the field while querying
  @Column()
  title!: string;
  
  @Field()  // exposes the field while querying
  @Column()
  text!: string;
  
  @Field()  // exposes the field while querying
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, {nullable: true})
  voteStatus: number | null; // 1 or -1 or null

  @Field()
  @Column()
  creatorId: number;

  @Field() 
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @OneToMany(() => Updoot, (updoots) => updoots.post)
  updoots: Updoot[]; 

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

}
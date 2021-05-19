import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { FoodInfo } from "./FoodInfo";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FoodInfo, (foodInfo) => foodInfo.comment)
  foodInfo!: FoodInfo;

  @ManyToOne(() => User, (user) => user.comment)
  user!: User;

  @Column()
  comment: string;

  @Column()
  score: number;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

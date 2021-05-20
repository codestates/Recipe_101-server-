import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { FoodInfo } from "./FoodInfo";

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.userStore)
  user!: User;

  @ManyToOne((type) => FoodInfo, (foodInfo) => foodInfo.foodStore)
  foodInfo!: FoodInfo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

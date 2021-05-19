import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

import { FoodInfo } from "./FoodInfo";

@Entity()
export class Ingredients {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => FoodInfo, (foodInfo) => foodInfo.igrs)
  foodInfo!: FoodInfo;

  @Column()
  type: string;

  @Column()
  cap: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

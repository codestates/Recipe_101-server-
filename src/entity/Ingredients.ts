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

  @ManyToOne((type) => FoodInfo, (foodInfo) => foodInfo.igrs, {
    onDelete: "CASCADE",
  })
  foodInfo!: FoodInfo;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  cap: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

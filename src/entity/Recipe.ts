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
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => FoodInfo, (foodInfo) => foodInfo.recipes, {
    onDelete: "CASCADE",
  }) // FoodInfoId
  foodInfo!: FoodInfo;

  @Column()
  cookingNo: number;

  @Column()
  cookingDc: string;

  @Column()
  stepImage: string;

  @Column()
  stepTip: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

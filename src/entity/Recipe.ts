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
  cooking_no: number;

  @Column()
  cooking_dc: string;

  @Column()
  step_image: string;

  @Column()
  step_tip: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Store } from "./Store";
import { Comment } from "./Comment";
import { Ingredients } from "./Ingredients";
import { Recipe } from "./Recipe";

@Entity()
export class FoodInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.foodInfo)
  user!: User;

  @Column()
  foodName: string;

  @Column()
  summary: string;

  @Column()
  nation: string;

  @Column()
  type: string;

  @Column()
  cooking_time: string;

  @Column()
  calorie: string;

  @Column()
  qnt: string;

  @Column()
  level: string;

  @Column()
  IRDNT_code: string;

  @Column()
  price: string;

  @Column()
  img_url: string;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany((type) => Store, (foodStore) => foodStore.foodInfo)
  foodStore!: Store[];

  @OneToMany((type) => Comment, (comment) => comment.foodInfo)
  comment!: Comment[];

  @OneToMany((type) => Recipe, (recipes) => recipes.foodInfo)
  recipes!: Recipe[];

  @OneToMany((type) => Ingredients, (igrs) => igrs.foodInfo)
  igrs!: Ingredients[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

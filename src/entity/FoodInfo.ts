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
  cookingTime: string;

  @Column()
  calorie: string;

  @Column()
  qnt: string;

  @Column()
  level: string;

  @Column()
  irdntCode: string;

  @Column()
  price: string;

  @Column()
  imgUrl: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Store, (foodStore) => foodStore.foodInfo)
  foodStore!: Store[];

  @OneToMany((type) => Comment, (comment) => comment.foodInfo)
  comment!: Comment[];

  @OneToMany((type) => Recipe, (recipes) => recipes.foodInfo)
  recipes!: Recipe[];

  @OneToMany((type) => Ingredients, (igrs) => igrs.foodInfo)
  igrs!: Ingredients[];
}

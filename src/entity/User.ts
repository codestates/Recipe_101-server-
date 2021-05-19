import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Ff } from "./Ff";
import { Store } from "./Store";
import { Comment } from "./Comment";
import { FoodInfo } from "./FoodInfo";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  password2: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany((type) => Ff, (follow) => follow.user)
  follow!: Ff[];

  @OneToMany((type) => Ff, (follower) => follower.target)
  follower!: Ff[];

  @OneToMany((type) => Store, (userStore) => userStore.user)
  userStore!: Store[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comment!: Comment[];

  @OneToMany((type) => FoodInfo, (foodInfo) => foodInfo.user)
  foodInfo!: FoodInfo[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  BeforeUpdate,
  AfterLoad,
} from "typeorm";
import { User } from "./user.entity";

@Entity("todos")
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  complete: boolean;

  @Column({ type: "date", nullable: true, default: null })
  dateCompleted: Date | null;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn()
  user: User;
}

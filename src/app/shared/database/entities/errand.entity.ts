import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "errands" })
export class ErrandEntity {
  @PrimaryGeneratedColumn("uuid", { name: "errand_id" })
  errandId: string;

  @Column({ name: "is_archived", type: "bool", default: false })
  isArchived: boolean;

  @Column()
  description: string;

  @Column({ nullable: true })
  details: string;

  @CreateDateColumn({ name: "create_at" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_ate" })
  updateAt: Date;

  @Column({ name: "id_user" })
  idUser: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "id_user" })
  user: UserEntity;
}

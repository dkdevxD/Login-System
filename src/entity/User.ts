import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, getManager, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsEmail, IsEmpty, MaxLength, MinLength, ValidateIf } from "class-validator";
import bcrypt from 'bcrypt';

@Entity()
export class User {
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  @MaxLength(64)
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 12);
  };

  @CreateDateColumn()
  @UpdateDateColumn()
  created_at: Date;

  @Column({ default: false })
  @IsBoolean()
  emailVerify: boolean;

  static async getId(id: number) {
    const user = await getManager().findOne(User, { where: { id: id } });
    return user;
  };

  static async getEmail(email: string) {
    const user = await getManager().findOne(User, { where: { email: email } });
    return user;
  };
}
import { Exclude } from "class-transformer";
import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { BcryptConfigOptions } from "src/configurations";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	@Exclude()
	password: string;

	@Column({ nullable: true })
	fullname: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@BeforeInsert()
	handleBeforeInsert() {
		// Hash password
		if (this.password) {
			this.password = bcrypt.hashSync(this.password, BcryptConfigOptions.saltOrRounds);
		}

		// Generate temporary fullname
		if (!this.fullname) {
			this.fullname = `Anonymous user ${Math.floor(Math.random() * 10000)}`;
		}
	}
}

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
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User {
	@ApiProperty({ description: "User ID", example: "1" })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "User email", example: "pa.infotel@example.com" })
	@Column({ unique: true })
	email: string;

	@ApiProperty({ description: "User password", example: "password" })
	@Column()
	@Exclude()
	password: string;

	@ApiProperty({ description: "User fullname", example: "John Doe" })
	@Column({ nullable: true })
	fullname: string;

	@ApiProperty({ description: "User created at", example: "2024-0-01T00:00:00.000Z" })
	@CreateDateColumn()
	created_at: Date;

	@ApiProperty({ description: "User updated at", example: "2024-01-01T00:00:00.000Z" })
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

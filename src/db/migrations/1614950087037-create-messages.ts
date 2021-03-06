import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm'

export class createMessages1614950087037 implements MigrationInterface {
	private table = new Table({
		name: 'messages',
		columns: [
			{
				name: 'id',
				type: 'integer',
				isPrimary: true,
				isGenerated: true,
				generationStrategy: 'uuid',
			},
			{
				name: 'user_id',
				type: 'integer',
				isNullable: false,
			},
			{
				name: 'content',
				type: 'varchar',
				length: '255',
				isNullable: false,
			},
			{
				name: 'created_at',
				type: 'timestamptz',
				isNullable: false,
				default: 'now()',
			},
			{
				name: 'updated_at',
				type: 'timestamptz',
				isNullable: false,
				default: 'now()',
			},
		],
	})

	private foreignKey = new TableForeignKey({
		columnNames: ['user_id'],
		referencedColumnNames: ['id'],
		onDelete: 'CASCADE',
		referencedTableName: 'users',
	})

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(this.table)
		await queryRunner.createForeignKey(this.table, this.foreignKey)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(this.table)
		await queryRunner.dropForeignKey(this.table, this.foreignKey)
	}
}

const { MigrationInterface, QueryRunner, Table, TableForeignKey } = require('typeorm');

module.exports = class CreateServiceOfferings1704672200000 {
  name = 'CreateServiceOfferings1704672200000';

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'service_offerings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'specialist_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'service_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'service_offerings_master_list_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'service_offerings',
      new TableForeignKey({
        columnNames: ['specialist_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'specialists',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'service_offerings',
      new TableForeignKey({
        columnNames: ['service_offerings_master_list_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'service_offerings_master_list',
        onDelete: 'CASCADE',
      })
    );

    // Add indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_SERVICE_OFFERING_SPECIALIST" ON "service_offerings" ("specialist_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SERVICE_OFFERING_SERVICE" ON "service_offerings" ("service_offerings_master_list_id")`
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('service_offerings');
  }
};

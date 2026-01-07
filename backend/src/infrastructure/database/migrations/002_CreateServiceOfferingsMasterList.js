const { MigrationInterface, QueryRunner, Table } = require('typeorm');

module.exports = class CreateServiceOfferingsMasterList1704672100000 {
  name = 'CreateServiceOfferingsMasterList1704672100000';

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'service_offerings_master_list',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'bucket_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
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

    await queryRunner.query(
      `CREATE INDEX "IDX_SERVICE_OFFERING_MASTER_TITLE" ON "service_offerings_master_list" ("title")`
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('service_offerings_master_list');
  }
};

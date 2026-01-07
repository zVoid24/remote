const { MigrationInterface, QueryRunner, Table } = require('typeorm');

module.exports = class CreateSpecialistsTable1704672000000 {
  name = 'CreateSpecialistsTable1704672000000';

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'specialists',
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
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'average_rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'is_draft',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'total_number_of_ratings',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'base_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'platform_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'final_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'verification_status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'is_verified',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'duration_days',
            type: 'int',
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
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_SPECIALIST_SLUG" ON "specialists" ("slug")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SPECIALIST_DRAFT" ON "specialists" ("is_draft")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_SPECIALIST_VERIFICATION" ON "specialists" ("verification_status")`
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('specialists');
  }
};

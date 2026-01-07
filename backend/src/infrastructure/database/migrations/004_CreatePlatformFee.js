const { MigrationInterface, QueryRunner, Table } = require('typeorm');

module.exports = class CreatePlatformFee1704672300000 {
  name = 'CreatePlatformFee1704672300000';

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'platform_fee',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tier_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'min_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'max_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'platform_fee_percentage',
            type: 'decimal',
            precision: 5,
            scale: 2,
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

    // Insert default platform fee
    await queryRunner.query(`
      INSERT INTO platform_fee (tier_name, min_value, max_value, platform_fee_percentage)
      VALUES ('default', 0, NULL, 10.00)
    `);
  }

  async down(queryRunner) {
    await queryRunner.dropTable('platform_fee');
  }
};

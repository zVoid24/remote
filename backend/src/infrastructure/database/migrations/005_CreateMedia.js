const { MigrationInterface, QueryRunner, Table, TableForeignKey } = require('typeorm');

module.exports = class CreateMedia1704672400000 {
  name = 'CreateMedia1704672400000';

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'media',
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
            name: 'tier_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'file_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'file_size',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'display_order',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'media_type',
            type: 'varchar',
            length: '50',
            default: "'image'",
            isNullable: false,
          },
          {
            name: 'uploaded_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
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

    // Add foreign key
    await queryRunner.createForeignKey(
      'media',
      new TableForeignKey({
        columnNames: ['specialist_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'specialists',
        onDelete: 'CASCADE',
      })
    );

    // Add indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_MEDIA_SPECIALIST" ON "media" ("specialist_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_MEDIA_DISPLAY_ORDER" ON "media" ("specialist_id", "display_order")`
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('media');
  }
};

const { EntitySchema } = require('typeorm');

/**
 * PlatformFee Entity
 * Configuration for platform fee calculation
 */
module.exports = new EntitySchema({
  name: 'PlatformFee',
  tableName: 'platform_fee',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    tier_name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    min_value: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true,
    },
    max_value: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true,
    },
    platform_fee_percentage: {
      type: 'decimal',
      precision: 5,
      scale: 2,
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
});

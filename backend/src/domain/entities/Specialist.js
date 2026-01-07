const { EntitySchema } = require('typeorm');

/**
 * Specialist Entity
 * Represents a specialist service offering
 */
module.exports = new EntitySchema({
  name: 'Specialist',
  tableName: 'specialists',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    slug: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    average_rating: {
      type: 'decimal',
      precision: 3,
      scale: 2,
      default: 0,
      nullable: false,
    },
    is_draft: {
      type: 'boolean',
      default: true,
      nullable: false,
    },
    total_number_of_ratings: {
      type: 'int',
      default: 0,
      nullable: false,
    },
    base_price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    platform_fee: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    final_price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    verification_status: {
      type: 'enum',
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
      nullable: false,
    },
    is_verified: {
      type: 'boolean',
      default: false,
      nullable: false,
    },
    duration_days: {
      type: 'int',
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
    deleted_at: {
      type: 'timestamp',
      nullable: true,
    },
  },
  relations: {
    serviceOfferings: {
      type: 'one-to-many',
      target: 'ServiceOffering',
      inverseSide: 'specialist',
      cascade: true,
    },
    media: {
      type: 'one-to-many',
      target: 'Media',
      inverseSide: 'specialist',
      cascade: true,
    },
  },
  indices: [
    {
      name: 'IDX_SPECIALIST_SLUG',
      columns: ['slug'],
      unique: true,
    },
    {
      name: 'IDX_SPECIALIST_DRAFT',
      columns: ['is_draft'],
    },
    {
      name: 'IDX_SPECIALIST_VERIFICATION',
      columns: ['verification_status'],
    },
  ],
});

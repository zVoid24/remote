const { EntitySchema } = require('typeorm');

/**
 * Media Entity
 * File storage metadata for specialist images
 */
module.exports = new EntitySchema({
  name: 'Media',
  tableName: 'media',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    specialist_id: {
      type: 'uuid',
      nullable: false,
    },
    tier_name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    file_name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    file_size: {
      type: 'int',
      nullable: false,
    },
    display_order: {
      type: 'int',
      default: 0,
      nullable: false,
    },
    mime_type: {
      type: 'enum',
      enum: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      nullable: false,
    },
    media_type: {
      type: 'enum',
      enum: ['image', 'video', 'document'],
      default: 'image',
      nullable: false,
    },
    uploaded_at: {
      type: 'timestamp',
      createDate: true,
    },
    deleted_at: {
      type: 'timestamp',
      nullable: true,
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
  relations: {
    specialist: {
      type: 'many-to-one',
      target: 'Specialist',
      joinColumn: {
        name: 'specialist_id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_MEDIA_SPECIALIST',
      columns: ['specialist_id'],
    },
    {
      name: 'IDX_MEDIA_DISPLAY_ORDER',
      columns: ['specialist_id', 'display_order'],
    },
  ],
});

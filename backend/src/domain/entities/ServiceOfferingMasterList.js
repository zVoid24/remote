const { EntitySchema } = require('typeorm');

/**
 * ServiceOfferingMasterList Entity
 * Master list of available service offerings
 */
module.exports = new EntitySchema({
  name: 'ServiceOfferingMasterList',
  tableName: 'service_offerings_master_list',
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
    description: {
      type: 'text',
      nullable: true,
    },
    bucket_name: {
      type: 'varchar',
      length: 255,
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
  relations: {
    serviceOfferings: {
      type: 'one-to-many',
      target: 'ServiceOffering',
      inverseSide: 'serviceOfferingMaster',
    },
  },
  indices: [
    {
      name: 'IDX_SERVICE_OFFERING_MASTER_TITLE',
      columns: ['title'],
    },
  ],
});

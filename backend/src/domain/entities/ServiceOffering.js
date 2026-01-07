const { EntitySchema } = require('typeorm');

/**
 * ServiceOffering Entity
 * Junction table linking specialists to service offerings with pricing
 */
module.exports = new EntitySchema({
  name: 'ServiceOffering',
  tableName: 'service_offerings',
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
    service_id: {
      type: 'uuid',
      nullable: false,
    },
    service_offerings_master_list_id: {
      type: 'uuid',
      nullable: false,
    },
    description: {
      type: 'text',
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
    serviceOfferingMaster: {
      type: 'many-to-one',
      target: 'ServiceOfferingMasterList',
      joinColumn: {
        name: 'service_offerings_master_list_id',
      },
    },
  },
  indices: [
    {
      name: 'IDX_SERVICE_OFFERING_SPECIALIST',
      columns: ['specialist_id'],
    },
    {
      name: 'IDX_SERVICE_OFFERING_SERVICE',
      columns: ['service_offerings_master_list_id'],
    },
  ],
});

/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('items', {
    id: { type: 'varchar(32)', notNull: true, unique: true},
    name: { type: 'varchar(1000)', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    cost: 'decimal',
    level: 'integer',
  })
};

exports.down = pgm => {
  pgm.dropTable('items');
};

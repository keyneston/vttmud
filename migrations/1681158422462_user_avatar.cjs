/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("characters", {
    avatar: { type: "varchar(200)" },
  });
  pgm.createTable("character_log", {
    id: { type: "id", notNull: true, unique: true },
    characterID: { type: "id", notNull: true, references: "characters"},
    experience: { type: "integer" },
    spend: { type: "boolean" },
    gold: { type: "integer" },
    silver: { type: "integer" },
    copper: { type: "integer" },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  })
};

exports.down = (pgm) => {
  pgm.dropColumns("characters", 
    ["avatar"],
  );
  pgm.dropTable("character_log")
};

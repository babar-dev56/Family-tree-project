exports.up = async function (knex) {
  const hasMembersTable = await knex.schema.hasTable('members');

  if (!hasMembersTable) {
    await knex.schema.createTable('members', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('age').nullable();
      table.string('gender').nullable();
      table.integer('parent_id').unsigned().nullable();
      table.foreign('parent_id').references('members.id').onDelete('SET NULL');
      table.timestamps(true, true);
    });
  } else {
    const hasParentIdColumn = await knex.schema.hasColumn('members', 'parent_id');

    if (!hasParentIdColumn) {
      await knex.schema.table('members', (table) => {
        table.integer('parent_id').unsigned().nullable();
        table.foreign('parent_id').references('members.id').onDelete('SET NULL');
      });
    }
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('members');
};

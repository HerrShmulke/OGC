const db = require('./src/server-modules/db');

async function laboratoryTopicInit() {
  try {
    await db.query(
      'CREATE TABLE `laboratory_topic` (`id` int(11) NOT NULL, `name` char(80) COLLATE utf8mb4_unicode_ci NOT NULL, `begin_date` date NOT NULL, `end_date` date NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
    );

    await db.query('ALTER TABLE `laboratory_topic` ADD PRIMARY KEY (`id`);');

    db.query('ALTER TABLE `laboratory_topic` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;');
  } catch {}

  console.log('Database `laboratory_topic` is initialized.');
}

async function laboratoryWorksInit() {
  try {
    await db.query(`CREATE TABLE \`laboratory_works\` (
    \`id\` int(11) NOT NULL,
    \`file_name\` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    \`owner_id\` int(11) NOT NULL,
    \`topic_id\` int(11) NOT NULL,
    \`upload_date\` date NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

    await db.query(`ALTER TABLE \`laboratory_works\`
    ADD PRIMARY KEY (\`id\`),
    ADD KEY \`laboratory_works_ibfk_1\` (\`owner_id\`),
    ADD KEY \`laboratory_works_ibfk_2\` (\`topic_id\`);`);

    await db.query(`ALTER TABLE \`laboratory_works\`
    MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT;`);

    await db.query(`ALTER TABLE \`laboratory_works\`
    ADD CONSTRAINT \`laboratory_works_ibfk_1\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\` (\`id\`) ON DELETE NO ACTION,
    ADD CONSTRAINT \`laboratory_works_ibfk_2\` FOREIGN KEY (\`topic_id\`) REFERENCES \`laboratory_topic\` (\`id\`) ON DELETE NO ACTION;`);
  } catch {}

  console.log('Database `laboratory_works` is initialized.');
}

async function reviewsInit() {
  try {
    await db.query(`CREATE TABLE \`reviews\` (
      \`id\` int(11) NOT NULL,
      \`owner_id\` int(11) NOT NULL,
      \`work_id\` int(11) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

    await db.query(`ALTER TABLE \`reviews\`
      ADD PRIMARY KEY (\`id\`),
      ADD KEY \`owner_id\` (\`owner_id\`),
      ADD KEY \`work_id\` (\`work_id\`);`);

    await db.query(`ALTER TABLE \`reviews\`
      MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT;`);

    await db.query(`ALTER TABLE \`reviews\`
      ADD CONSTRAINT \`reviews_ibfk_1\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      ADD CONSTRAINT \`reviews_ibfk_2\` FOREIGN KEY (\`work_id\`) REFERENCES \`laboratory_works\` (\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE;
    COMMIT;`);
  } catch {}

  console.log('Database `reviews` is initialized.');
}

async function usersInit() {
  try {
    await db.query(`CREATE TABLE \`users\` (
    \`id\` int(11) NOT NULL,
    \`login\` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    \`name\` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    \`password\` char(150) COLLATE utf8mb4_unicode_ci NOT NULL,
    \`role\` char(100) COLLATE utf8mb4_unicode_ci NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

    await db.query(`ALTER TABLE \`users\`
    ADD PRIMARY KEY (\`id\`);`);

    db.query(`ALTER TABLE \`users\`
    MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT;`);
  } catch {}

  console.log('Database `users` is initialized.');
}

async function checkTables() {
  const tables = await db.query('SHOW TABLES');

  if (tables.length === 0) {
    usersInit();
    laboratoryTopicInit();
    laboratoryWorksInit();
    reviewsInit();
  }
}

module.exports = checkTables;

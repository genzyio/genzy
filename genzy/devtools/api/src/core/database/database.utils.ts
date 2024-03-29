import path from "path";
import { Database } from "sqlite3";
import { config } from "../../config";

const filePath = path.join(config.userArtefactsPath, "genzy.sql");

function createDbConnection() {
  const db = new Database(filePath, (error) => {
    if (error) {
      console.error(error.message);
      return;
    }

    createTables(db);
    console.log("Connection with SQLite has been established.");
  });

  return db;
}

function createTables(db: Database) {
  db.exec(`
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS Projects
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL UNIQUE,
      path   VARCHAR(255) NOT NULL UNIQUE,
      createdAt TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS RecentlyOpened
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL UNIQUE,
      openedAt TIMESTAMP NOT NULL,
      FOREIGN KEY (projectId) REFERENCES Projects(id) ON DELETE CASCADE
    );
  `);
}

const database: { connection: Database } = {
  connection: null as any,
};

const databaseProxy: { connection: Database } = new Proxy(database, {
  get: function (target: any, property: keyof typeof database) {
    if (property === "connection" && !target.connection) {
      target.connection = createDbConnection();
    }

    return target[property];
  },
});

export default databaseProxy;

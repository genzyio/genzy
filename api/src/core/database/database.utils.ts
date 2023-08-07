import path from "path";
import { Database } from "sqlite3";
import { config } from "../../config";

const filePath = path.join(config.userArtefactsPath, "gn1mbly.sql");

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
    CREATE TABLE IF NOT EXISTS Projects
    (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(50) NOT NULL UNIQUE,
      path   VARCHAR(255) NOT NULL UNIQUE
    );
  `);
}

const dbConnection = createDbConnection(); 

export default dbConnection;
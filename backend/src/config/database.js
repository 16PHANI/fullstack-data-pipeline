'use strict';

const mysql = require('mysql2/promise');

/**
 * DatabaseConnection — Singleton OOP pattern
 * Manages MySQL connection pool with retry logic.
 */
class DatabaseConnection {
  constructor() {
    this._pool = null;
  }

  /**
   * Initialise the connection pool (idempotent).
   */
  connect() {
    if (this._pool) return this._pool;

    this._pool = mysql.createPool({
      host:            process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT   || '3306', 10),
      user:            process.env.DB_USER     || 'root',
      password:        process.env.DB_PASSWORD || 'password',
      database:        process.env.DB_NAME     || 'customer_db',
      waitForConnections: true,
      connectionLimit:    10,
      queueLimit:          0,
      enableKeepAlive:  true,
      keepAliveInitialDelay: 0,
    });

    console.log('[DB] Connection pool created');
    return this._pool;
  }

  /**
   * Execute a parameterised query — returns [rows, fields].
   */
  async query(sql, params = []) {
    const pool = this.connect();
    return pool.execute(sql, params);
  }

  /**
   * Begin a transaction and return the connection.
   */
  async beginTransaction() {
    const pool = this.connect();
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    return conn;
  }

  async close() {
    if (this._pool) {
      await this._pool.end();
      this._pool = null;
      console.log('[DB] Pool closed');
    }
  }
}

// Export singleton instance
module.exports = new DatabaseConnection();

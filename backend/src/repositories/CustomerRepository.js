'use strict';

const db       = require('../config/database');
const Customer = require('../models/Customer');

/**
 * CustomerRepository — Repository pattern (OOP).
 * All SQL lives here; business logic stays in the service layer.
 */
class CustomerRepository {

  // ---------------------------------------------------------------
  // READ
  // ---------------------------------------------------------------

  /**
   * Paginated list with optional filters.
   */
  async findAll({ page = 1, limit = 20, region, plan, churn, search } = {}) {
    const offset = (page - 1) * limit;
    const where  = [];
    const params = [];

    if (region) { where.push('region = ?');           params.push(region); }
    if (plan)   { where.push('plan = ?');             params.push(plan);   }
    if (churn !== undefined && churn !== '') {
      where.push('churn = ?');
      params.push(Number(churn));
    }
    if (search) {
      where.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM customers ${clause}`, params);
    const total = countRows[0].total;

    const [rows] = await db.query(
      `SELECT * FROM customers ${clause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      data:  rows.map(Customer.fromRow),
      total,
      page:  Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    };
  }

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    return rows.length ? Customer.fromRow(rows[0]) : null;
  }

  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);
    return rows.length ? Customer.fromRow(rows[0]) : null;
  }

  // ---------------------------------------------------------------
  // WRITE
  // ---------------------------------------------------------------

  async create(data) {
    const sql = `
      INSERT INTO customers
        (name, email, phone, region, plan, tenure_months,
         monthly_charge, total_charges, churn, risk_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.name, data.email, data.phone || null,
      data.region, data.plan,
      data.tenure_months  || 0,
      data.monthly_charge || 0,
      data.total_charges  || 0,
      data.churn          || 0,
      data.risk_score     || 0,
    ];
    const [result] = await db.query(sql, params);
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const allowed = [
      'name','email','phone','region','plan',
      'tenure_months','monthly_charge','total_charges','churn','risk_score',
    ];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (!fields.length) return this.findById(id);

    const sql    = `UPDATE customers SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`;
    const params = [...fields.map(f => data[f]), id];
    await db.query(sql, params);
    return this.findById(id);
  }

  async delete(id) {
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // ---------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------

  async getSummary() {
    const [rows] = await db.query('SELECT * FROM vw_analytics_summary');
    return rows[0];
  }

  async getRegionalBreakdown() {
    const [rows] = await db.query('SELECT * FROM vw_regional_breakdown');
    return rows;
  }

  async getPlanDistribution() {
    const [rows] = await db.query(`
      SELECT plan,
             COUNT(*)                      AS total,
             SUM(churn)                    AS churned,
             ROUND(AVG(monthly_charge), 2) AS avg_charge,
             ROUND(AVG(risk_score), 4)     AS avg_risk
      FROM customers
      GROUP BY plan
      ORDER BY FIELD(plan, 'Basic','Standard','Premium')
    `);
    return rows;
  }

  async getRiskDistribution() {
    const [rows] = await db.query(`
      SELECT
        CASE
          WHEN risk_score >= 0.75 THEN 'Critical'
          WHEN risk_score >= 0.60 THEN 'High'
          WHEN risk_score >= 0.40 THEN 'Medium'
          ELSE 'Low'
        END AS risk_label,
        COUNT(*) AS count
      FROM customers
      GROUP BY risk_label
      ORDER BY FIELD(risk_label,'Critical','High','Medium','Low')
    `);
    return rows;
  }
}

module.exports = new CustomerRepository();

'use strict';

const repo = require('../repositories/CustomerRepository');

/**
 * CustomerService — business logic layer (OOP).
 * Validates constraints, computes derived fields, orchestrates repo calls.
 */
class CustomerService {

  async listCustomers(filters) {
    return repo.findAll(filters);
  }

  async getCustomer(id) {
    const customer = await repo.findById(id);
    if (!customer) throw Object.assign(new Error('Customer not found'), { status: 404 });
    return customer;
  }

  async createCustomer(data) {
    // Uniqueness check
    const existing = await repo.findByEmail(data.email);
    if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });

    // Compute total_charges if not provided
    if (!data.total_charges && data.tenure_months && data.monthly_charge) {
      data.total_charges = +(data.tenure_months * data.monthly_charge).toFixed(2);
    }

    // Simple heuristic risk score if not provided
    if (data.risk_score === undefined || data.risk_score === null) {
      data.risk_score = this._computeRisk(data);
    }

    return repo.create(data);
  }

  async updateCustomer(id, data) {
    await this.getCustomer(id);           // throws 404 if not found

    if (data.email) {
      const existing = await repo.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw Object.assign(new Error('Email already in use'), { status: 409 });
      }
    }

    return repo.update(id, data);
  }

  async deleteCustomer(id) {
    await this.getCustomer(id);
    return repo.delete(id);
  }

  async getAnalytics() {
    const [summary, regional, plans, risk] = await Promise.all([
      repo.getSummary(),
      repo.getRegionalBreakdown(),
      repo.getPlanDistribution(),
      repo.getRiskDistribution(),
    ]);
    return { summary, regional, plans, risk };
  }

  // ---------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------

  /**
   * Naive risk heuristic — replaces ML model in this demo.
   * High risk if: short tenure + high charge, or already churn-flagged.
   */
  _computeRisk({ tenure_months = 0, monthly_charge = 0, churn = 0 }) {
    if (churn) return 0.95;
    let score = 0;
    if (tenure_months  <=  3) score += 0.40;
    else if (tenure_months <= 12) score += 0.20;
    if (monthly_charge >= 80) score += 0.25;
    else if (monthly_charge >= 50) score += 0.10;
    return Math.min(parseFloat(score.toFixed(4)), 1);
  }
}

module.exports = new CustomerService();

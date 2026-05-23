'use strict';

/**
 * Customer — Domain model with validation and serialisation.
 * OOP design pattern: encapsulates business rules inside the class.
 */
class Customer {
  constructor({
    id = null,
    name,
    email,
    phone = null,
    region = 'Central',
    plan = 'Basic',
    tenure_months = 0,
    monthly_charge = 0,
    total_charges = 0,
    churn = 0,
    risk_score = 0,
    created_at = null,
    updated_at = null,
  }) {
    this.id             = id;
    this.name           = String(name).trim();
    this.email          = String(email).trim().toLowerCase();
    this.phone          = phone  ? String(phone).trim() : null;
    this.region         = region;
    this.plan           = plan;
    this.tenure_months  = Number(tenure_months);
    this.monthly_charge = parseFloat(monthly_charge);
    this.total_charges  = parseFloat(total_charges);
    this.churn          = Boolean(churn);
    this.risk_score     = parseFloat(risk_score);
    this.created_at     = created_at;
    this.updated_at     = updated_at;
  }

  /** Risk classification for the UI badge */
  get riskLabel() {
    if (this.risk_score >= 0.75) return 'Critical';
    if (this.risk_score >= 0.60) return 'High';
    if (this.risk_score >= 0.40) return 'Medium';
    return 'Low';
  }

  /** Serialise for API responses */
  toJSON() {
    return {
      id:             this.id,
      name:           this.name,
      email:          this.email,
      phone:          this.phone,
      region:         this.region,
      plan:           this.plan,
      tenure_months:  this.tenure_months,
      monthly_charge: this.monthly_charge,
      total_charges:  this.total_charges,
      churn:          this.churn,
      risk_score:     this.risk_score,
      risk_label:     this.riskLabel,
      created_at:     this.created_at,
      updated_at:     this.updated_at,
    };
  }

  /** Factory from raw DB row */
  static fromRow(row) {
    return new Customer(row);
  }
}

module.exports = Customer;

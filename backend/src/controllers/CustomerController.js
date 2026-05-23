'use strict';

const service = require('../services/CustomerService');

class CustomerController {

  async list(req, res, next) {
    try {
      const result = await service.listCustomers(req.query);
      res.json({ success: true, ...result });
    } catch (e) { next(e); }
  }

  async get(req, res, next) {
    try {
      const customer = await service.getCustomer(Number(req.params.id));
      res.json({ success: true, data: customer });
    } catch (e) { next(e); }
  }

  async create(req, res, next) {
    try {
      const customer = await service.createCustomer(req.body);
      res.status(201).json({ success: true, data: customer });
    } catch (e) { next(e); }
  }

  async update(req, res, next) {
    try {
      const customer = await service.updateCustomer(Number(req.params.id), req.body);
      res.json({ success: true, data: customer });
    } catch (e) { next(e); }
  }

  async remove(req, res, next) {
    try {
      await service.deleteCustomer(Number(req.params.id));
      res.json({ success: true, message: 'Customer deleted' });
    } catch (e) { next(e); }
  }

  async analytics(req, res, next) {
    try {
      const data = await service.getAnalytics();
      res.json({ success: true, data });
    } catch (e) { next(e); }
  }
}

module.exports = new CustomerController();

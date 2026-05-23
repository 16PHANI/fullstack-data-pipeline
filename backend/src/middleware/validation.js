'use strict';

const { body, query, param, validationResult } = require('express-validator');

// ----------------------------------------------------------------
// Helper — centralised validation error response
// ----------------------------------------------------------------
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ----------------------------------------------------------------
// Customer create rules
// ----------------------------------------------------------------
const customerCreateRules = [
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 120 }).withMessage('Name max 120 chars'),
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('phone')
    .optional().isMobilePhone().withMessage('Invalid phone number'),
  body('region')
    .optional()
    .isIn(['North','South','East','West','Central'])
    .withMessage('Region must be North/South/East/West/Central'),
  body('plan')
    .optional()
    .isIn(['Basic','Standard','Premium'])
    .withMessage('Plan must be Basic/Standard/Premium'),
  body('tenure_months')
    .optional().isInt({ min: 0 }).withMessage('tenure_months must be >= 0'),
  body('monthly_charge')
    .optional().isFloat({ min: 0 }).withMessage('monthly_charge must be >= 0'),
  body('total_charges')
    .optional().isFloat({ min: 0 }).withMessage('total_charges must be >= 0'),
  body('churn')
    .optional().isBoolean().withMessage('churn must be boolean'),
  body('risk_score')
    .optional().isFloat({ min: 0, max: 1 }).withMessage('risk_score must be 0-1'),
  validate,
];

// ----------------------------------------------------------------
// Customer update rules (all fields optional)
// ----------------------------------------------------------------
const customerUpdateRules = [
  body('name')
    .optional().trim().notEmpty()
    .isLength({ max: 120 }),
  body('email')
    .optional().trim().isEmail().normalizeEmail(),
  body('phone')
    .optional({ nullable: true }).isMobilePhone(),
  body('region')
    .optional().isIn(['North','South','East','West','Central']),
  body('plan')
    .optional().isIn(['Basic','Standard','Premium']),
  body('tenure_months')
    .optional().isInt({ min: 0 }),
  body('monthly_charge')
    .optional().isFloat({ min: 0 }),
  body('total_charges')
    .optional().isFloat({ min: 0 }),
  body('churn')
    .optional().isBoolean(),
  body('risk_score')
    .optional().isFloat({ min: 0, max: 1 }),
  validate,
];

// ----------------------------------------------------------------
// List query rules
// ----------------------------------------------------------------
const listQueryRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('region').optional().isIn(['North','South','East','West','Central']),
  query('plan').optional().isIn(['Basic','Standard','Premium']),
  query('churn').optional().isIn(['0','1']),
  query('search').optional().isString().isLength({ max: 100 }),
  validate,
];

const idParamRule = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  validate,
];

module.exports = {
  customerCreateRules,
  customerUpdateRules,
  listQueryRules,
  idParamRule,
};

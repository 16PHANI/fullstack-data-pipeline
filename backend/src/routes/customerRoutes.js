'use strict';

const { Router }                                              = require('express');
const ctrl                                                    = require('../controllers/CustomerController');
const { customerCreateRules, customerUpdateRules,
        listQueryRules, idParamRule }                         = require('../middleware/validation');

const router = Router();

// GET  /api/customers/analytics   — analytics summary
router.get('/analytics', ctrl.analytics.bind(ctrl));

// GET  /api/customers             — paginated list
router.get('/', listQueryRules, ctrl.list.bind(ctrl));

// GET  /api/customers/:id
router.get('/:id', idParamRule, ctrl.get.bind(ctrl));

// POST /api/customers
router.post('/', customerCreateRules, ctrl.create.bind(ctrl));

// PUT  /api/customers/:id
router.put('/:id', [...idParamRule, ...customerUpdateRules], ctrl.update.bind(ctrl));

// DELETE /api/customers/:id
router.delete('/:id', idParamRule, ctrl.remove.bind(ctrl));

module.exports = router;

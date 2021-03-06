var express = require('express');
var router = express.Router();
var controller = require('../controllers/admin.controller')

router.get('/', controller.showAdmin)
router.post('/login', controller.loginAdmin)
router.put('/update', controller.updateAdmin)
router.put('/changePassword', controller.changePassAdmin)
module.exports = router;
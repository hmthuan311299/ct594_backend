var express = require('express');
var router = express.Router();
var controller = require('../controllers/recommendedPlace.controller');
const multer  = require('multer')
var dirName = "src/public"
const upload  = multer({ dest: dirName + '/tourPicture'})

router.get('/', controller.getAllRecomendedPlace)
router.get('/getById/:recommendId', controller.getRecomendedPlaceById)
router.post('/add', upload.single('avatar'), controller.addRecomendedPlace)
router.delete('/delete/:recommendId', controller.deleteRecomendedPlace)
module.exports = router;
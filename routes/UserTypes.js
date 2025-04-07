
const express = require('express')
const router = express.Router();
const { getUserTypes, getUserTypesById, createUserTypes,
    updateUserTypes, deleteUserTypes,paginate,search} =require('../controllers/Api/UserTypesController.js')
router.route('/').get(getUserTypes).post(createUserTypes)
router.route('/paginate').post(paginate)
router.route('/search').post(search)
router.route('/:id').get(getUserTypesById).put(updateUserTypes).delete(deleteUserTypes);
module.exports = router;


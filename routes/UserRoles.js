
const express = require('express')
const router = express.Router();
const { getUserRoles, getUserRolesById, createUserRoles,
    updateUserRoles, deleteUserRoles,pagination,search} =require('../controllers/Api/UserRolesController.js')
router.route('/').get(getUserRoles).post(createUserRoles)
router.route('/pagination').post(pagination)
router.route('/search').post(search)
router.route('/:id').get(getUserRolesById).put(updateUserRoles).delete(deleteUserRoles);
module.exports = router;


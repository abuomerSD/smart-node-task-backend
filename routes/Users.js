const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUsersById,
  createUsers,
  updateUsers,
  deleteUsers,
  paginate,
  search,
  login,
  marketingTeamMemberLogin,
  forgetPasswordEmail,
  forgetPasswordVerfiyCode,
  forgetPasswordSetNewPass,
  createAdminUser,
  updateUsersWithRoles,
  updateUserPass,
  adminLogin,
  posHubLogin,
  getSubscriptions,
  createPosManager,
  UpdatePosManager,
  searchSubscriptions,
  getUserProfile,
  resetPass
} = require("../controllers/Api/UsersController.js");
router.route("/").get(getUsers).post(createUsers);
router.route("/paginate").post(paginate);
router.route("/search").post(search);
router.route("/admin").post(createAdminUser);
router.route("/pos-manager").post(createPosManager);
router.route("/update").post(updateUsersWithRoles);
router.route("/update-pos-manager").post(UpdatePosManager);
router.route("/login").post(login);
router.route("/admin-login").post(adminLogin);
router.route("/pos-hub-login").post(posHubLogin);
router.route("/login-marketing-team").post(marketingTeamMemberLogin);
router.route("/forget-password/email").post(forgetPasswordEmail);
router.route("/forget-password/verfiy-code").post(forgetPasswordVerfiyCode);
router.route("/forget-password/reset-password").post(forgetPasswordSetNewPass);
router.route("/update-password").post(updateUserPass);
router.route("/get-subscriptions").get(getSubscriptions);
router.route("/search-subscriptions").get(searchSubscriptions);
router.route('/profile').get(getUserProfile)
router.route('/reset-pass').post(resetPass)


router.route("/:id").get(getUsersById).put(updateUsers).delete(deleteUsers);
module.exports = router;

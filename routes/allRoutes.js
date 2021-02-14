var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');
var app_controller = require('../controllers/appController');
var form_controller = require('../controllers/formController');

//middleware
var md_auth = require('../middlewares/authenticate');
var md_admin = require('../middlewares/is_admin');

/// USER ROUTES ///

// POST request for creating User.
router.post('/newUser', user_controller.user_create_post);

// POST request for login User.
router.post('/login', user_controller.user_login);

// PUT request to update User.
router.put('/updateUser/:user_id',  [md_auth.ensureAuth, md_admin.isAdmin], user_controller.user_update_put);

// DELETE request to delete User.
router.delete('/deleteUser/:user_id', [md_auth.ensureAuth, md_admin.isAdmin], user_controller.user_delete);

// GET request for list all Users.
router.get('/allUsers', /*[md_auth.ensureAuth, md_admin.isAdmin],*/ user_controller.user_list);

// PUT request to update list_recommend apps
router.put('/update_recommend/:user_id/:app_appId', md_auth.ensureAuth, user_controller.user_update_recommend);

// PUT request to update list_removed apps
router.put('/update_removed/:user_id/:app_appId', md_auth.ensureAuth, user_controller.user_update_removed);

// PUT request to update list_assigned apps
router.put('/update_assigned/:user_id/:app_appId', md_auth.ensureAuth, user_controller.user_update_assigned);

// DELETE request to update list_assigned apps
router.delete('/remove_assigned/:user_id/:app_appId', user_controller.user_remove_assigned);



/// APP ROUTES ///

// GET request to return accepted apps.
router.get('/apps/system/accept', md_auth.ensureAuth, app_controller.getSystemAccept);

// POST request to add an app to system_apps_accept collection.
router.post('/system_apps_accept/:app_appId', md_auth.ensureAuth, app_controller.post_system_apps_accept);

// GET request to return removed apps.
router.get('/apps/system/remove', md_auth.ensureAuth, app_controller.getSystemRemove);

// POST request to add an app to system_apps_remove collection.
router.post('/system_apps_remove/:app_appId', md_auth.ensureAuth, app_controller.post_system_apps_remove);

// GET request to return reviewed accepted apps.
router.get('/apps/review/accept', md_auth.ensureAuth, app_controller.getReviewAccept);

//  POST request to add an app to apps_review_accept collection.
router.post('/apps_review_accept/:app_appId', md_auth.ensureAuth, app_controller.post_apps_review_accept);

// DELETE request to remove app from the review accept list
router.delete('/deleteApp/apps_review_accept/:app_appId', md_auth.ensureAuth, app_controller.delete_review_accept);

// GET request to return reviewed removed apps.
router.get('/apps/review/remove', md_auth.ensureAuth, app_controller.getReviewRemove);

//  POST request to add an app to apps_review_remove collection.
router.post('/apps_review_remove/:app_appId', md_auth.ensureAuth, app_controller.post_apps_review_remove);

// DELETE request to remove app from the review remove list
router.delete('/deleteApp/apps_review_remove/:app_appId', md_auth.ensureAuth, app_controller.delete_review_remove);

// GET request to return final accepted apps.
router.get('/apps/apps_accepted', md_auth.ensureAuth, app_controller.getFinalAccept);

//  POST request to add an app to apps_accepted collection.
router.post('/apps_accepted/:app_appId', md_auth.ensureAuth, app_controller.post_apps_accepted);

// DELETE request to remove app from the final accept list
router.delete('/deleteApp/apps_accepted/:app_appId', [md_auth.ensureAuth, md_admin.isAdmin], app_controller.delete_final_accept);

// GET request to return final removed apps.
router.get('/apps/apps_removed', md_auth.ensureAuth, app_controller.getFinalRemove);

//  POST request to add an app to apps_removed collection.
router.post('/apps_removed/:app_appId', md_auth.ensureAuth, app_controller.post_apps_removed);

// DELETE request to remove app from the final remove list
router.delete('/deleteApp/apps_removed/:app_appId', [md_auth.ensureAuth, md_admin.isAdmin], app_controller.delete_final_remove);



/// FORM ROUTES ///

// GET request to return forms.
router.get('/forms', [md_auth.ensureAuth, md_admin.isAdmin], form_controller.getForms);

// POST request to add a new form.
router.post('/forms', form_controller.createForm);


module.exports = router;

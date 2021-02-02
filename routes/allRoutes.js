var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');
var app_controller = require('../controllers/appController');
var form_controller = require('../controllers/formController');

/// USER ROUTES ///

// POST request for creating User.
router.post('/api/db/newUser', user_controller.user_create_post);

// DELETE request to delete User.
router.delete('/api/db/deleteUser/:user_uid', user_controller.user_delete);

// PUT request to update User.
router.put('/api/db/updateUser/:user_uid', user_controller.user_update_put);

// GET request for list all Users.
router.get('/api/db/allUsers', user_controller.user_list);

// PUT request to update list_recommend apps
router.put('/api/db/update_recommend/:user_uid/:app_appId', user_controller.user_update_recommend);

// PUT request to update list_removed apps
router.put('/api/db/update_removed/:user_uid/:app_appId', user_controller.user_update_removed);

// PUT request to update list_assigned apps
router.put('/api/db/update_assigned/:user_uid/:app_appId', user_controller.user_update_assigned);

// DELETE request to update list_assigned apps
//router.delete('/api/db/remove_assigned/:user_uid/:app_appId', user_controller.user_remove_assigned);



/// APP ROUTES ///

// GET request to return accepted apps.
router.get('/api/db/apps/system/accept', app_controller.getSystemAccept);

// POST request to add an app to system_apps_accept collection.
router.post('/api/db/system_apps_accept/:app_appId', app_controller.post_system_apps_accept);

// GET request to return removed apps.
router.get('/api/db/apps/system/remove', app_controller.getSystemRemove);

// POST request to add an app to system_apps_remove collection.
router.post('/api/db/system_apps_remove/:app_appId', app_controller.post_system_apps_remove);

// GET request to return reviewed accepted apps.
router.get('/api/db/apps/review/accept', app_controller.getReviewAccept);

//  POST request to add an app to apps_review_accept collection.
router.post('/api/db/apps_review_accept/:app_appId', app_controller.post_apps_review_accept);

// DELETE request to remove app from the review accept list
router.delete('/api/db/deleteApp/apps_review_accept/:app_appId', app_controller.delete_review_accept);

// GET request to return reviewed removed apps.
router.get('/api/db/apps/review/remove', app_controller.getReviewRemove);

//  POST request to add an app to apps_review_remove collection.
router.post('/api/db/apps_review_remove/:app_appId', app_controller.post_apps_review_remove);

// DELETE request to remove app from the review remove list
router.delete('/api/db/deleteApp/apps_review_remove/:app_appId', app_controller.delete_review_remove);

// GET request to return final accepted apps.
router.get('/api/db/apps/apps_accepted', app_controller.getFinalAccept);

//  POST request to add an app to apps_accepted collection.
router.post('/api/db/apps_accepted/:app_appId', app_controller.post_apps_accepted);

// DELETE request to remove app from the final accept list
router.delete('/api/db/deleteApp/apps_accepted/:app_appId', app_controller.delete_final_accept);

// GET request to return final removed apps.
router.get('/api/db/apps/apps_removed', app_controller.getFinalRemove);

//  POST request to add an app to apps_removed collection.
router.post('/api/db/apps_removed/:app_appId', app_controller.post_apps_removed);

// DELETE request to remove app from the final remove list
router.delete('/api/db/deleteApp/apps_removed/:app_appId', app_controller.delete_final_remove);



/// FORM ROUTES ///

// GET request to return forms.
router.get('/api/forms', form_controller.getForms);

// POST request to add a new form.
router.post('/api/forms', form_controller.createForm);

//router.get('/patient', form_controller.getPatient);


module.exports = router;

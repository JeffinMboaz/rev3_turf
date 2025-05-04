//routes/userroutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/middleware');
const authorizeRole = require('../middleware/authorizeRole')
const { registerAs,login,logout,getUserProfile,updateUserProfile } = require('../controllers/userauth');
const {addTurfWithEvents,addEventsToTurf, getEventsByTurf,
    updateTurfEvent,updateTurf,deleteTurfEvent,deleteTurfAndEvents, getAllTurfs }=require("../controllers/turfController");
const {bookTurf,cancelBooking,getUserBookings}=require('../controllers/bookingController');
const { ReviewRating,deleteReview,getReviews}= require('../controllers/reviewController');
const {getTurfsByAdmin,deleteUser,deleteManager}= require('../controllers/adminController');



// Registration route for user,manager,admin
router.post('/registeras', registerAs);
router.post('/login', login); //login for user,manager,admin
router.post('/logout', logout);//login for user,manager,admin
router.get('/getprofile',authenticateToken,getUserProfile)//getprofile of user,manager,admin
router.put('/updateprofile',authenticateToken,updateUserProfile)//updateprofile of user,manager,admin

//add Turf and event only by manager and admin
router.post('/addturf',authenticateToken,authorizeRole('Admin', 'Manager'),addTurfWithEvents);
router.post('/addevent/:turfId',authenticateToken,addEventsToTurf);//addevents to existing turf
router.get('/getevents/:turfId',authenticateToken,getEventsByTurf);//get events of turf
router.get('/allturf',authenticateToken,getAllTurfs );//getall turf
router.patch('/upturf-event/:turfId/:eventId',updateTurfEvent);//update turf and events
router.patch('/upturf/:turfId',authenticateToken,updateTurf);//update turf 
router.delete("/delturfevent/:turfId/:eventId",authenticateToken,deleteTurfEvent);//delete an event 
router.delete("/delturf/:turfId",authenticateToken, deleteTurfAndEvents);//delete a turf and all events

router.get('/allturfs',getAllTurfs );//getall turf

//bookings 
router.post('/book',authenticateToken,bookTurf);//booktuturf
router.delete('/cancelbooking/:bookingId',authenticateToken,cancelBooking);//cancelbooking
router.get('/userbookings',authenticateToken,getUserBookings);//booktuturf


//review and rating
router.post('/ratereview',authenticateToken,ReviewRating);
router.delete("/delreview/:id", authenticateToken, deleteReview);
router.get("/getreviews", authenticateToken, getReviews);

//admin controller
router.get('/getallturf',authenticateToken,authorizeRole('Admin'),getTurfsByAdmin);
router.post('/addturf',authenticateToken,authorizeRole('Admin'),addTurfWithEvents);
router.post('/addevent/:turfId',authenticateToken,authorizeRole('Admin'),addEventsToTurf);//addevents to existing turf
router.get('/getevents/:turfId',authenticateToken,authorizeRole('Admin'),getEventsByTurf);//get events of turf
router.patch('/upturf-event/:turfId/:eventId',authorizeRole('Admin'),updateTurfEvent);//update turf and events
router.patch('/upturf/:turfId',authenticateToken,authorizeRole('Admin'),updateTurf);//update turf 
router.delete("/delturfevent/:turfId/:eventId",authenticateToken,authorizeRole('Admin'),deleteTurfEvent);//delete an event 
router.delete("/delturf/:turfId",authenticateToken,authorizeRole('Admin'),deleteTurfAndEvents);//delete a turf and all events
router.post('/admbook',authenticateToken,authorizeRole('Admin'),bookTurf);//booktuturf
router.delete('/admcancelbook/:bookingId',authenticateToken,authorizeRole('Admin'),cancelBooking);//cancelbooking
router.delete("/admdelreview/:id", authenticateToken,authorizeRole('Admin'),deleteReview);

router.post('/admregisteras',authenticateToken,authorizeRole('Admin'), registerAs);
router.delete('/deluser/:id',authenticateToken,authorizeRole('Admin'), deleteUser);
router.delete('/delmanager/:id',authenticateToken,authorizeRole('Admin'), deleteManager);

// payment 
 



  



module.exports = router; 
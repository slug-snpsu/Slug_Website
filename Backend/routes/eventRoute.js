const express = require("express");
const { getAllEventsController, registrationForEventController, registrationCancelForEventController, addEventController, updateEventController, deleteEventController
    ,getAllUserDataWhoAreRegisteredForParticularEventController
} = require("../controllers/eventController");
const { verifyToken } = require("../util/JWT.Token"); 
const upload = require("../middleware/multer")
const router = express.Router();


// for user and admin [Getting all events]
router.get("/getAllEvents",getAllEventsController);


//user registration
router.put("/registerForEvents/:event_id",verifyToken,registrationForEventController);


//Cancel registration
router.put("/registerCancelForEvents/:event_id",verifyToken,registrationCancelForEventController);


//for admin [ adding events ]
router.post("/addEvents",verifyToken,upload.single("eventImage"),addEventController);


//for admin [ Updating events ]
router.put("/updateEvents",verifyToken,updateEventController)


//for admin [ deleting events ]
router.delete("/deleteEvents/:_id",verifyToken,deleteEventController);




router.get("/getAllParticipantsData/:_id",verifyToken,getAllUserDataWhoAreRegisteredForParticularEventController)
module.exports = router;
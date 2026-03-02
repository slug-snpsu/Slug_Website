const USER = require("../models/user");
const EVENT = require("../models/events");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");


// for user to get all events
const getAllEventsController = async (req, res) => {

    try {
        const getAllEvents = await EVENT.find().populate("eventCreatedBy", "name email");

        if (getAllEvents.length === 0) {
            return res.status(400).json({ status: false, message: "No events exists" });
        }

        return res.status(200).json({ status: true, message: "Events fetched successfully", allEvents: getAllEvents });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Server error" });
    }
}



const registrationForEventController = async (req, res) => {
    const event_id = req.params.event_id;
    const user_id = req.user._id;


    if (!user_id) {
        return res.status(400), json({ status: false, message: "All fields are require" });
    }

    try {
        const userData = await USER.findById(user_id);
        if (!userData) {
            return res.status(404).json({ status: false, message: "Account not found" });
        }

        const updateRegration = await EVENT.findByIdAndUpdate(event_id, { $addToSet: { eventParticipantsList: user_id } }, { returnDocument: "after", runValidators: true });

        if (!updateRegration) {
            return res.status(400).json({ status: false, message: "Failed to Register." });
        }

        return res.status(200).json({ status: true, message: "Register Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server error." });
    }
}



const registrationCancelForEventController = async (req, res) => {
    const event_id = req.params.event_id;
    const user_id = req.user._id;

    if (!user_id) {
        return res.status(400).json({status: false,message: "User ID is required",
        });
    }

    try {
        const userData = await USER.findById(user_id);
        if (!userData) {
            return res.status(404).json({status: false,message: "Account not found",
            });
        }

        const updatedRegistrationCancel = await EVENT.findByIdAndUpdate(event_id,{ $pull: { eventParticipantsList: user_id } },{ new: true, runValidators: true }
        );

        if (!updatedRegistrationCancel) {
            return res.status(400).json({status: false,message: "Failed to cancel registration.",
            });
        }

        console.log(updatedRegistrationCancel);
        return res.status(200).json({status: true,message: "Registration cancelled successfully.",});

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false,message: "Server error."});
    }
};

// only for admin adding events
const addEventController = async (req, res) => {
    const { eventTitle, eventDescription, eventStartDate, eventEndDate, eventMaxParticipants, eventLocation, eventCreatedBy, eventMode } = req.body;
    const eventImage = req.file;


    if (!eventImage || !eventTitle || !eventDescription || !eventStartDate || !eventEndDate || !eventMaxParticipants || !eventLocation || !eventCreatedBy) {
        return res.status(400).json({ status: false, message: "All fields are required." });
    }


    try {
        const isPublisherAdmin = await USER.findById(eventCreatedBy);
        if (!isPublisherAdmin) {
            return res.status(404).json({ status: false, message: "Account Not Found." });
        }
        if (isPublisherAdmin.role !== process.env.ADMIN_STRING) {
            return res.status(400).json({ status: false, message: "You are not admin." });
        }

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(eventImage.path, {
            folder: "events",
        });

        if (!uploadResult) { return res.status(400).json({ status: false, message: "failed to upload image" }) }

        // Delete local file after upload
        fs.unlinkSync(eventImage.path);

        const addEvent = await EVENT.create({ eventImage: uploadResult.secure_url, eventTitle, eventDescription, eventStartDate, eventEndDate, eventMaxParticipants, eventLocation, eventCreatedBy, eventMode });

        if (!addEvent) {
            return res.status(400).json({ status: false, message: "Failed to add." });
        }

        return res.status(201).json({ status: true, message: "Event Added Successfully.", addEvent });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Server error" });
    }
}



// only for admin updating events
const updateEventController = async (req, res) => {

    const updatedData = req.body;

    try {
        const isPublisherAdmin = await USER.findById(updatedData.eventCreatedBy);
        if (!isPublisherAdmin) {
            return res.status(404).json({ status: false, message: "Account Not Found." });
        }
        if (isPublisherAdmin.role !== process.env.ADMIN_STRING) {
            return res.status(400).json({ status: false, message: "You are not admin." });
        }

        const updatedEvent = await EVENT.findByIdAndUpdate(updatedData._id, updatedData, { returnDocument: "after", runValidators: true });
        if (!updatedEvent) {
            return res.status(400).json({ status: false, message: "Failed to Update." });
        }
        return res.status(200).json({ status: true, message: "Successfully Updated", updatedEvent: updatedEvent });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error" });
    }
}




// only for admin deleting events
const deleteEventController = async (req, res) => {
    const event_id = req.params._id;
    const remover_id = req.user._id;

    if (!event_id) {
        return res.status(400).json({ status: false, message: "Didn't receive Event id." });
    }

    try {
        const isPublisherAdmin = await USER.findById(remover_id);
        if (!isPublisherAdmin) {
            return res.status(404).json({ status: false, message: "Account Not Found." });
        }
        if (isPublisherAdmin.role !== process.env.ADMIN_STRING) {
            return res.status(400).json({ status: false, message: "You are not admin." });
        }

        const deleteEvent = await EVENT.findByIdAndDelete(event_id);

        if (!deleteEvent) {
            return res.status(404).json({ status: false, message: "Event Not Found." });
        }

        return res.json({ status: true, message: "Successfully deleted." }).status(204);
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error" });
    }
}



module.exports = {
    getAllEventsController,
    registrationForEventController,
    registrationCancelForEventController,
    addEventController,
    updateEventController,
    deleteEventController
}
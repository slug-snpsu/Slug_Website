const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

    eventImage:{
        type:String,
    },

    eventTitle: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
    },

    eventDescription: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000,
    },

    eventCategory:{
        type:String,
        required: true,
        trim: true,
        minlength: 3,
        enum:["Hackthon","Session","Work shop"]
    },
    eventStartDate: {
        type: Date,
        required: true,
    },

    eventEndDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= this.eventStartDate;
            },
            message: "End date must be after start date."
        }
    },

    eventParticipantsList: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],

    eventMaxParticipants: {
        type: Number,
        required: true,
    },

    eventLocation: {
        type: String,
        trim: true,
        required: true,
    },

    isEventActive: {
        type: Boolean,
        default: true,
    },

    eventCreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    eventMode:{
        type:String,
        enum:["Online","Offline"],
        default:"Offline"
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model("Event", eventSchema);
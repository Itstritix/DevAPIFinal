const mongoose = require('mongoose');

const STATUS = {
    AVAILABLE: 'available',
    BORROWED: 'borrowed',
    PLAYING: 'playing'
}

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 20
    },
    description: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    originalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(STATUS),
        default: STATUS.AVAILABLE
    },
    temperature: {
        type: Number,
        required: true,
        default: 0
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
}, {timestamps: true});

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;
const mongoose = require('mongoose');

const STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
}

const CATEGORY = {
    HIGH_TECH: "high-tech",
    MAISON: "maison",
    MODE: "mode", 
    LOISIRS: "loisirs", 
    AUTRE: "autre"
}

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500,
        lowercase: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(CATEGORY)
    },
    originalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    url: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(STATUS),
        default: STATUS.PENDING
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
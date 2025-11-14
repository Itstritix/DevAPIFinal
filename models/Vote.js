const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        maxlength: 1500
    },
    dealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {timestamps: true});

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;
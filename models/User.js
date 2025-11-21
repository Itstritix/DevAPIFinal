const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const ROLES = {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin'
};

const ROLE_HIERARCHY = {
    [ROLES.USER]: 1,
    [ROLES.MODERATOR]: 2,
    [ROLES.ADMIN]: 3
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: [/^[a-zA-Z0-9]+$/, 'Le nom d’utilisateur doit être alphanumérique uniquement.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide.']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.USER
    },
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if(!this.modifiedPaths('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password =  await bcrypt.hash(this.password, salt);
        next();
    }catch (error) {
        return next(error);
    }

});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
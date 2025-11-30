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
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
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

userSchema.methods.hasRole = function(requiredRole) {
    const userLevel = ROLE_HIERARCHY[this.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
}

userSchema.statics.ROLES = ROLES;
userSchema.statics.ROLE_HIERARCHY = ROLE_HIERARCHY;

const User = mongoose.model('User', userSchema);
module.exports = User;
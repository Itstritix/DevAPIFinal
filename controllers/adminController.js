const { AppError } = require("../utils/error");
const Deal = require("../models/Deal");
const User = require("../models/User");



const pendingDealsController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;
        const deals = await Deal.find({status: 'pending'}).skip(skip).limit(limit);
        const total = await Deal.countDocuments({status: 'pending'});

        res.status(200).json({
            data: deals,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const moderateDealsController = async (req, res, next) => {
    const id = req.params.id;
    const { status } = req.body;

    if (status !== "approved" && status !== "rejected") {
        return res.status(400).json({
            message: "You have to choose to approve or reject the deal."
        })
    }

    const deal = await Deal.findById(id);
    if (!deal) {
        return res.status(400).json({
            message: "This deal doesn't exists."
        })
    }

    if (deal.status !== 'pending') {
        return res.status(401).json({
            message: "This deal isn't pending for approvement."
        });
    }

    deal.status = status;
    await deal.save();

    return res.status(200).json({
        message: "This deal has been "+status
    })
}

const userListController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;
        const users = await User.find().skip(skip).limit(limit);
        const total = await User.countDocuments();

        res.status(200).json({
            data: users,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
}

const userRoleController = async (req, res, next) => {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({
            message: "Please select a proper role."
        })
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({
            message: "User doesn't exists."
        })
    }

    switch (role) {
        case "moderator":
        user.role = User.ROLES.MODERATOR;
        break;
        case "admin":
        user.role = User.ROLES.ADMIN;
        break;
        default:
        user.role = User.ROLES.USER;
    }

    await user.save();
    
    return res.status(200).json({
        message: "User role has been set."
    })

}

module.exports = {
    pendingDealsController,
    moderateDealsController,
    userListController,
    userRoleController
}
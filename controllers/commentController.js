const { AppError } = require("../utils/error");
const Comment = require("../models/Comment");
const Deal = require("../models/Deal");

const commentController = async (req, res, next) => {
    const dealId = req.params.dealId;
    const deal = await Deal.findById(dealId);
    if (!deal) {
        throw new AppError("Deal not found", 404);
    }

    const comments = await Comment.find({ dealId: dealId })
        .populate('authorId', 'username')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        comments
    });
}

const createCommentController = async (req, res, next) => {
    const { content } = req.body;
    const dealId = req.params.dealId;
    const deal = await Deal.findById(dealId);
    if (!deal) {
        throw new AppError("Deal not found", 404);
    }
    const newComment = await Comment.create({
        content,
        dealId,
        authorId: req.user._id
    });

    const populated = await Comment.findById(newComment._id)
        .populate("authorId", "username");

    res.status(201).json({
        message: "Comment created successfully",
        data: populated
    });
};

const updateCommentController = async (req, res, next) => {
    const comment = req.ressource;
    const { content } = req.body;

    if (!content) {
        throw new AppError("The field content is required", 400);
    }

    comment.content = content;

    const updateComment = await comment.save();

    const populated = await Comment.findById(updateComment._id)
    .populate("authorId", "username");

    res.status(200).json({
        message: "Comment updated successfully",
        data: populated
    });
}

const deleteCommentController = async (req, res, next) => {
    try {
        const comment = req.ressource;

        await comment.deleteOne();

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { 
    commentController, 
    createCommentController, 
    updateCommentController, 
    deleteCommentController 
};
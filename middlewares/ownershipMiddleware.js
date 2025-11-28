const { AppError } = require('../utils/error');


const ownershipMiddleware = (Model, { authorField = "authorId", ressourceKey = "ressource" } = {} ) => { if (!Model) {
    throw new AppError("Model is required for ownerMiddleware");
}

return async (req, res, next) => {
    try {
        const ressourceId = req.params.id;
        const ressource = await Model.findById(ressourceId);

        if (!ressource) {
            throw new AppError("Ressources not found", 404);
        }

        const authorId = ressource[authorField];
        const isOwner = authorId && authorId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            throw new AppError("You are not allowed to access this ressource", 403);
        }

        req[ressourceKey] = ressource;
        next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    ownershipMiddleware
};
const Deal = require("../models/Deal");
const Vote = require("../models/Vote")
const { AppError } = require("../utils/error");

const dealController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;
        const deals = await Deal.find({status: 'approved'}).skip(skip).limit(limit);
        const total = await Deal.countDocuments({status: 'approved'});

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

const createDealController = async (req, res, next) => {
    console.log("Creation product with data:", req.body);
    const { title, description, price, category, status } = req.body;
    if (!title || !description || !price || !category) {
        throw new AppError("All fields are required", 400);
    }
    const newDeal = new Deal({
        title,
        description,
        price,
        originalPrice: price,
        category,
        authorId: req.user._id,
        status: status || 'pending'
    });
    newDeal.url = "http://localhost:3000/api/deals/" + newDeal._id;
    const savedDeal = await newDeal.save();
    res.status(201).json({
            message: "Deal created successfully",
            deal: savedDeal
    });
};

const updateDealController = async (req, res, next) => {
    const deal = req.ressource;
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category) {
        throw new AppError("All fields are required", 400);
    }

    if (deal.status !== "pending") {
        throw new AppError("Only pending deals can be updated", 403);
    }

    deal.title = title;
    deal.description = description;
    deal.price = price;
    deal.category = category;
    

    const updateDeal = await deal.save();

    res.status(200).json({
        message: "Deal updated successfully",
        deal: updateDeal
    });
}

const dealSearchController = async (req, res, next) => {
    const q = req.query.q;

    const deals = await Deal.find({$or: [{title: {$regex: q}}, {description: {$regex: q}}]})
    

    if (deals.length < 1) {
        return res.status(404).json({
            message: "Deals not found"
        });
    }

    return  res.status(200).json({
        Deals: deals
    });

}

const searchByIdController = async (req, res, next) => {
    const { id } = req.params;
    const deal = await Deal.findById(id)
    .populate('authorId', 'username')
    .populate({
        path: "comments",
        populate: { path: "authorId", select: "username" },
    });

    if (!deal) {
        return res.status(400).json({
            message: "Deal not found"
        })
    }
    
    res.status(200).json({
        deal: deal
    });
}

const deleteDealController = async(req, res, next) => {
    const deal = req.ressource;

    await deal.deleteOne();
    res.status(200).json({
        message: "Ressource deleted"
    })
}

const addVoteController = async(req, res, next) => {
    const dealId = req.params.id;
    const { type } = req.body;

    if (type !== "cold" && type !== "hot") {
        return res.status(400).json({
            message: "The temperature can only be cold or hot"
        });
    }

    const deal = await Deal.findById(dealId);
    if (!deal) {
        return res.status(400).json({
            message: "Deal not found"
        });
    }

    const existingVote = await Vote.findOne({ $and: [{
        authorId: req.user._id,
        dealId: deal._id  
    }]});

    if (existingVote) {
        existingVote.type = type
        await existingVote.save()
    };

    if (!existingVote) {
        const vote = new Vote({
            type: type,
            authorId: req.user._id,
            dealId: deal._id
        })
        await vote.save();
    }   

    const coldVote = await Vote.countDocuments({type: "cold"}, {dealId: deal._id});
    const hotVote = await Vote.countDocuments({type: "hot"}, {dealId: deal._id});

    deal.temperature = hotVote - coldVote;
    await deal.save()

    return res.status(200).json({
        message: "You voted "+ type
    });

}

const deleteVoteController = async(req, res, next) => {
    const dealId = req.params.id;

    const deal = await Deal.findById(dealId);
    if (!deal) {
        return res.status(400).json({
            message: "Deal not found"
        });
    }

    const vote = await Vote.findOne({ $and: [{
        authorId: req.user._id,
        dealId: deal._id  
    }]});

    if (!vote) {
        return res.status(400).json({
            message: "You didn't vote for this deal"
        })
    }

    await vote.deleteOne();
    const coldVote = await Vote.countDocuments({type: "cold"}, {dealId: deal._id});
    const hotVote = await Vote.countDocuments({type: "hot"}, {dealId: deal._id});

    deal.temperature = hotVote - coldVote;
    await deal.save()

    return res.status(200).json({
        message: "Your vote has been removed"
    });

}

module.exports = { 
    dealController, 
    dealSearchController, 
    createDealController, 
    updateDealController, 
    searchByIdController, 
    deleteDealController, 
    addVoteController,
    deleteVoteController
};
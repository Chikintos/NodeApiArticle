

const UserSubscribehandler = asyncHandler(async (req, res, next) => {
    const { authorId } = req.body;
    userId= req.user.id
    if (authorId==userId){
        res.status(400)
        throw new Error("User can`t subscribe by itself")
    }

})


const express = require("express");
const { userRegistration, userLogin, userCurrent, userUpdateInfo, userDelete, userUpdatePassword, userUpdateEmail, userGet, userGetAll } = require("../controller/UserController");
const validateToken = require("../controller/ValidateToken");

const {Loginhandler,Registrationhandler,Updatehandler,Deletehandler, UpdatePasswordhandler, UpdateEmailhandler, GetAllUsershandler, GetUserhandler} = require("../middleware/UserapiHandler");
const {UserSubscribe,isUserFollow, UserUnsubscribe,UserFollowers,UserFollowing} =require("../controller/SubscribeController");
const softValidateToken = require("../controller/softValidateToken");
const router = express.Router();
const upload = require('multer')();


router.post("/register",Registrationhandler,userRegistration)//+
router.post("/login",Loginhandler,userLogin)//+
router.delete("/delete/:id",validateToken,Deletehandler,userDelete)//+

router.get("/current",validateToken,userCurrent)//+

router.put("/update/info/:id",validateToken,Updatehandler,userUpdateInfo)//+
router.put("/update/password/:id",validateToken,UpdatePasswordhandler,userUpdatePassword)//+
router.put("/update/email/:id",validateToken,UpdateEmailhandler,userUpdateEmail)//+

router.get("/getAll",validateToken,GetAllUsershandler,userGetAll)//+
router.get("/get/:id",softValidateToken,GetUserhandler,userGet)//+


router.post("/subscribe",validateToken,UserSubscribe)//+
router.post("/unsubscribe",validateToken,UserUnsubscribe)//+
router.get("/followers/:id",UserFollowers)//+
router.get("/following/:id",UserFollowing)//+
router.get("/follow/:userId/:authId",isUserFollow)//+




module.exports = router

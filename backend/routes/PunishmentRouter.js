
const express = require("express");
const validateToken = require("../controller/ValidateToken");

const { Createhandler, Edithandler,Gethandler, MakeSolvedhandler, GetByAdminhandler, GetByUserhandler, MakeActivehandler } = require("../middleware/PunishmentapiHandler");
const { PunishmentCreate, PunishmentEdit, PunishmentGet, PunishmentSetSolved,UpdatedPunishmentByAdmin, ActivePunishmentGetByAdmin, PunishmentGetByUser, PunishmentSetActive } = require("../controller/punishmentController");
const router = express.Router();



router.post("/create",validateToken,Createhandler,PunishmentCreate)//+
router.put("/update",validateToken,Edithandler,PunishmentEdit)//+
router.get("/get/:id",validateToken,Gethandler,PunishmentGet)//+
router.get("/set/solved/:id",validateToken,MakeSolvedhandler,PunishmentSetSolved)//+
router.get("/set/active/:id",validateToken,MakeActivehandler,PunishmentSetActive)//+

router.get("/get/admins/:id",validateToken,GetByAdminhandler,ActivePunishmentGetByAdmin)//+
router.get("/get/users/:id",validateToken,GetByUserhandler,PunishmentGetByUser)//+

router.get("/edited/admin/:id",validateToken,UpdatedPunishmentByAdmin)//+



module.exports=router
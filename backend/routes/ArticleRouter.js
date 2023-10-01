
const express = require("express");
const { articleCreate, articleGet, articleSearch, articleDelete,articleUpdate } = require("../controller/ArticlesController");
const validateToken = require("../controller/ValidateToken");
const { CreateArticlehandler,articleUpdatehandler, SearchArticlehandler } = require("../middleware/ArticlesapiHandler");
const router = express.Router();



router.post("/create",validateToken,CreateArticlehandler,articleCreate)
router.get("/get/:id",articleGet)
router.delete("/delete/:id",validateToken,articleDelete)
router.put("/update/:id",validateToken,articleUpdatehandler,articleUpdate)
router.get("/search",SearchArticlehandler,articleSearch)

module.exports=router
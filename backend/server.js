const express =require("express");
const { connectDB } = require("./config/dbConnection");
const { syncModels } = require("./models/modelsSync");
const errorHadnler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config()
const path = require("path")
const fileUpload = require("express-fileupload")
const app= express()

const port = process.env.PORT || 5000;

// db
connectDB()
syncModels()

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.static(path.join(__dirname,"static")))
app.use(fileUpload());
// routers
app.use("/api/user",require("./routes/UserRouter"))
app.use("/api/article",require("./routes/ArticleRouter"))
app.use("/api/punishment",require("./routes/PunishmentRouter"))


app.use(errorHadnler)

app.listen(port,()=>{
    console.log(`server run. port ${port}`)
})

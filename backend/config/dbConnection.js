const Sequelize = require("sequelize");
const dotenv = require("dotenv").config()


const db_login=process.env.DB_LOGIN
const db_pass=process.env.DB_PASSWORD

const sequelize = new Sequelize("postgres",db_login,db_pass,{
    dialect:"postgres",
    host:"localhost",
    port:5435
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
module.exports = { sequelize,connectDB };

const { Sequelize, DataTypes } = require('sequelize');
const {sequelize,connectDB} = require("../config/dbConnection");


const Users= sequelize.define("user",{
    username:{
        type: DataTypes.STRING,
        allowNull:false,
        len: [2,20],
    },
    firstname:{
        type: DataTypes.STRING,
        allowNull:true,
        len: [2,20],
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull:true,
        len: [2,20],
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        isEmail:true,
        
    },

    photo:{
        type: DataTypes.STRING,
        allowNull:true,

    },
    birth_date:{
        type: DataTypes.DATEONLY,
        allowNull:true,

    },
    role:{
        type: DataTypes.INTEGER,
        allowNull:false,
        min: 0,
        max: 2
    }, // 0 - reader, 1 - admin , 2 - author
    password:{
        type: DataTypes.STRING,
        allowNull:true

    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          const name = this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : "Anonim"
          return name;
        },
        set(value) {
          throw new Error('Do not try to set the `fullName` value!');
        }
      },
      miniphoto: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.photo){
            return `${this.photo}-mini`;
            }
            return null
        },
        set(value) {
          throw new Error('Do not try to set the `miniphoto` value!');
        }
      }

},{paranoid:true});


module.exports= Users
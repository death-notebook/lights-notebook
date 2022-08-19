
module.exports = (sequelize,DataTypes)=>{
    const People = sequelize.define("People",{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        image:{
            type:DataTypes.STRING,
            //allowNull:false
        },
        cause:{
            type:DataTypes.STRING,
            allowNull:false
        },
        time:{
            type:DataTypes.STRING,
            //allowNull:false
        },
        verifier:{
            type:DataTypes.STRING,
            //allowNull:false
        },
        history:{
            type:DataTypes.STRING,
            //allowNull:false
        }
    })

    People.associate = (models)=>{
        People.belongsTo(models.User);
    }

  return People
};
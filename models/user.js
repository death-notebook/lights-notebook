

module.exports = (sequelize,DataTypes)=>{
    const User = sequelize.define("user", {
        userId:{
            type:DataTypes.STRING ,
            defaultValue: Date.now().toString()
            //allowNull:false
        },
        username:{
            type:DataTypes.STRING,
            //allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            //allowNull:false
        },
        role:{
            type:DataTypes.ENUM('admin', 'user'),
            //allowNull:false
        }
    })
  return User
};
//Imprementando el modelo para que el usuario inicie sesion

import { DataTypes } from 'sequelize'; 
import { genSalt, hash, compare } from 'bcrypt'; 

export default (sequelize) => {
    const Usuario = sequelize.define('Usuario',{
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true
        }, 
        correo_electronico: {
            type: DataTypes.STRING(320),
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
              len: [5, 320]

            }
        },
        contrasena:{
            type: DataTypes.STRING, 
            allowNull: false
        }, 
        intentosFallidos: {
            type: DataTypes.INTEGER, 
            defaultValue: 0
        }, 
        tiempoDeBloqueo: {
            type: DataTypes.DATE, 
            allowNull: true

        }, 
        rol: {
            type: DataTypes.ENUM('cliente', 'administrador', 'tecnico'), 
            defaultValue: 'cliente'
        }
    }, {
      hooks: { 
    
        beforeCreate: async(usuario)=>{
            if(usuario.contrasena){
                const salt = await genSalt(10); 
                usuario.contrasena = await hash(usuario.contrasena, salt); 
            }
        
      }, 
      beforeUpdate: async(usuario)=> {
        if(usuario.changed('contrasena')){
            const salt = await genSalt(10); 
            usuario.contrasena = await hash(usuario.contrasena, salt);

        }
      }
    }  
    }); 

    Usuario.prototype.validarContrasena = async function(contrasena){
        return await compare(contrasena, this.contrasena); 
    }; 

    return Usuario; 

}; 
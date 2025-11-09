import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

const ReporteBombeo = sequelize.define('ReporteBombeo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    
    fecha: {
        type: DataTypes.DATE, 
        allowNull: false, 
        validate: {
            notNull: {
                msg: 'La fecha del reporte de bombeo es requerida'
            },
            isDate: {
                msg: 'Debe ser una fecha válida'
            }
        },
    },

    direccion: {
        type: DataTypes.STRING, 
        allowNull: false, 
        
        validate: {
            len: {
                args: [10, 255],
                msg: 'La dirección de servicio debe tener entre 10 y 255 caracteres.',
            },
            notEmpty: {
                msg: 'La dirección del servicio no puede estar vacía.',
            },
            
        },

    },
    
    ciudad: {
        type: DataTypes.STRING, 
        allowNull: false, 
        
        validate: {
            len: {
                args: [10, 255],
                msg: 'La ciudad debe tener entre 10 y 255 caracteres.',
            },
            notEmpty: {
                msg: 'La ciudad del servicio no puede estar vacía.',
            },
            
        },

    }, 

    encargado: {
        type: DataTypes.STRING, 
        allowNull: false, 
        
        validate: {
            notEmpty: {
                msg: 'El encargado del servicio no puede estar vacía.',
            },
            
        },

    }, 

    observaciones_finales: {
        type: DataTypes.TEXT, 
        allowNull: false, 
        
        validate: {
            len: {
                args: [10, 255],
                msg: 'Las observaciones debe tener entre 20 y 500 caracteres.',
            },
            notEmpty: {
                msg: 'Las observacios del servicio no puede estar vacía.',
            },
            
        },

    }, 

    



})

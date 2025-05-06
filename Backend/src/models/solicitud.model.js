import { DataTypes } from "sequelize";
import { sequelize} from "../database/conexion.js";
import {noFechasPasadas, sinEspaciosSolamente,} from "../hooks/validators.js";



const Solicitud = sequelize.define('Solicitud', {

    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    fecha_solicitud : {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        validate: {
          
            isDate: {
                msg: 'La fecha de solicitud debe ser una fecha válida.',
            },
        
            notNull: {
                msg: 'La fecha de solicitud es requerida.',
            },
            notEmpty: {
                msg: 'La fecha de solicitud no puede estar vacía.',
            },
            noFechasPasadas,

        },
        
    },
    estado: {
        type: DataTypes.ENUM(
            'pendiente', 
            'cotizada', 
            'aceptada', 
            'en proceso',
            'completada', 
            'cancelada'
        ),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    direccion_servicio: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [10, 255],
                msg: 'La dirección de servicio debe tener entre 10 y 255 caracteres.',
            },
            notEmpty: {
                msg: 'La dirección del servicio no puede estar vacía.',
            },
            sinEspaciosSolamente
          
        },
    },
    descripcion: { 
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [5, 500],
                msg: 'La descripción debe tener entre 20 y 500 caracteres.',
            },
            notEmpty: {
                msg: 'La descripción no puede estar vacía.',
            },
            sinEspaciosSolamente
        },
    },

    comentarios: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [0, 255],
                msg: 'Los comentarios no deben exceder los 255 caracteres.',
            },
        },
    },
    // =====Asociaciones=====
     servicio_id_fk:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'servicios',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El id del servicio es requerido.',
            },
            notEmpty: {
                msg: 'El id del servicio no puede estar vacío.',
            },
        }
    },
    cliente_id_fk:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cliente',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El id del cliente es requerido.',
            },
            notEmpty: {
                msg: 'El id del cliente no puede estar vacío.',
            },
        }
    },



   
    

},{
    tableName: 'solicitudes',
    timestamps: false,
});

//asociaciones de latabla solicitud con otras tablas


//Función para establecer las asociaciones
export const establecerAsociaciones = (models) => {
    // Asociación con Cliente (muchas solicitudes pertenecen a un cliente)
    Solicitud.belongsTo(models.Cliente, {
        foreignKey: 'cliente_id_fk',
        as: 'cliente'
    });
    
    // Asociación con Servicio (muchas solicitudes pertenecen a un servicio)
    Solicitud.belongsTo(models.Servicio, {
        foreignKey: 'servicio_id_fk',
        as: 'servicios'
    });
    
    // Asociación con Cotizaciones (una solicitud puede tener muchas cotizaciones)
    Solicitud.hasMany(models.Cotizacion, {
        foreignKey: 'solicitud_id',
        as: 'cotizaciones'
    });
    
    // Asociación con Visitas (una solicitud puede tener muchas visitas)
    Solicitud.hasMany(models.Visita, {
        foreignKey: 'solicitud_id',
        as: 'visitas'
    });
};

// Exportar el modelo para su uso en otras partes de la aplicación
export const SolicitudModel = {
    Solicitud,
    establecerAsociaciones,
}

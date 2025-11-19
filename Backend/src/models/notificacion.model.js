import { DataTypes } from "sequelize";
import { sequelize } from "../database/conexion.js";

const Notificacion = sequelize.define('Notificacion', {
    id_notificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_destinatario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: { msg: 'El ID del destinatario debe ser un número entero.' },
            min: {
                args: [1],
                msg: 'El ID del destinatario debe ser mayor a 0.'
            }
        }
    },
    tipo_destinatario: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: {
                args: [['cliente', 'administrador', 'tecnico']],
                msg: 'El tipo de destinatario debe ser: cliente, administrador o tecnico.'
            }
        }
    },
    tipo_notificacion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El tipo de notificación no puede estar vacío.' },
            len: {
                args: [3, 50],
                msg: 'El tipo de notificación debe tener entre 3 y 50 caracteres.'
            }
        }
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El mensaje no puede estar vacío.' },
            len: {
                args: [1, 1000],
                msg: 'El mensaje no debe exceder los 1000 caracteres.'
            }
        }
    },
    id_referencia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: { msg: 'El ID de referencia debe ser un número entero.' },
            min: {
                args: [1],
                msg: 'El ID de referencia debe ser mayor a 0.'
            }
        }
    },
    tipo_referencia: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            len: {
                args: [0, 50],
                msg: 'El tipo de referencia no debe exceder los 50 caracteres.'
            }
        }
    },
    leida: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'notificaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'idx_notificaciones_destinatario',
            fields: ['id_destinatario', 'tipo_destinatario']
        },
        {
            name: 'idx_notificaciones_leida',
            fields: ['leida']
        },
        {
            name: 'idx_notificaciones_fecha',
            fields: [{ name: 'fecha_creacion', order: 'DESC' }]
        },
        {
            name: 'idx_notificaciones_tipo',
            fields: ['tipo_notificacion']
        },
        {
            name: 'idx_notificaciones_usuario_no_leidas',
            fields: ['id_destinatario', 'tipo_destinatario', 'leida', { name: 'fecha_creacion', order: 'DESC' }]
        }
    ]
});

export { Notificacion };

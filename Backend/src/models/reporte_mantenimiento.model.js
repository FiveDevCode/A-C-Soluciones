import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

const ReporteMantenimientoPlantasElectricas = sequelize.define('ReporteMantenimientoPlantasElectricas', {
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
                msg: 'La fecha es requerida'
            },
            isDate: {
                msg: 'Debe ser una fecha válida'
            }
        }
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El ID del cliente es requerido'
            }
        }
    },
    id_tecnico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tecnicos',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El ID del técnico es requerido'
            }
        }
    },
    id_administrador: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'administradors',
            key: 'id'
        }
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La dirección es requerida'
            },
            notEmpty: {
                msg: 'La dirección no puede estar vacía'
            }
        }
    },
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La ciudad es requerida'
            },
            notEmpty: {
                msg: 'La ciudad no puede estar vacía'
            }
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    encargado: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El encargado es requerido'
            },
            notEmpty: {
                msg: 'El encargado no puede estar vacío'
            }
        }
    },
    marca_generador: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La marca del generador es requerida'
            }
        }
    },
    modelo_generador: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El modelo del generador es requerido'
            }
        }
    },
    kva: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    serie_generador: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    observaciones_finales: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pdf_path: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'reportemantenimientoplantaselectricas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const ParametrosOperacion = sequelize.define('ParametrosOperacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reporte_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reportemantenimientoplantaselectricas',
            key: 'id'
        },
        onDelete: 'CASCADE',
        validate: {
            notNull: {
                msg: 'El ID del reporte es requerido'
            }
        }
    },
    presion_aceite: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    temperatura_aceite: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    temperatura_refrigerante: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    fugas_aceite: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    fugas_combustible: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    frecuencia_rpm: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    voltaje_salida: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'parametrosoperacion',
    timestamps: false
});

const VerificacionMantenimiento = sequelize.define('VerificacionMantenimiento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reporte_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reportemantenimientoplantaselectricas',
            key: 'id'
        },
        onDelete: 'CASCADE',
        validate: {
            notNull: {
                msg: 'El ID del reporte es requerido'
            }
        }
    },
    item: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El item es requerido'
            }
        }
    },
    visto: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    observacion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'verificacionmantenimiento',
    timestamps: false
});

// Definir relaciones
ReporteMantenimientoPlantasElectricas.hasMany(ParametrosOperacion, {
    foreignKey: 'reporte_id',
    as: 'parametros'
});

ParametrosOperacion.belongsTo(ReporteMantenimientoPlantasElectricas, {
    foreignKey: 'reporte_id',
    as: 'reporte'
});

ReporteMantenimientoPlantasElectricas.hasMany(VerificacionMantenimiento, {
    foreignKey: 'reporte_id',
    as: 'verificaciones'
});

VerificacionMantenimiento.belongsTo(ReporteMantenimientoPlantasElectricas, {
    foreignKey: 'reporte_id',
    as: 'reporte'
});

export const ReporteMantenimientoModel = {
    ReporteMantenimientoPlantasElectricas,
    ParametrosOperacion,
    VerificacionMantenimiento
};

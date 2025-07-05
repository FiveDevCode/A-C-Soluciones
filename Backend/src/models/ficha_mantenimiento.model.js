import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

const FichaMantenimiento = sequelize.define('FichaMantenimiento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    fecha_de_mantenimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La fecha de mantenimiento es requerida'
            },
            isDate: {
                msg: 'Debe ser una fecha válida'
            }
        }
    },
    introduccion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La introducción es requerida'
            },
            len: {
                args: [20, 500],
                msg: 'La introducción debe tener entre 20 y 500 caracteres'
            },
            notEmpty: {
                msg: 'La introducción no puede estar vacía'
            }
        }
    },
    detalles_servicio: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Los detalles del servicio son requeridos'
            },
            len: {
                args: [10, 2000],
                msg: 'Los detalles del servicio deben tener entre 10 y 2000 caracteres'
            },
            notEmpty: {
                msg: 'Los detalles del servicio no pueden estar vacíos'
            }
        }
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 1000],
                msg: 'Las observaciones no pueden exceder los 1000 caracteres'
            }
        }
    },
    estado_antes: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El estado inicial del equipo es requerido'
            },
            len: {
                args: [20, 1000],
                msg: 'El estado inicial debe tener entre 20 y 1000 caracteres'
            },
            notEmpty: {
                msg: 'El estado inicial no puede estar vacío'
            }
        }
    },
    descripcion_trabajo: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La descripción del trabajo es requerida'
            },
            len: {
                args: [20, 1000],
                msg: 'La descripción del trabajo debe tener entre 20 y 1000 caracteres'
            },
            notEmpty: {
                msg: 'La descripción del trabajo no puede estar vacía'
            }
        }
    },
    materiales_utilizados: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Los materiales utilizados son requeridos'
            },
            len: {
                args: [20, 200],
                msg: 'Los materiales utilizados deben tener entre 20 y 200 caracteres'
            },
            notEmpty: {
                msg: 'Los materiales utilizados no pueden estar vacíos'
            }
        }
    },
    tiempo_de_trabajo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El tiempo de trabajo es requerido'
            },
            len: {
                args: [1, 50],
                msg: 'El tiempo de trabajo debe tener entre 1 y 50 caracteres'
            },
            notEmpty: {
                msg: 'El tiempo de trabajo no puede estar vacío'
            }
        }
    },
    estado_final: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El estado final del equipo es requerido'
            },
            len: {
                args: [20, 500],
                msg: 'El estado final debe tener entre 20 y 500 caracteres'
            },
            notEmpty: {
                msg: 'El estado final no puede estar vacío'
            }
        }
    },
    recomendaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'Las recomendaciones no pueden exceder los 500 caracteres'
            }
        }
    },
    id_visitas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'visitas',
            key: 'id'
        },
        validate: {
            isInt: {
                msg: 'El ID de la visita debe ser un número entero'
            },
            min: {
                args: [1],
                msg: 'Debe ser un ID válido'
            }
        }
    },
    id_tecnico: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'tecnico',
            key: 'id'
        },
        validate: {
            isInt: {
                msg: 'El ID del técnico debe ser un número entero'
            },
            min: {
                args: [1],
                msg: 'Debe ser un ID válido'
            }
        }
    },
    pdf_path: {
        type: DataTypes.STRING,
        allowNull: true, 
        validate: {
            len: {
                args: [5, 255],
                msg: 'La ruta del PDF debe tener entre 5 y 255 caracteres',
            },
        },
    },
    id_administrador: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'administrador',
            key: 'id'
        },
        validate: {
            isInt: {
                msg: 'El ID del admin debe ser un número entero'
            },
            min: {
                args: [1],
                msg: 'Debe ser un ID válido'
            }
        }
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cliente', 
            key: 'id'
        },
        validate: {
            isInt: {
                msg: 'El ID del cliente debe ser un número entero'
            },
            min: {
                args: [1],
                msg: 'Debe ser un ID válido'
            }
        }
    }
}, {
    tableName: 'ficha_de_mantenimiento',
    timestamps: false,
    indexes: [
        // Índices para búsquedas 
        {
            name: 'idx_ficha_visita',
            fields: ['visita_id_fk']
        },
        {
            name: 'idx_ficha_cliente',
            fields: ['id_cliente']
        },
        {
            name: 'idx_ficha_tecnico',
            fields: ['tecnico_id']
        },
        {
            name: 'idx_ficha_fecha',
            fields: ['fecha_de_mantenimiento']
        }
    ]
});

export const FichaModel = {
  FichaMantenimiento
};
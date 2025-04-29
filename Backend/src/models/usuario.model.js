import { DataTypes } from 'sequelize';
import { genSalt, hash, compare } from 'bcrypt';

export default (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
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
    contrasena: {
      type: DataTypes.CHAR(60),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    intentos_fallidos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tiempo_bloqueo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rol: {
      type: DataTypes.ENUM('cliente', 'administrador', 'tecnico'),
      defaultValue: 'cliente'
    },
    // Campos para recuperación de contraseña
    token_recuperacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expiracion_token_recuperacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Campo para registrar los tokens invalidados
    tokens_invalidados: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    ultima_actualizacion_contrasena: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.changed('contrasena')) {
          const salt = await genSalt(12);
          usuario.contrasena = await hash(usuario.contrasena, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('contrasena')) {
          const salt = await genSalt(12); // Usar el mismo factor que en beforeCreate
          usuario.contrasena = await hash(usuario.contrasena, salt);
          usuario.ultima_actualizacion_contrasena = new Date();
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['correo_electronico']
      },
      {
        fields: ['token_recuperacion'] // Índice para búsquedas por token
      }
    ],
    timestamps: true,
    paranoid: true,
    tableName: 'usuarios',
    underscored: true // Para coincidir con snake_case de la BD
  });

  // Método para validar contraseña
  Usuario.prototype.validarContrasena = async function(contrasena) {
    return await compare(contrasena, this.contrasena);
  };

  // Método para invalidar tokens
  Usuario.prototype.invalidarToken = async function(token) {
    if (!this.tokens_invalidados) {
      this.tokens_invalidados = [];
    }
    this.tokens_invalidados.push(token);
    return await this.save();
  };

  // Método para verificar si un token está invalidado
  Usuario.prototype.esTokenInvalidado = function(token) {
    return this.tokens_invalidados && this.tokens_invalidados.includes(token);
  };

  return Usuario;
};
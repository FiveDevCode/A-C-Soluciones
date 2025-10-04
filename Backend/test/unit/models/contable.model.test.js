import { jest } from "@jest/globals";
import { ContableModel } from "../../../src/models/contable.model.js";
import { sequelize } from ".../../../src/database/conexion.js";
import { encryptPasswordHook } from "../../../src/hooks/encryptPassword.js";
import { ValidationError } from "sequelize";

// Create mock DataTypes
const MockDataTypes = {
  INTEGER: { constructor: { name: 'INTEGER' } },
  STRING: (size) => ({ constructor: { name: 'STRING' }, size }),
  ENUM: (...values) => ({ constructor: { name: 'ENUM' }, values }),
  NOW: 'CURRENT_TIMESTAMP'
};

// Mock dependencies
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn().mockReturnValue({
      beforeCreate: jest.fn()
    }),
    sync: jest.fn().mockResolvedValue(undefined)
  }
}));

jest.mock('../../../src/hooks/encryptPassword.js', () => ({
  encryptPasswordHook: jest.fn()
}));

describe("Contable Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // crea las tablas en memoria
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debería crear un contable válido", async () => {
    const contable = await ContableModel.Contable.create({
      numero_de_cedula: "1234567",
      nombre: "Juan",
      apellido: "Pérez",
      correo_electronico: "juan@example.com",
      telefono: "3001234567",
      contrasenia: "Valid123!",
    });

    expect(contable.id).toBeDefined();
    expect(encryptPasswordHook).toHaveBeenCalled();
    expect(contable.contrasenia).toBe("hashedPassword");
  });

  it("❌ debería fallar si la cédula empieza con 0", async () => {
    await expect(
      ContableModel.Contable.create({
        numero_de_cedula: "012345",
        nombre: "Pedro",
        apellido: "López",
        correo_electronico: "pedro@example.com",
        telefono: "3009876543",
        contrasenia: "Valid123!",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("❌ debería fallar si el correo es inválido", async () => {
    await expect(
      ContableModel.Contable.create({
        numero_de_cedula: "123456",
        nombre: "Ana",
        apellido: "Gómez",
        correo_electronico: "correo-malo",
        telefono: "3001234567",
        contrasenia: "Valid123!",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("❌ debería fallar si el teléfono no empieza con 3", async () => {
    await expect(
      ContableModel.Contable.create({
        numero_de_cedula: "1234567",
        nombre: "Carlos",
        apellido: "Ramírez",
        correo_electronico: "carlos@example.com",
        telefono: "2001234567",
        contrasenia: "Valid123!",
      })
    ).rejects.toThrow("El teléfono debe iniciar con 3 en Colombia.");
  });

  it("❌ debería fallar si la contraseña es muy débil", async () => {
    await expect(
      ContableModel.Contable.create({
        numero_de_cedula: "9876543",
        nombre: "Lucía",
        apellido: "Martínez",
        correo_electronico: "lucia@example.com",
        telefono: "3009998888",
        contrasenia: "123456",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("✅ debería asignar valores por defecto (rol, estado, fecha_registro)", async () => {
    const contable = await ContableModel.Contable.create({
      numero_de_cedula: "8765432",
      nombre: "Sofía",
      apellido: "López",
      correo_electronico: "sofia@example.com",
      telefono: "3002223333",
      contrasenia: "Valid123!",
    });

    expect(contable.rol).toBe("contable");
    expect(contable.estado).toBe("activo");
    expect(contable.fecha_registro).toBeInstanceOf(Date);
  });
});

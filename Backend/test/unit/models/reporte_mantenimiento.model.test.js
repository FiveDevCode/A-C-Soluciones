// Mock sequelize ANTES de cualquier import
jest.mock('../../../src/database/conexion.js', () => ({
    sequelize: {
        define: jest.fn((modelName, schema, options) => {
            const mockModel = {
                tableName: options?.tableName || modelName,
                timestamps: options?.timestamps,
                schema,
                options,
                hasMany: jest.fn(),
                belongsTo: jest.fn(),
                hasOne: jest.fn()
            };
            return mockModel;
        })
    }
}));

const { sequelize } = require('../../../src/database/conexion.js');
const { DataTypes } = require('sequelize');

describe('ReporteMantenimientoPlantasElectricas Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it('debería definir el modelo con el nombre correcto', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        expect(sequelize.define).toHaveBeenCalledWith(
            'ReporteMantenimientoPlantasElectricas',
            expect.any(Object),
            expect.objectContaining({
                tableName: 'reportemantenimientoplantaselectricas',
                timestamps: true
            })
        );
    });

    it('debería definir el campo id como primary key y autoincrement', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.id).toBeDefined();
        expect(modelDefinition.id.type).toBeDefined();
        expect(modelDefinition.id.primaryKey).toBe(true);
        expect(modelDefinition.id.autoIncrement).toBe(true);
    });

    it('debería definir el campo fecha como DATE requerido con validaciones', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.fecha).toBeDefined();
        expect(modelDefinition.fecha.type).toBeDefined();
        expect(modelDefinition.fecha.allowNull).toBe(false);
        expect(modelDefinition.fecha.validate).toBeDefined();
        expect(modelDefinition.fecha.validate.notNull).toBeDefined();
        expect(modelDefinition.fecha.validate.isDate).toBeDefined();
    });

    it('debería definir el campo id_cliente con referencia a clientes', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.id_cliente).toBeDefined();
        expect(modelDefinition.id_cliente.type).toBeDefined();
        expect(modelDefinition.id_cliente.allowNull).toBe(false);
        expect(modelDefinition.id_cliente.references).toEqual({
            model: 'clientes',
            key: 'id'
        });
    });

    it('debería definir el campo id_tecnico con referencia a tecnicos', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.id_tecnico).toBeDefined();
        expect(modelDefinition.id_tecnico.type).toBeDefined();
        expect(modelDefinition.id_tecnico.allowNull).toBe(false);
        expect(modelDefinition.id_tecnico.references).toEqual({
            model: 'tecnicos',
            key: 'id'
        });
    });

    it('debería definir el campo id_administrador como opcional', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.id_administrador).toBeDefined();
        expect(modelDefinition.id_administrador.allowNull).toBe(true);
        expect(modelDefinition.id_administrador.references).toEqual({
            model: 'administradors',
            key: 'id'
        });
    });

    it('debería definir el campo direccion como STRING(255) requerido', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.direccion).toBeDefined();
        expect(modelDefinition.direccion.type).toBeDefined();
        expect(modelDefinition.direccion.allowNull).toBe(false);
        expect(modelDefinition.direccion.validate.notNull).toBeDefined();
        expect(modelDefinition.direccion.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo ciudad como STRING(100) requerido', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.ciudad).toBeDefined();
        expect(modelDefinition.ciudad.type).toBeDefined();
        expect(modelDefinition.ciudad.allowNull).toBe(false);
        expect(modelDefinition.ciudad.validate.notNull).toBeDefined();
    });

    it('debería definir el campo telefono como opcional', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.telefono).toBeDefined();
        expect(modelDefinition.telefono.allowNull).toBe(true);
    });

    it('debería definir el campo encargado como requerido', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.encargado).toBeDefined();
        expect(modelDefinition.encargado.allowNull).toBe(false);
        expect(modelDefinition.encargado.validate.notNull).toBeDefined();
    });

    it('debería definir el campo marca_generador como requerido', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.marca_generador).toBeDefined();
        expect(modelDefinition.marca_generador.allowNull).toBe(false);
    });

    it('debería definir el campo modelo_generador como requerido', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.modelo_generador).toBeDefined();
        expect(modelDefinition.modelo_generador.allowNull).toBe(false);
    });

    it('debería definir campos opcionales para el generador', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.kva).toBeDefined();
        expect(modelDefinition.kva.allowNull).toBe(true);
        expect(modelDefinition.serie_generador).toBeDefined();
        expect(modelDefinition.serie_generador.allowNull).toBe(true);
    });

    it('debería definir el campo observaciones_finales como TEXT opcional', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.observaciones_finales).toBeDefined();
        expect(modelDefinition.observaciones_finales.type).toBeDefined();
        expect(modelDefinition.observaciones_finales.allowNull).toBe(true);
    });

    it('debería definir campos de timestamps', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const modelDefinition = sequelize.define.mock.calls[0][1];
        const options = sequelize.define.mock.calls[0][2];
        
        expect(modelDefinition.created_at).toBeDefined();
        expect(modelDefinition.updated_at).toBeDefined();
        expect(options.timestamps).toBe(true);
        expect(options.createdAt).toBe('created_at');
        expect(options.updatedAt).toBe('updated_at');
    });

    it('debería definir el modelo ParametrosOperacion', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const parametrosCall = sequelize.define.mock.calls.find(
            call => call[0] === 'ParametrosOperacion'
        );
        
        expect(parametrosCall).toBeDefined();
        expect(parametrosCall[2].tableName).toBe('parametrosoperacion');
        expect(parametrosCall[2].timestamps).toBe(false);
    });

    it('debería definir el modelo VerificacionMantenimiento', () => {
        require('../../../src/models/reporte_mantenimiento.model.js');
        
        const verificacionCall = sequelize.define.mock.calls.find(
            call => call[0] === 'VerificacionMantenimiento'
        );
        
        expect(verificacionCall).toBeDefined();
        expect(verificacionCall[2].tableName).toBe('verificacionmantenimiento');
    });
});

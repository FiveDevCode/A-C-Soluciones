import { DataTypes } from 'sequelize';

// Mock de sequelize ANTES de cualquier import
jest.mock('../../../src/database/conexion.js', () => ({
    sequelize: {
        define: jest.fn().mockReturnValue({})
    }
}));

describe('ParametroBombeo Model', () => {
    let sequelize;
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        
        // Obtener el mock de sequelize
        sequelize = require('../../../src/database/conexion.js').sequelize;
        sequelize.define.mockReturnValue({});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('debería definir el modelo ParametroBombeo con sequelize.define', () => {
        require('../../../src/models/parametroBombeo.model.js');

        expect(sequelize.define).toHaveBeenCalledWith(
            'ParametroBombeo',
            expect.any(Object),
            expect.any(Object)
        );
    });

    it('debería definir el campo id como primary key y autoincrement', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.id).toBeDefined();
        expect(modelDefinition.id.type).toBeDefined();
        expect(modelDefinition.id.primaryKey).toBe(true);
        expect(modelDefinition.id.autoIncrement).toBe(true);
    });

    it('debería definir el campo reporte_id con referencia a reportebombeo', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.reporte_id).toBeDefined();
        expect(modelDefinition.reporte_id.type).toBeDefined();
        expect(modelDefinition.reporte_id.allowNull).toBe(false);
        expect(modelDefinition.reporte_id.references).toEqual({
            model: 'reportebombeo',
            key: 'id'
        });
        expect(modelDefinition.reporte_id.validate).toBeDefined();
        expect(modelDefinition.reporte_id.validate.isInt).toBe(true);
        expect(modelDefinition.reporte_id.validate.notNull).toBe(true);
    });

    it('debería definir el campo voltaje_linea como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.voltaje_linea).toBeDefined();
        expect(modelDefinition.voltaje_linea.type).toBeDefined();
        expect(modelDefinition.voltaje_linea.allowNull).toBe(false);
        expect(modelDefinition.voltaje_linea.validate).toBeDefined();
        expect(modelDefinition.voltaje_linea.validate.notNull).toBeDefined();
        expect(modelDefinition.voltaje_linea.validate.len).toBeDefined();
        expect(modelDefinition.voltaje_linea.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo corriente_linea como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.corriente_linea).toBeDefined();
        expect(modelDefinition.corriente_linea.type).toBeDefined();
        expect(modelDefinition.corriente_linea.allowNull).toBe(false);
        expect(modelDefinition.corriente_linea.validate).toBeDefined();
        expect(modelDefinition.corriente_linea.validate.notNull).toBeDefined();
        expect(modelDefinition.corriente_linea.validate.len).toBeDefined();
        expect(modelDefinition.corriente_linea.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo presion_succion como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.presion_succion).toBeDefined();
        expect(modelDefinition.presion_succion.type).toBeDefined();
        expect(modelDefinition.presion_succion.allowNull).toBe(false);
        expect(modelDefinition.presion_succion.validate).toBeDefined();
        expect(modelDefinition.presion_succion.validate.notNull).toBeDefined();
        expect(modelDefinition.presion_succion.validate.len).toBeDefined();
        expect(modelDefinition.presion_succion.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo presion_descarga como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.presion_descarga).toBeDefined();
        expect(modelDefinition.presion_descarga.type).toBeDefined();
        expect(modelDefinition.presion_descarga.allowNull).toBe(false);
        expect(modelDefinition.presion_descarga.validate).toBeDefined();
        expect(modelDefinition.presion_descarga.validate.notNull).toBeDefined();
        expect(modelDefinition.presion_descarga.validate.len).toBeDefined();
        expect(modelDefinition.presion_descarga.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo observaciones como TEXT opcional', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.observaciones).toBeDefined();
        expect(modelDefinition.observaciones.type).toBeDefined();
        expect(modelDefinition.observaciones.allowNull).toBe(true);
    });

    it('debería configurar el modelo con tableName "parametrobombeo"', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelOptions = sequelize.define.mock.calls[0][2];
        
        expect(modelOptions.tableName).toBe('parametrobombeo');
    });

    it('debería configurar timestamps como false', () => {
        require('../../../src/models/parametroBombeo.model.js');

        const modelOptions = sequelize.define.mock.calls[0][2];
        
        expect(modelOptions.timestamps).toBe(false);
    });

    it('debería exportar ParametroBombeoModel con ParametroBombeo', () => {
        const { ParametroBombeoModel } = require('../../../src/models/parametroBombeo.model.js');
        
        expect(ParametroBombeoModel).toBeDefined();
        expect(ParametroBombeoModel.ParametroBombeo).toBeDefined();
    });
});

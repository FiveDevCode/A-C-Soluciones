import { DataTypes } from 'sequelize';

// Mock de sequelize ANTES de cualquier import
jest.mock('../../../src/database/conexion.js', () => ({
    sequelize: {
        define: jest.fn().mockReturnValue({})
    }
}));

describe('EquipoBombeo Model', () => {
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

    it('debería definir el modelo EquipoBombeo con sequelize.define', () => {
        require('../../../src/models/equipoBombeo.model.js');

        expect(sequelize.define).toHaveBeenCalledWith(
            'EquipoBombeo',
            expect.any(Object),
            expect.any(Object)
        );
    });

    it('debería definir el campo id como primary key y autoincrement', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.id).toBeDefined();
        expect(modelDefinition.id.type).toBeDefined();
        expect(modelDefinition.id.primaryKey).toBe(true);
        expect(modelDefinition.id.autoIncrement).toBe(true);
    });

    it('debería definir el campo reporte_id con referencia a reportebombeo', () => {
        require('../../../src/models/equipoBombeo.model.js');

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

    it('debería definir el campo equipo como STRING(100) requerido con validaciones', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.equipo).toBeDefined();
        expect(modelDefinition.equipo.type).toBeDefined();
        expect(modelDefinition.equipo.allowNull).toBe(false);
        expect(modelDefinition.equipo.validate).toBeDefined();
        expect(modelDefinition.equipo.validate.notNull).toBeDefined();
        expect(modelDefinition.equipo.validate.len).toBeDefined();
        expect(modelDefinition.equipo.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo marca como STRING(100) requerido con validaciones', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.marca).toBeDefined();
        expect(modelDefinition.marca.type).toBeDefined();
        expect(modelDefinition.marca.allowNull).toBe(false);
        expect(modelDefinition.marca.validate).toBeDefined();
        expect(modelDefinition.marca.validate.notNull).toBeDefined();
        expect(modelDefinition.marca.validate.len).toBeDefined();
        expect(modelDefinition.marca.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo amperaje como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.amperaje).toBeDefined();
        expect(modelDefinition.amperaje.type).toBeDefined();
        expect(modelDefinition.amperaje.allowNull).toBe(false);
        expect(modelDefinition.amperaje.validate).toBeDefined();
        expect(modelDefinition.amperaje.validate.notNull).toBeDefined();
        expect(modelDefinition.amperaje.validate.len).toBeDefined();
        expect(modelDefinition.amperaje.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo presion como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.presion).toBeDefined();
        expect(modelDefinition.presion.type).toBeDefined();
        expect(modelDefinition.presion.allowNull).toBe(false);
        expect(modelDefinition.presion.validate).toBeDefined();
        expect(modelDefinition.presion.validate.notNull).toBeDefined();
        expect(modelDefinition.presion.validate.len).toBeDefined();
        expect(modelDefinition.presion.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo temperatura como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.temperatura).toBeDefined();
        expect(modelDefinition.temperatura.type).toBeDefined();
        expect(modelDefinition.temperatura.allowNull).toBe(false);
        expect(modelDefinition.temperatura.validate).toBeDefined();
        expect(modelDefinition.temperatura.validate.notNull).toBeDefined();
        expect(modelDefinition.temperatura.validate.len).toBeDefined();
        expect(modelDefinition.temperatura.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo estado como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.estado).toBeDefined();
        expect(modelDefinition.estado.type).toBeDefined();
        expect(modelDefinition.estado.allowNull).toBe(false);
        expect(modelDefinition.estado.validate).toBeDefined();
        expect(modelDefinition.estado.validate.notNull).toBeDefined();
        expect(modelDefinition.estado.validate.len).toBeDefined();
        expect(modelDefinition.estado.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo observacion como TEXT requerido con validaciones', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.observacion).toBeDefined();
        expect(modelDefinition.observacion.type).toBeDefined();
        expect(modelDefinition.observacion.allowNull).toBe(false);
        expect(modelDefinition.observacion.validate).toBeDefined();
        expect(modelDefinition.observacion.validate.notNull).toBeDefined();
        expect(modelDefinition.observacion.validate.len).toBeDefined();
        expect(modelDefinition.observacion.validate.notEmpty).toBeDefined();
    });

    it('debería configurar el modelo con tableName "equipobombeo"', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelOptions = sequelize.define.mock.calls[0][2];
        
        expect(modelOptions.tableName).toBe('equipobombeo');
    });

    it('debería configurar timestamps como false', () => {
        require('../../../src/models/equipoBombeo.model.js');

        const modelOptions = sequelize.define.mock.calls[0][2];
        
        expect(modelOptions.timestamps).toBe(false);
    });

    it('debería exportar EquipoBombeoModel con EquipoBombeo', () => {
        const { EquipoBombeoModel } = require('../../../src/models/equipoBombeo.model.js');
        
        expect(EquipoBombeoModel).toBeDefined();
        expect(EquipoBombeoModel.EquipoBombeo).toBeDefined();
    });
});

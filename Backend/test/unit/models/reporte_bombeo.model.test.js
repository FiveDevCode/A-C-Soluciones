import { DataTypes } from 'sequelize';

// Mock de sequelize y DataTypes ANTES de cualquier import
jest.mock('../../../src/database/conexion.js', () => ({
    sequelize: {
        define: jest.fn().mockReturnValue({})
    }
}));

describe('ReporteBombeo Model', () => {
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

    it('debería definir el modelo ReporteBombeo con sequelize.define', () => {
        // Importar el modelo para que se ejecute sequelize.define
        require('../../../src/models/reporte_bombeo.model.js');

        expect(sequelize.define).toHaveBeenCalledWith(
            'ReporteBombeo',
            expect.any(Object),
            expect.any(Object)
        );
    });

    it('debería definir el campo id como primary key y autoincrement', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.id).toBeDefined();
        expect(modelDefinition.id.type).toBeDefined();
        expect(modelDefinition.id.primaryKey).toBe(true);
        expect(modelDefinition.id.autoIncrement).toBe(true);
    });

    it('debería definir el campo fecha como DATEONLY y requerido', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.fecha).toBeDefined();
        expect(modelDefinition.fecha.type).toBeDefined();
        expect(modelDefinition.fecha.allowNull).toBe(false);
        expect(modelDefinition.fecha.validate).toBeDefined();
        expect(modelDefinition.fecha.validate.notNull).toBeDefined();
        expect(modelDefinition.fecha.validate.isDate).toBeDefined();
    });

    it('debería definir el campo cliente_id con referencia a cliente', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.cliente_id).toBeDefined();
        expect(modelDefinition.cliente_id.type).toBeDefined();
        expect(modelDefinition.cliente_id.allowNull).toBe(false);
        expect(modelDefinition.cliente_id.references).toEqual({
            model: 'cliente',
            key: 'id'
        });
        expect(modelDefinition.cliente_id.validate).toBeDefined();
        expect(modelDefinition.cliente_id.validate.isInt).toBeDefined();
    });

    it('debería definir el campo tecnico_id con referencia a tecnico', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.tecnico_id).toBeDefined();
        expect(modelDefinition.tecnico_id.type).toBeDefined();
        expect(modelDefinition.tecnico_id.allowNull).toBe(false);
        expect(modelDefinition.tecnico_id.references).toEqual({
            model: 'tecnico',
            key: 'id'
        });
        expect(modelDefinition.tecnico_id.validate).toBeDefined();
    });

    it('debería definir el campo administrador_id como opcional con referencia a administrador', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.administrador_id).toBeDefined();
        expect(modelDefinition.administrador_id.type).toBeDefined();
        expect(modelDefinition.administrador_id.allowNull).toBe(true);
        expect(modelDefinition.administrador_id.references).toEqual({
            model: 'administrador',
            key: 'id'
        });
    });

    it('debería definir el campo visita_id como opcional con referencia a visitas', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.visita_id).toBeDefined();
        expect(modelDefinition.visita_id.type).toBeDefined();
        expect(modelDefinition.visita_id.allowNull).toBe(true);
        expect(modelDefinition.visita_id.references).toEqual({
            model: 'visitas',
            key: 'id'
        });
    });

    it('debería definir el campo direccion como STRING(150) requerido con validaciones', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.direccion).toBeDefined();
        expect(modelDefinition.direccion.type).toEqual(DataTypes.STRING(150));
        expect(modelDefinition.direccion.allowNull).toBe(false);
        expect(modelDefinition.direccion.validate).toBeDefined();
        expect(modelDefinition.direccion.validate.notNull).toBeDefined();
        expect(modelDefinition.direccion.validate.len).toBeDefined();
        expect(modelDefinition.direccion.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo ciudad como STRING(100) requerido con validaciones', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.ciudad).toBeDefined();
        expect(modelDefinition.ciudad.type).toEqual(DataTypes.STRING(100));
        expect(modelDefinition.ciudad.allowNull).toBe(false);
        expect(modelDefinition.ciudad.validate).toBeDefined();
        expect(modelDefinition.ciudad.validate.notNull).toBeDefined();
        expect(modelDefinition.ciudad.validate.len).toBeDefined();
        expect(modelDefinition.ciudad.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo telefono como STRING(50) requerido con validaciones', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.telefono).toBeDefined();
        expect(modelDefinition.telefono.type).toEqual(DataTypes.STRING(50));
        expect(modelDefinition.telefono.allowNull).toBe(false);
        expect(modelDefinition.telefono.validate).toBeDefined();
        expect(modelDefinition.telefono.validate.notNull).toBeDefined();
        expect(modelDefinition.telefono.validate.len).toBeDefined();
        expect(modelDefinition.telefono.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo encargado como STRING(100) requerido con validaciones', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.encargado).toBeDefined();
        expect(modelDefinition.encargado.type).toEqual(DataTypes.STRING(100));
        expect(modelDefinition.encargado.allowNull).toBe(false);
        expect(modelDefinition.encargado.validate).toBeDefined();
        expect(modelDefinition.encargado.validate.notNull).toBeDefined();
        expect(modelDefinition.encargado.validate.len).toBeDefined();
        expect(modelDefinition.encargado.validate.notEmpty).toBeDefined();
    });

    it('debería definir el campo observaciones_finales como TEXT requerido', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.observaciones_finales).toBeDefined();
        expect(modelDefinition.observaciones_finales.type).toBeDefined();
        expect(modelDefinition.observaciones_finales.allowNull).toBe(false);
        expect(modelDefinition.observaciones_finales.validate).toBeDefined();
        expect(modelDefinition.observaciones_finales.validate.notNull).toBeDefined();
    });

    it('debería definir el campo pdf_path como STRING(255) opcional', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelDefinition = sequelize.define.mock.calls[0][1];
        
        expect(modelDefinition.pdf_path).toBeDefined();
        expect(modelDefinition.pdf_path.type).toEqual(DataTypes.STRING(255));
        expect(modelDefinition.pdf_path.allowNull).toBe(true);
    });

    it('debería configurar el modelo con tableName "reportebombeo"', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelOptions = sequelize.define.mock.calls[0][2];
        
        expect(modelOptions.tableName).toBe('reportebombeo');
    });

    it('debería configurar timestamps con created_at y updated_at', () => {
        require('../../../src/models/reporte_bombeo.model.js');

        const modelOptions = sequelize.define.mock.calls[0][2];
        
        expect(modelOptions.timestamps).toBe(true);
        expect(modelOptions.createdAt).toBe('created_at');
        expect(modelOptions.updatedAt).toBe('updated_at');
    });

    it('debería exportar ReporteBombeoModel con ReporteBombeo', () => {
        const { ReporteBombeoModel } = require('../../../src/models/reporte_bombeo.model.js');
        
        expect(ReporteBombeoModel).toBeDefined();
        expect(ReporteBombeoModel.ReporteBombeo).toBeDefined();
    });
});

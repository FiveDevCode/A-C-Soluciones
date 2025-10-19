import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, TextField, Select, MenuItem, FormControl, InputLabel, 
  Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, 
  Alert
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faBroom, faTrash } from '@fortawesome/free-solid-svg-icons';

// ======== ESTILOS ========
const Container = styled.div`
  padding: 30px;
  background-color: #f6f6f6;
  height: 100vh;
`;

const Header = styled.h2`
  text-align: center;
  background-color: #007bff;
  color: white;
  padding: 15px;
  border-radius: 4px;
  font-weight: bold;
`;

const Box = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const StyledTableHead = styled(TableHead)`
  background-color: #d8e7ff;
  font-weight: bold;
`;

// 🔹 Colores dinámicos del estado
const EstadoChip = styled.span`
  background-color: ${props => {
    if (props.estado === 'Pendiente') return '#fce96a';
    if (props.estado === 'Pagada') return '#b2f7b2';
    if (props.estado === 'Vencida') return '#ffb2b2';
    return '#e0e0e0';
  }};
  color: #000;
  padding: 5px 12px;
  border-radius: 15px;
  font-weight: 600;
  text-transform: capitalize;
`;

const SuccessAlert = styled(Alert)`
  margin-top: 15px;
  width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ErrorAlert = styled(Alert)`
  margin-top: 10px;
  width: 400px;
  margin-left: auto;
  margin-right: auto;
`;



// ======== COMPONENTE PRINCIPAL ========
const GestionFacturas = () => {
  const [openRegister, setOpenRegister] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({ numero: '', cliente: '', estado: '' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
 

  const [facturas, setFacturas] = useState([
    {
      numero: 'INV-1234',
      cliente: 'Constructora Delta',
      fechaEmision: '10/10/2025',
      concepto: 'Mantenimiento',
      monto: 150000,
      abonos: 50000,
      saldo: 100000,
      vencimiento: '10/11/2025',
      estado: 'Pendiente',
    },
    {
      numero: 'INV-5678',
      cliente: 'Comercial Alfa',
      fechaEmision: '05/10/2025',
      concepto: 'Asesoría',
      monto: 200000,
      abonos: 200000,
      saldo: 0,
      vencimiento: '05/11/2025',
      estado: 'Pagada',
    },
    {
      numero: 'INV-9999',
      cliente: 'Servicios Beta',
      fechaEmision: '01/09/2025',
      concepto: 'Reparación',
      monto: 120000,
      abonos: 0,
      saldo: 120000,
      vencimiento: '01/10/2025',
      estado: 'Vencida',
    }
  ]);

  // ======== FUNCIONES ========
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);

  const handleOpenEdit = (factura) => {
    setSelectedInvoice(factura);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedInvoice(null);
  };

  const handleRegister = () => {
    setOpenRegister(false);
    setMessage('Factura registrada exitosamente');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleEditSave = () => {
    setOpenEdit(false);
    setMessage('Factura editada exitosamente');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSelectRow = (numero) => {
    setSelectedRows(prev =>
      prev.includes(numero) ? prev.filter(n => n !== numero) : [...prev, numero]
    );
  };

  // 🧹 Limpiar filtros
  const handleClearFilters = () => {
    setFilters({ numero: '', cliente: '', estado: '' });
  };

  // 🗑️ Eliminar facturas seleccionadas
  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    setFacturas(facturas.filter(f => !selectedRows.includes(f.numero)));
    setSelectedRows([]);
    setMessage('Facturas eliminadas correctamente');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // 🗑️ Abrir ventana de confirmación
  const handleOpenConfirmDelete = () => {
    if (selectedRows.length > 0) setOpenConfirmDelete(true);
  };

  // ❌ Cancelar eliminación
  const handleCancelDelete = () => {
    setOpenConfirmDelete(false);
  };

  // ✅ Confirmar eliminación
  const handleConfirmDelete = () => {
    setFacturas(facturas.filter(f => !selectedRows.includes(f.numero)));
    setSelectedRows([]);
    setOpenConfirmDelete(false);
    setMessage('Facturas eliminadas correctamente');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  
  

  // ======== FILTRO DE FACTURAS ========
  const filteredFacturas = facturas.filter(f =>
    f.numero.toLowerCase().includes(filters.numero.toLowerCase()) &&
    (filters.cliente === '' || f.cliente === filters.cliente) &&
    (filters.estado === '' || f.estado === filters.estado)
  );

  // ======== RENDER ========
  return (
    <Container>
      <Header>GESTIÓN DE FACTURAS</Header>

      <Box>
        <h3 style={{ color: '#007bff', marginBottom: '15px'}}>Listado de facturas</h3>

        <Filters>
          <TextField
            size="small"
            label="Número de factura..."
            value={filters.numero}
            onChange={(e) => setFilters({ ...filters, numero: e.target.value })}
            InputProps={{
              startAdornment: <FontAwesomeIcon icon={faSearch} style={{ marginRight: 8 }} />,
            }}
          />

          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Cliente</InputLabel>
            <Select
              value={filters.cliente}
              onChange={(e) => setFilters({ ...filters, cliente: e.target.value })}
            >
              <MenuItem value="">-Cliente-</MenuItem>
              <MenuItem value="Constructora Delta">Constructora Delta</MenuItem>
              <MenuItem value="Comercial Alfa">Comercial Alfa</MenuItem>
              <MenuItem value="Servicios Beta">Servicios Beta</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
            >
              <MenuItem value="">-Estado-</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Pagada">Pagada</MenuItem>
              <MenuItem value="Vencida">Vencida</MenuItem>
            </Select>
          </FormControl>

          {/* Botones de acción */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
              <FontAwesomeIcon icon={faBroom} style={{ marginRight: 5 }} />
              Limpiar filtros
            </Button>

            <Button variant="outlined" color="error" onClick={handleDeleteSelected}>
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: 5 }} />
              Eliminar seleccionadas
            </Button>

            <Button variant="contained" color="primary" onClick={handleOpenRegister}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} />
              Registrar factura
            </Button>
          </div>
        </Filters>

        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha de emisión</TableCell>
                <TableCell>Concepto</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Abonos</TableCell>
                <TableCell>Saldo pendiente</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {filteredFacturas.map((factura) => (
                <TableRow key={factura.numero}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(factura.numero)}
                      onChange={() => handleSelectRow(factura.numero)}
                    />
                  </TableCell>
                  <TableCell>{factura.numero}</TableCell>
                  <TableCell>{factura.cliente}</TableCell>
                  <TableCell>{factura.fechaEmision}</TableCell>
                  <TableCell>{factura.concepto}</TableCell>
                  <TableCell>${factura.monto.toLocaleString()}</TableCell>
                  <TableCell>${factura.abonos.toLocaleString()}</TableCell>
                  <TableCell>${factura.saldo.toLocaleString()}</TableCell>
                  <TableCell>{factura.vencimiento}</TableCell>
                  <TableCell><EstadoChip estado={factura.estado}>{factura.estado}</EstadoChip></TableCell>
                  <TableCell>
                    <Button variant="contained" color='primary' size="small" style={{marginRight:8}} onClick={() => handleOpenEdit(factura)}>Ver</Button>
                    <Button variant="contained" color="success" size="small" onClick={() => handleOpenEdit(factura)}>Editar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {success && <SuccessAlert severity="success">{message}</SuccessAlert>}

      {/* === MODAL REGISTRAR === */}
      <Dialog open={openRegister} onClose={handleCloseRegister} maxWidth="md" fullWidth>
        <DialogTitle><strong>Registrar factura</strong></DialogTitle>
        <DialogContent dividers>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '10px'
          }}>
            <TextField label="Fecha de factura (DD/MM/AAAA)" placeholder="(DD/MM/AAAA)" fullWidth />
            <FormControl fullWidth>
              <InputLabel>Cliente asociado</InputLabel>
              <Select defaultValue="">
                <MenuItem value="">Seleccionar cliente</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Número de factura" placeholder="Ej: INV-1234" fullWidth />
            <FormControl fullWidth>
              <InputLabel>Concepto</InputLabel>
              <Select defaultValue="">
                <MenuItem value="">Seleccionar</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Monto facturado" placeholder="Ej: 1500000" fullWidth />
            <TextField label="Abonos" placeholder="Ej: 500000" fullWidth />
            <TextField label="Saldo pendiente" placeholder="Ej: 1000000" fullWidth />
            <TextField label="Fecha de vencimiento (DD/MM/AAAA)" placeholder="(DD/MM/AAAA)" fullWidth />

            <FormControl fullWidth>
              <InputLabel>Estado de la factura</InputLabel>
              <Select defaultValue="">
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Pagada">Pagada</MenuItem>
                <MenuItem value="Vencida">Vencida</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleCloseRegister} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleRegister} color="primary">
            Registrar factura
          </Button>
        </DialogActions>
      </Dialog>

      {/* === MODAL EDITAR === */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle><strong>Editar factura</strong></DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginTop: '10px'
            }}>
              <TextField label="Fecha de factura (DD/MM/AAAA)" defaultValue={selectedInvoice.fechaEmision} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Cliente asociado</InputLabel>
                <Select defaultValue={selectedInvoice.cliente}>
                  <MenuItem value="Constructora Delta">Constructora Delta</MenuItem>
                  <MenuItem value="Comercial Alfa">Comercial Alfa</MenuItem>
                </Select>
              </FormControl>

              <TextField label="Número de factura" defaultValue={selectedInvoice.numero} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Concepto</InputLabel>
                <Select defaultValue={selectedInvoice.concepto}>
                  <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                  <MenuItem value="Asesoría">Asesoría</MenuItem>
                  <MenuItem value="Reparación">Reparación</MenuItem>
                </Select>
              </FormControl>

              <TextField label="Monto facturado" defaultValue={selectedInvoice.monto} fullWidth />
              <TextField label="Abonos" defaultValue={selectedInvoice.abonos} fullWidth />

              <TextField label="Saldo pendiente" defaultValue={selectedInvoice.saldo} fullWidth />
              <TextField label="Fecha de vencimiento (DD/MM/AAAA)" defaultValue={selectedInvoice.vencimiento} fullWidth />

              <FormControl fullWidth>
                <InputLabel>Estado de la factura</InputLabel>
                <Select defaultValue={selectedInvoice.estado}>
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Pagada">Pagada</MenuItem>
                  <MenuItem value="Vencida">Vencida</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleCloseEdit} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleEditSave} color="primary">
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

       {/* === MODAL CONFIRMAR ELIMINACIÓN === */}
      <Dialog open={openConfirmDelete} onClose={handleCancelDelete}>
        <DialogTitle><strong>Confirmar eliminación</strong></DialogTitle>
        <DialogContent dividers>
          <p>¿Desea eliminar las facturas seleccionadas? Esta acción no se puede deshacer.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit" variant="outlined">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* === MODALES REGISTRAR Y EDITAR FACTURA (IGUALES AL CÓDIGO ANTERIOR) === */}
      {/* Los mantengo igual para no duplicar aquí, pero se conservan tal cual */}
          

    </Container>
  );
};

export default GestionFacturas;
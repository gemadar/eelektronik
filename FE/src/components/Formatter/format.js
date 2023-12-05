import { InputText } from 'primereact/inputtext';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

const priceTemplate = (data) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data);
};

const isPositiveInteger = (val) => {
  let str = String(val);

  str = str.trim();

  if (!str) {
    return false;
  }

  str = str.replace(/^0+/, '') || '0';
  let n = Math.floor(Number(str));

  return n !== Infinity && String(n) === str && n >= 0;
};

const textEditor = (options) => {
  return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
};

const formatTimestamp = (value) => {
  return new Date(value).toLocaleString('fr-BE', { timeZone: 'UTC' });
};

const formatDate = (value) => {
  return new Date(value).toLocaleDateString();
};

const fab = (val) => {
  return (
    <Fab size="small" aria-label="add" onClick={val} tyle={{ marginRight: 5 }}>
      <AddIcon />
    </Fab>
  );
};

const formErrorMessage = (name, form) => {
  return form[name] ? <small className="p-error">{form[name].message}</small> : <small className="p-error">&nbsp;</small>;
};

const createdDateBodyTemplate = (rowData) => {
  return formatTimestamp(rowData.created_at);
};

const updatedDateBodyTemplate = (rowData) => {
  return formatTimestamp(rowData.updated_at);
};

export {
  priceTemplate,
  isPositiveInteger,
  textEditor,
  formatTimestamp,
  formatDate,
  fab,
  formErrorMessage,
  createdDateBodyTemplate,
  updatedDateBodyTemplate
};

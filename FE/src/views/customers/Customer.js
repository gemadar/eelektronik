import React, { useState, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { deleteCont, getCont, insertUpdateCont, getAuthToken, getToken } from 'components/controller';
import { formatDate, fab, formErrorMessage } from 'components/Formatter/format';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Menu } from 'primereact/menu';
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';
import MainCard from 'ui-component/cards/MainCard';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primeflex/primeflex.css'; // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css'; // core css

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [insertVisible, setInsertVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [confirmUpdateVisible, setConfirmUpdateVisible] = useState(false);
  const sideMenu = useRef(null);
  const toast = useRef(null);
  const defaultValues = { value: '' };
  const insertForm = useForm();
  const updateForm = useForm({ defaultValues });
  const insertErrors = insertForm.formState.errors;
  const updateErrors = updateForm.formState.errors;
  const { REACT_APP_IP } = process.env;
  const genders = [
    { name: 'Male', code: 'male' },
    { name: 'Female', code: 'female' }
  ];

  const footer = customers == 0 ? `There is no customer.` : `There are ${customers.length} customers.`;

  //HAMBUREGER MENU
  const sideMenuTemplate = (data) => {
    return (
      <Button
        icon="pi pi-bars"
        className="mr-2"
        text
        size="small"
        severity="secondary"
        onClick={(e) => {
          sideMenu.current.toggle(e);
          setCurrentRow(data);
        }}
        aria-controls="popup_menu_right"
        aria-haspopup
      />
    );
  };

  const sideMenuitems = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: () => {
        setUpdateVisible(true);
        updateForm.reset({
          id: currentRow.id,
          name: currentRow.name,
          address: currentRow.address,
          phone: currentRow.phone,
          gender: currentRow.gender == genders[0].code ? genders[0].code : genders[1].code,
          dob: new Date(formatDate(currentRow.dob)),
          email: currentRow.email
        });
      }
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => {
        setConfirmDeleteVisible(true);
      }
    }
  ];

  // HIT API
  const onSubmitInsert = async (data) => {
    data['gender'] = data.gender.code;
    data['dob'] = formatDate(insertForm.getValues('dob'));

    insertUpdateCont(data, `${REACT_APP_IP}/cust`).then(setInsertVisible(false));

    insertState(data);

    insertForm.reset();
    toast.current.show({ severity: 'success', summary: 'Creating', detail: 'Data Added', life: 3000 });
  };

  const onSubmitUpdate = async (data) => {
    data['id'] = currentRow.id;
    data['Transactions'] = currentRow.Transactions;

    insertUpdateCont(data, `${REACT_APP_IP}/customers`).then(setUpdateVisible(false));

    updateState(data);

    toast.current.show({ severity: 'warn', summary: 'Update', detail: 'Data Updated', life: 3000 });
  };

  useEffect(() => {
    getCont(`${REACT_APP_IP}/cust`).then((data) => setCustomers(data));
  }, [REACT_APP_IP]);

  // STATE PURPOSE
  const updateState = (data) => {
    const newData = customers.map((obj) => {
      if (obj.id === data.id) {
        return {
          ...obj,
          id: data.id,
          name: data.name,
          address: data.address,
          gender: data.gender,
          dob: new Date(formatDate(data.dob)),
          phone: data.phone,
          email: data.email,
          Transactions: data.Transactions
        };
      }
      return obj;
    });

    setCustomers(newData);
  };

  const insertState = (data) => {
    if (goods.length > 0) {
      setCustomers([
        ...customers,
        {
          id: customers[customers.length - 1].id + 1,
          name: data.name,
          address: data.address,
          gender: data.gender,
          dob: data.dob,
          phone: data.phone,
          email: data.email,
          Transactions: []
        }
      ]);
    } else {
      setCustomers([
        {
          id: 1,
          name: data.name,
          address: data.address,
          gender: data.gender,
          dob: data.dob,
          phone: data.phone,
          email: data.email,
          Transactions: []
        }
      ]);
    }
  };

  const allowExpansion = (rowData) => {
    return rowData.Transactions.length > 0;
  };

  const acceptDelete = () => {
    deleteCont(currentRow.id, `${REACT_APP_IP}/cust/delete`).then(() => {
      setCustomers(customers.filter((cust) => cust.id !== currentRow.id));
    });
    toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
  };

  const reject = () => {
    setUpdateVisible(false);
    toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-1">
        <h5>
          {data.Transactions.length} Transactions from {data.name}
        </h5>
        <DataTable value={data.Transactions}>
          <Column field="trx_id" header="Transaction ID" sortable></Column>
          <Column field="total" header="Total" sortable></Column>
        </DataTable>
      </div>
    );
  };

  const dobBodyTemplate = (rowData) => {
    return formatDate(rowData.dob);
  };

  const token = getAuthToken();
  const role = getToken();

  return (
    <MainCard title="Customers" secondary={token && role.role === 'admin' && fab(() => setInsertVisible(true))}>
      <PrimeReactProvider>
        <Toast ref={toast}></Toast>
        <ConfirmDialog
          visible={confirmDeleteVisible}
          onHide={() => setConfirmDeleteVisible(false)}
          message="Are you sure you want to proceed?"
          header="DELETE"
          icon="pi pi-exclamation-triangle"
          accept={acceptDelete}
          reject={reject}
        />
        <Menu model={sideMenuitems} popup ref={sideMenu} id="popup_menu" popupAlignment="right" />
        <DataTable
          value={customers}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          showGridlines
          paginator
          rows={10}
          footer={footer}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          emptyMessage=" "
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column expander={allowExpansion} style={{ width: '5rem' }} />
          <Column field="name" header="Name" style={{ width: '20%' }} sortable />
          <Column field="address" header="Address" style={{ width: '20%' }} sortable />
          <Column field="gender" header="Gender" style={{ width: '20%' }} sortable />
          <Column field="dob" header="Date of Birth" body={dobBodyTemplate} style={{ width: '20%' }} sortable />
          <Column field="phone" header="Phone Number" style={{ width: '20%' }} sortable />
          <Column field="email" header="Email" style={{ width: '20%' }} sortable />

          <Column
            headerStyle={{ width: '4rem', textAlign: 'center' }}
            bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
            hidden={token && role.role === 'admin' ? false : true}
            body={sideMenuTemplate}
          />
        </DataTable>
        <Dialog
          baseZIndex={2000}
          header="Add Customer"
          visible={insertVisible}
          style={{ width: '50vw' }}
          onHide={() => setInsertVisible(false)}
        >
          <PrimeReactProvider>
            <div className="card flex justify-content-center">
              <form onSubmit={insertForm.handleSubmit(onSubmitInsert)} className="flex flex-column gap-2">
                <Controller
                  name="name"
                  control={insertForm.control}
                  rules={{ required: 'Name is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Name</label>
                      <AutoComplete
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, insertErrors)}
                    </>
                  )}
                />
                <Controller
                  name="address"
                  control={insertForm.control}
                  rules={{ required: 'Address is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Address</label>
                      <InputTextarea
                        id={field.name}
                        className={classNames({ 'p-invalid': fieldState.error })}
                        value={field.value}
                        onChange={field.onChange}
                        rows={7}
                        cols={20}
                      />
                      {formErrorMessage(field.name, insertErrors)}
                    </>
                  )}
                />
                <Controller
                  name="phone"
                  control={insertForm.control}
                  rules={{ required: 'Phone number is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Phone Number</label>
                      <AutoComplete
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, insertErrors)}
                    </>
                  )}
                />
                <Controller
                  name="gender"
                  control={insertForm.control}
                  rules={{ required: 'Gender is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Gender</label>
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="name"
                        placeholder="Pick a Gender"
                        options={genders}
                        focusInputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, insertErrors)}
                    </>
                  )}
                />
                <Controller
                  name="email"
                  control={insertForm.control}
                  rules={{ required: 'Email is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Email</label>
                      <AutoComplete
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, insertErrors)}
                    </>
                  )}
                />
                <Controller
                  name="dob"
                  control={insertForm.control}
                  rules={{ required: 'Date of Birth is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Date of Birth</label>
                      <Calendar
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/mm/yy"
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, insertErrors)}
                    </>
                  )}
                />
                <Button label="Submit" type="submit" icon="pi pi-check" />
              </form>
            </div>
          </PrimeReactProvider>
        </Dialog>
        <Dialog header="Update Customer" visible={updateVisible} style={{ width: '50vw' }} onHide={() => setUpdateVisible(false)}>
          <PrimeReactProvider>
            <div className="card flex justify-content-center">
              <ConfirmDialog
                visible={confirmUpdateVisible}
                onHide={() => setConfirmUpdateVisible(false)}
                message="Are you sure you want to proceed?"
                header={`Updating "${currentRow ? currentRow.name : ''}"`}
                icon="pi pi-exclamation-triangle"
                accept={updateForm.handleSubmit(onSubmitUpdate)}
                reject={reject}
              />
              <form className="flex flex-column gap-2">
                <Controller
                  name="name"
                  control={updateForm.control}
                  rules={{ required: 'Name is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Name</label>
                      <AutoComplete
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, updateErrors)}
                    </>
                  )}
                />
                <Controller
                  name="address"
                  control={updateForm.control}
                  rules={{ required: 'Address is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Address</label>
                      <InputTextarea
                        id={field.name}
                        className={classNames({ 'p-invalid': fieldState.error })}
                        value={field.value}
                        onChange={field.onChange}
                        rows={7}
                        cols={20}
                      />
                      {formErrorMessage(field.name, updateErrors)}
                    </>
                  )}
                />
                <Controller
                  name="phone"
                  control={updateForm.control}
                  rules={{ required: 'Phone number is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Phone Number</label>
                      <AutoComplete
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, updateErrors)}
                    </>
                  )}
                />
                <Controller
                  name="gender"
                  control={updateForm.control}
                  rules={{ required: 'Gender is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Gender</label>
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="name"
                        optionValue="code"
                        placeholder="Pick a Gender"
                        options={genders}
                        focusInputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, updateErrors)}
                    </>
                  )}
                />
                <Controller
                  name="email"
                  control={updateForm.control}
                  rules={{ required: 'Email is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Email</label>
                      <AutoComplete
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, updateErrors)}
                    </>
                  )}
                />
                <Controller
                  name="dob"
                  control={updateForm.control}
                  rules={{ required: 'Date of Birth is required.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name}>Date of Birth</label>
                      <Calendar
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/mm/yy"
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {formErrorMessage(field.name, updateErrors)}
                    </>
                  )}
                />
                <Button onClick={setConfirmUpdateVisible} label="Submit" type="button" icon="pi pi-check" />
              </form>
            </div>
          </PrimeReactProvider>
        </Dialog>
      </PrimeReactProvider>
    </MainCard>
  );
}

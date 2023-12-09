import React, { useState, useEffect, useRef } from 'react';
import { deleteCont, getAuthToken, getCont, getToken, insertUpdateCont } from 'components/controller';
import { Controller, useForm } from 'react-hook-form';
import { priceTemplate, fab, formErrorMessage } from 'components/Formatter/format';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { goodsSeverity } from 'components/Formatter/severities';
import { InputTextarea } from 'primereact/inputtextarea';
import { Menu } from 'primereact/menu';
import { PrimeReactProvider } from 'primereact/api';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
// import { useRouteLoaderData } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primeflex/primeflex.css'; // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css'; // core css

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
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

  const footer = suppliers == 0 ? `There is no supplier.` : `There are ${suppliers.length} suppliers.`;

  // HAMBUREGER MENU
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
          pic: currentRow.pic
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
    insertUpdateCont(data, `${REACT_APP_IP}/supp`).then(setInsertVisible(false));

    insertState(data);

    insertForm.reset();
    toast.current.show({ severity: 'success', summary: 'Creating', detail: 'Data Added', life: 3000 });
  };

  const onSubmitUpdate = async (data) => {
    data['id'] = currentRow.id;
    data['Goods'] = currentRow.Goods;

    insertUpdateCont(data, `${REACT_APP_IP}/supp`).then(setUpdateVisible(false));

    updateState(data);

    toast.current.show({ severity: 'warn', summary: 'Update', detail: 'Data Updated', life: 3000 });
  };

  useEffect(() => {
    getCont(`${REACT_APP_IP}/supp`).then((data) => setSuppliers(data));
  }, [REACT_APP_IP]);

  // STATE PURPOSE
  const updateState = (data) => {
    const newData = suppliers.map((obj) => {
      if (obj.id === data.id) {
        return {
          ...obj,
          id: data.id,
          name: data.name,
          address: data.address,
          pic: data.pic,
          phone: data.phone,
          Goods: data.Goods
        };
      }
      return obj;
    });

    setSuppliers(newData);
  };

  const insertState = (data) => {
    if (suppliers.length > 0) {
      setSuppliers([
        ...suppliers,
        { id: suppliers[suppliers.length - 1].id + 1, name: data.name, address: data.address, pic: data.pic, phone: data.phone, Goods: [] }
      ]);
    } else {
      setSuppliers([{ id: 1, name: data.name, address: data.address, pic: data.pic, phone: data.phone, Goods: [] }]);
    }
  };

  const allowExpansion = (rowData) => {
    return rowData.Goods.length > 0;
  };

  const acceptDelete = () => {
    deleteCont(currentRow.id, `${REACT_APP_IP}/supp/delete`).then(() => {
      setSuppliers(suppliers.filter((supp) => supp.id !== currentRow.id));
    });
    toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
  };

  const reject = () => {
    setUpdateVisible(false);
    toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const quantitySeverityBodyTemplate = (rowData) => {
    return <Tag value={rowData.quantity} severity={goodsSeverity(rowData)}></Tag>;
  };

  const sellPriceBodyTemplate = (rowData) => {
    return priceTemplate(rowData.sell_price);
  };

  const buyPriceBodyTemplate = (rowData) => {
    return priceTemplate(rowData.buy_price);
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-1">
        <h5>
          {data.Goods.length} Goods from {data.name}
        </h5>
        <DataTable value={data.Goods}>
          <Column field="name" header="Name" sortable></Column>
          <Column field="productcode" header="Code" sortable></Column>
          <Column field="brand" header="Brand" sortable></Column>
          <Column field="productcategory" header="Category" sortable></Column>
          <Column field="buyprice" header="Buy Price" body={buyPriceBodyTemplate} sortable></Column>
          <Column field="sellprice" header="Sell Price" body={sellPriceBodyTemplate} sortable></Column>
          <Column field="quantity" header="Quantity" body={quantitySeverityBodyTemplate} sortable></Column>
        </DataTable>
      </div>
    );
  };

  // const token = useRouteLoaderData('root');
  const token = getAuthToken();
  const role = getToken();

  return (
    token &&
    role.role === 'admin' && (
      <MainCard title="Suppliers" secondary={fab(() => setInsertVisible(true))}>
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
            value={suppliers}
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
            <Column expander={allowExpansion} style={{ width: '1%' }} />
            <Column field="name" header="Name" style={{ width: '20%' }} sortable />
            <Column field="address" header="Address" style={{ width: '20%' }} sortable />
            <Column field="phone" header="Phone Number" style={{ width: '20%' }} sortable />
            <Column field="pic" header="PIC" style={{ width: '20%' }} sortable />

            <Column
              headerStyle={{ width: '1%', textAlign: 'center' }}
              bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
              body={sideMenuTemplate}
            />
          </DataTable>
          <Dialog
            baseZIndex={2000}
            header="Add Supplier"
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
                    name="pic"
                    control={insertForm.control}
                    rules={{ required: 'PIC is required.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <label htmlFor={field.name}>PIC</label>
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
                  <Button label="Submit" type="submit" icon="pi pi-check" />
                </form>
              </div>
            </PrimeReactProvider>
          </Dialog>
          <Dialog header="Update Supplier" visible={updateVisible} style={{ width: '50vw' }} onHide={() => setUpdateVisible(false)}>
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
                    name="pic"
                    control={updateForm.control}
                    rules={{ required: 'PIC is required.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <label htmlFor={field.name}>PIC</label>
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
                  <Button onClick={setConfirmUpdateVisible} label="Submit" type="button" icon="pi pi-check" />
                </form>
              </div>
            </PrimeReactProvider>
          </Dialog>
        </PrimeReactProvider>
      </MainCard>
    )
  );
}

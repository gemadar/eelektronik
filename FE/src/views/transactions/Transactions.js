import React, { useState, useEffect, useRef } from 'react';
import { priceTemplate, isPositiveInteger, formatTimestamp, fab } from 'components/Formatter/format';
import { Controller, useForm } from 'react-hook-form';
import { deleteCont, insertUpdateCont, getCont } from 'components/controller';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Menu } from 'primereact/menu';
import { PrimeReactProvider } from 'primereact/api';
import { Row } from 'primereact/row';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { trxSeverity } from 'components/Formatter/severities';
import MainCard from 'ui-component/cards/MainCard';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primeflex/primeflex.css'; // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css'; // core css

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [transactionsDetails, setTransactionsDetails] = useState([]);
  const [cust, setCust] = useState([]);
  const [goods, setGoods] = useState([]);
  const [trxId, setTrxId] = useState([]);
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
  const detailsForm = useForm();
  const updateForm = useForm({ defaultValues });
  const updateErrors = updateForm.formState.errors;
  const { REACT_APP_IP } = process.env;

  // TOAST
  const getUpdateFormErrorMessage = (name) => {
    return updateErrors[name] ? <small className="p-error">{updateErrors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  const footer = transactions == 0 ? `There is no transaction.` : `There are ${transactions.length} transactions.`;

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
      label: 'Pay',
      icon: 'pi pi-times',
      command: () => {
        //setConfirmDeleteVisible(true);
      }
    },
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
    }
  ];

  //HIT API
  const onSubmitInsert = async (data) => {
    data['TransactionsDetails'] = transactionsDetails;
    data['trx_id'] = trxId;
    data['total'] = totalColumn();
    data['cst_name'] = data.cst_id.name;
    data['cst_id'] = parseInt(data.cst_id.id);
    data['status'] = 'unpaid';

    insertUpdateCont(data, `${REACT_APP_IP}/trx`).then(setInsertVisible(false));

    insertState(data);

    insertForm.reset();
    setTransactionsDetails([]);
    toast.current.show({ severity: 'success', summary: 'Creating', detail: 'Data Added', life: 3000 });
  };

  const onSubmitUpdate = async (data) => {
    data['id'] = currentRow.id;
    data['TransactionsDetails'] = currentRow.TransactionsDetails;
    const url = `${REACT_APP_IP}/trx`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    await fetch(url, requestOptions)
      .then((response) => response.json)
      .then(setUpdateVisible(false));

    updateState(data);

    toast.current.show({ severity: 'warn', summary: 'Update', detail: 'Data Updated', life: 3000 });
  };

  useEffect(() => {
    getCont(`${REACT_APP_IP}/trx`).then((data) => setTransactions(data));
  }, [REACT_APP_IP]);

  // STATE PURPOSE
  const updateTrxDetailsState = (data) => {
    const intPrice = parseInt(data.price);
    const intQty = parseInt(data.quantity);

    if (transactionsDetails.length == 0) {
      setTransactionsDetails([
        {
          item: data.item.name,
          quantity: data.quantity,
          price: intPrice * intQty
        }
      ]);
    } else {
      transactionsDetails.map((obj) => {
        if (obj.item === data.item) {
          const dat = transactionsDetails.map((obj) => {
            if (obj.item === data.item) {
              return { ...obj, item: data.item, quantity: data.quantity, price: intPrice * intQty };
            }
            return obj;
          });
          setTransactionsDetails(dat);
        }

        if (obj.item !== data.item) {
          setTransactionsDetails([
            ...transactionsDetails,
            {
              item: data.item,
              quantity: data.quantity,
              price: intPrice * intQty
            }
          ]);
        }
      });
    }

    detailsForm.reset();
  };

  const insertState = (data) => {
    setTransactions([
      ...transactions,
      {
        id: transactions[transactions.length - 1].id + 1,
        cst_name: data.cst_name,
        trx_id: trxId,
        status: data.status,
        created_at: Date.now(),
        total: data.total,
        TransactionsDetails: transactionsDetails
      }
    ]);
  };

  const handleDeleteTrxDetails = (data) => {
    setTransactionsDetails(transactionsDetails.filter((trx) => trx.item !== data.item));
  };

  const deleteTrxDetails = (data) => {
    return <Button onClick={() => handleDeleteTrxDetails(data)} icon="pi pi-times" text small="true" severity="danger" />;
  };

  const allowExpansion = (rowData) => {
    return rowData.TransactionsDetails.length > 0;
  };

  const acceptDelete = () => {
    deleteCont(currentRow.id, `${REACT_APP_IP}/trx/delete`).then(() => {
      setTransactions(transactions.filter((trx) => trx.id !== currentRow.id));
    });
    toast.current.show({ severity: 'danger', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
  };

  const reject = () => {
    setUpdateVisible(false);
    toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={trxSeverity(rowData.status)} />;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-1">
        <h5>{data.TransactionsDetails.length} Transactions</h5>
        <DataTable value={data.TransactionsDetails}>
          <Column field="item" header="Item" sortable></Column>
          <Column field="quantity" header="Quantity" sortable></Column>
          <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
          <Column field="created_at" header="Created At" body={createdDateBodyTemplate} sortable></Column>
          <Column headerStyle={{ width: '4rem' }}></Column>
        </DataTable>
      </div>
    );
  };

  //EDIT TRANSACTIONS DETAILS
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case 'quantity':
      case 'price':
        if (isPositiveInteger(newValue)) rowData[field] = newValue;
        else event.preventDefault();
        break;

      default:
        if (newValue.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
  };

  const totalColumn = () => {
    let total = 0;

    for (let trx of transactionsDetails) {
      total += parseInt(trx.price);
    }

    return total;
  };

  const priceBodyTemplate = (rowData) => {
    return priceTemplate(rowData.price);
  };

  const totalBodyTemplate = (rowData) => {
    return priceTemplate(rowData.total);
  };

  const createdDateBodyTemplate = (rowData) => {
    return formatTimestamp(rowData.created_at);
  };

  const totals = priceTemplate(totalColumn());

  const totalColumnTemplate = (
    <ColumnGroup>
      <Row>
        <Column footer="Totals:" colSpan={2} footerStyle={{ textAlign: 'right' }} />
        <Column footer={totals} footerStyle={{ textAlign: 'left' }} />
        <Column
          footer={
            <Button
              disabled={transactionsDetails < 1}
              form="insertTrx"
              icon="pi pi-check"
              type="submit"
              size="small"
              severity="success"
              label="Submit"
            />
          }
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <MainCard
      title="Transactions"
      secondary={fab(() => {
        setInsertVisible(true);
        getCont(`${REACT_APP_IP}/cust`).then((data) => setCust(data));
        getCont(`${REACT_APP_IP}/goods`).then((data) => setGoods(data));
        getCont(`${REACT_APP_IP}/trx/gen`).then((data) => setTrxId(data));
      })}
    >
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
          value={transactions}
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
          <Column field="cst_name" header="Customer" style={{ width: '20%' }} sortable />
          <Column field="trx_id" header="Transaction ID" style={{ width: '20%' }} sortable />
          <Column field="created_at" header="Created At" body={createdDateBodyTemplate} style={{ width: '20%' }} sortable />
          <Column field="total" header="Total" body={totalBodyTemplate} style={{ width: '20%' }} sortable />
          <Column field="status" header="Status" align="center" style={{ width: '20%' }} body={statusBodyTemplate} sortable />

          <Column
            headerStyle={{ width: '4rem', textAlign: 'center' }}
            bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
            body={sideMenuTemplate}
          />
        </DataTable>
        <Dialog
          baseZIndex={2000}
          header={`Add Transaction - ${trxId}`}
          visible={insertVisible}
          style={{ width: '50vw' }}
          onHide={() => setInsertVisible(false)}
        >
          <PrimeReactProvider>
            <div className="card flex justify-content-center mt-5">
              <form id="insertTrx" onSubmit={insertForm.handleSubmit(onSubmitInsert)} className="flex flex-row gap-2">
                <Controller
                  name="cst_id"
                  control={insertForm.control}
                  rules={{ required: 'requied' }}
                  render={({ field, fieldState }) => (
                    <>
                      <span className="p-float-label">
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          optionLabel="name"
                          placeholder="Pick a Customer"
                          options={cust}
                          focusInputRef={field.ref}
                          onChange={(e) => field.onChange(e.value)}
                          className={classNames({ 'p-invalid': fieldState.error })}
                        />
                        <label htmlFor={field.name}>Customer</label>
                      </span>
                    </>
                  )}
                />

                <Controller
                  name="payment_type"
                  control={insertForm.control}
                  rules={{ required: 'requied' }}
                  render={({ field, fieldState }) => (
                    <>
                      <span className="p-float-label">
                        <AutoComplete
                          inputId={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          inputRef={field.ref}
                          className={classNames({ 'p-invalid': fieldState.error })}
                        />
                        <label htmlFor={field.name} style={{ verticalAlign: top }}>
                          Payment Type
                        </label>
                      </span>
                    </>
                  )}
                />

                <Controller name="status" control={insertForm.control} render={() => <></>} />
                <Controller name="cst_name" control={insertForm.control} render={() => <></>} />
              </form>
            </div>
            <div className="card flex justify-content-center mt-5">
              <form onSubmit={detailsForm.handleSubmit(updateTrxDetailsState)} className="flex flex-row gap-2">
                <Controller
                  name="item"
                  control={detailsForm.control}
                  rules={{ required: 'requied' }}
                  render={({ field, fieldState }) => (
                    <>
                      <span className="p-float-label">
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          optionLabel="name"
                          placeholder="Pick an Item"
                          options={goods}
                          focusInputRef={field.ref}
                          onChange={(e) => {
                            field.onChange(e.value);
                            detailsForm.setValue('price', e.value.sell_price);
                          }}
                          className={classNames({ 'p-invalid': fieldState.error })}
                        />
                        <label htmlFor={field.name}>Item</label>
                      </span>
                    </>
                  )}
                />

                <Controller
                  name="quantity"
                  control={detailsForm.control}
                  rules={{ required: 'requied' }}
                  render={({ field, fieldState }) => (
                    <>
                      <span className="p-float-label">
                        <InputNumber
                          id={field.name}
                          ref={field.ref}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(e) => field.onChange(e.value)}
                          mode="decimal"
                          inputClassName={classNames({ 'p-invalid': fieldState.error })}
                        />
                        <label htmlFor={field.name}>Quantity</label>
                      </span>
                    </>
                  )}
                />
                <Controller
                  name="price"
                  control={detailsForm.control}
                  rules={{ required: 'requied' }}
                  render={({ field, fieldState }) => (
                    <>
                      <span className="p-float-label">
                        <InputNumber
                          id={field.name}
                          ref={field.ref}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(e) => field.onChange(e.value)}
                          mode="currency"
                          currency="IDR"
                          locale="id-ID"
                          inputClassName={classNames({ 'p-invalid': fieldState.error })}
                        />
                        <label htmlFor={field.name}>Price</label>
                      </span>
                    </>
                  )}
                />
                <Button type="submit" small="true" severity="secondary" icon="pi pi-plus" />
              </form>
            </div>
            <div className="card flex justify-content-center p-fluid mt-5">
              <DataTable
                value={transactionsDetails}
                editMode="cell"
                tableStyle={{ width: '45rem' }}
                footerColumnGroup={totalColumnTemplate}
                emptyMessage=" "
              >
                <Column field="item" header="Item" align="left" style={{ width: '20%' }} onCellEditComplete={onCellEditComplete} sortable />
                <Column
                  field="quantity"
                  header="Quantity"
                  align="left"
                  style={{ width: '10%' }}
                  onCellEditComplete={onCellEditComplete}
                  sortable
                />
                <Column
                  field="price"
                  header="Price"
                  align="left"
                  body={priceBodyTemplate}
                  style={{ width: '20%' }}
                  onCellEditComplete={onCellEditComplete}
                  sortable
                />
                <Column style={{ width: '1%' }} body={deleteTrxDetails} />
              </DataTable>
            </div>
          </PrimeReactProvider>
        </Dialog>
        <Dialog header="Update Transaction" visible={updateVisible} style={{ width: '50vw' }} onHide={() => setUpdateVisible(false)}>
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
                      {getUpdateFormErrorMessage(field.name)}
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
                      <AutoComplete
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        className={classNames({ 'p-invalid': fieldState.error })}
                      />
                      {getUpdateFormErrorMessage(field.name)}
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
                      {getUpdateFormErrorMessage(field.name)}
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
                      {getUpdateFormErrorMessage(field.name)}
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

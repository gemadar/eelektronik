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
  const [currentRow, setCurrentRow] = useState(null);
  const [transactionsDetailsb, setTransactionsDetailsb] = useState([]);
  const [cust, setCust] = useState([]);
  const [goods, setGoods] = useState([]);
  const [trxId, setTrxId] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [insertVisible, setInsertVisible] = useState(false);
  const [payVisible, setPayVisible] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [cstId, setCstId] = useState('');
  const [confirmPayVisible, setConfirmPayVisible] = useState(false);
  const [confirmUpdateVisible, setConfirmUpdateVisible] = useState(false);
  const sideMenu = useRef(null);
  const toast = useRef(null);
  const defaultValues = { value: '' };
  const insertForm = useForm();
  const detailsForm = useForm();
  const detailsFormb = useForm();
  const updateForm = useForm({ defaultValues });
  const { REACT_APP_IP } = process.env;

  const footer = transactions == 0 ? `There is no transaction.` : `There are ${transactions.length} transactions.`;

  // HAMBUREGER MENU
  const sideMenuTemplate = (data) => {
    return data.status != 'paid' ? (
      <Button
        icon="pi pi-bars"
        className="mr-2"
        text
        size="small"
        severity="secondary"
        style={{height: '1px'}}
        onClick={(e) => {
          sideMenu.current.toggle(e);
          setCurrentRow(data);
        }}
        aria-controls="popup_menu_right"
        aria-haspopup
      />
    ) : null;
  };

  const sideMenuitems = [
    {
      label: 'Pay',
      icon: 'pi pi-times',
      command: () => {
        setPayVisible(true);
      }
    },
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: () => {
        setUpdateVisible(true);
        setTransactionsDetailsb(currentRow.TransactionsDetails);
        setPaymentType(currentRow ? currentRow.payment_type : '');
        setCstId(currentRow ? currentRow.cst_id : '');
        updateForm.reset({
          id: currentRow.id,
          cst_id: cust.filter((cust) => cust.id === currentRow.cst_id)[0],
          payment_type: currentRow.payment_type,
          total: parseInt(currentRow.total)
        });
      }
    }
  ];

  //HIT API
  const onSubmitInsert = async (data) => {
    data['trx_id'] = trxId;
    data['total'] = totalColumn();
    data['TransactionsDetails'] = transactionsDetails;
    data['cst_name'] = data.cst_id.name;
    data['cst_id'] = parseInt(data.cst_id.id);
    data['status'] = 'unpaid';

    insertUpdateCont(data, `${REACT_APP_IP}/trx`).then(setInsertVisible(false));

    insertState(data);

    insertForm.reset();
    setTransactionsDetails([]);
    toast.current.show({ severity: 'success', summary: 'Creating', detail: 'Data Added', life: 3000 });
  };

  const onSubmitPay = async (data) => {
    insertUpdateCont(currentRow, `${REACT_APP_IP}/trx/pay`).then(setPayVisible(false));

    payState(data);

    toast.current.show({ severity: 'success', summary: 'Payment', detail: 'Paid', life: 3000 });
  };

  const onSubmitUpdate = async (data) => {
    data['TransactionsDetails'] = transactionsDetailsb;
    data['total'] = totalCurrentColumn();
    data['cst_name'] = data.cst_id.name;
    data['cst_id'] = parseInt(data.cst_id.id);
    data['trx_id'] = currentRow.trx_id;

    insertUpdateCont(data, `${REACT_APP_IP}/trx/update`).then(setUpdateVisible(false));

    data['status'] = 'unpaid';
    updateState(data);

    toast.current.show({ severity: 'warn', summary: 'Update', detail: 'Data Updated', life: 3000 });
  };

  useEffect(() => {
    getCont(`${REACT_APP_IP}/trx`).then((data) => setTransactions(data));
    getCont(`${REACT_APP_IP}/cust`).then((data) => setCust(data));
    getCont(`${REACT_APP_IP}/goods`).then((data) => setGoods(data));
  }, [REACT_APP_IP]);

  // STATE PURPOSE
  const updateTrxDetailsState = (data) => {
    const intPrice = parseInt(data.price);
    const intQty = parseInt(data.quantity);

    if (transactionsDetails.length == 0) {
      setTransactionsDetails([
        {
          id: '23',
          item: data.item.name,
          quantity: data.quantity,
          price: intPrice * intQty,
          trx_id: trxId ? trxId : ''
        }
      ]);
    } else {
      var a = transactionsDetails.filter((obj) => obj.item === data.item.name)[0]
        ? transactionsDetails.filter((obj) => obj.item === data.item.name)[0]
        : null;

      if (a !== null) {
        const dat = transactionsDetails.map((a) => {
          if (a.item === data.item.name) {
            return {
              ...a,
              quantity: a.quantity + data.quantity,
              price: intPrice * intQty,
              trx_id: trxId ? trxId : ''
            };
          }
          return a;
        });
        setTransactionsDetails(dat);
      } else {
        setTransactionsDetails([
          ...transactionsDetails,
          {
            id: '24',
            item: data.item.name,
            quantity: data.quantity,
            trx_id: trxId ? trxId : '',
            price: intPrice * intQty
          }
        ]);
      }
    }

    detailsForm.reset();
  };

  const updateTrxDetailsStateb = (data) => {
    const intPrice = parseInt(data.price);
    const intQty = parseInt(data.quantity);

    if (transactionsDetailsb.length == 0) {
      setTransactionsDetailsb([
        {
          item: data.item.name,
          quantity: data.quantity,
          price: intPrice * intQty,
          trx_id: currentRow ? currentRow.trx_id : ''
        }
      ]);
    } else {
      var a = transactionsDetailsb.filter((obj) => obj.item === data.item.name)[0]
        ? transactionsDetails.filter((obj) => obj.item === data.item.name)[0]
        : null;

      if (a !== null) {
        const dat = transactionsDetailsb.map((a) => {
          if (a.item === data.item.name) {
            return {
              ...a,
              quantity: a.quantity + data.quantity,
              price: a.price + intPrice * intQty,
              trx_id: currentRow ? currentRow.trx_id : ''
            };
          }
          return a;
        });
        setTransactionsDetailsb(dat);
      } else {
        setTransactionsDetailsb([
          ...transactionsDetailsb,
          {
            item: data.item.name,
            quantity: data.quantity,
            price: intPrice * intQty,
            trx_id: currentRow ? currentRow.trx_id : ''
          }
        ]);
      }
    }
    detailsFormb.reset();
  };

  const insertState = (data) => {
    if (transactions.length > 0) {
      setTransactions([
        ...transactions,
        {
          id: transactions[transactions.length - 1].id + 1,
          payment_type: data.payment_type,
          cst_id: data.cst_id,
          cst_name: data.cst_name,
          trx_id: trxId,
          status: data.status,
          created_at: Date.now(),
          total: data.total,
          TransactionsDetails: transactionsDetails.map((obj) => {
            return { ...obj, created_at: Date.now() };
          })
        }
      ]);
    } else {
      setTransactions([
        {
          id: 1,
          payment_type: data.payment_type,
          cst_id: data.cst_id,
          cst_name: data.cst_name,
          trx_id: trxId,
          status: data.status,
          created_at: Date.now(),
          total: data.total,
          TransactionsDetails: transactionsDetails.map((obj) => {
            return { ...obj, created_at: Date.now() };
          })
        }
      ]);
    }
  };

  const updateState = (data) => {
    const newData = transactions.map((obj) => {
      if (obj.id === data.id) {
        return {
          ...obj,
          id: data.id,
          cst_name: data.cst_name,
          trx_id: data.trx_id,
          status: data.status,
          total: data.total,
          TransactionsDetails: data.TransactionsDetails
        };
      }
      return obj;
    });

    setTransactions(newData);
  };

  const payState = () => {
    const newData = transactions.map((obj) => {
      if (obj.id === currentRow.id) {
        return {
          ...obj,
          status: 'paid'
        };
      }
      return obj;
    });

    setTransactions(newData);
  };

  const handleDeleteTrxDetails = (data) => {
    setTransactionsDetails(transactionsDetails.filter((trx) => trx.item !== data.item));
  };

  const deleteTrxDetails = (data) => {
    return <Button onClick={() => handleDeleteTrxDetails(data)} icon="pi pi-times" text small="true" severity="danger" />;
  };

  const handleDeleteTrxDetailsb = (data) => {
    deleteCont(data['id'], `${REACT_APP_IP}/trx/delete`).then(() => {
      setTransactionsDetailsb(transactionsDetailsb.filter((trx) => trx.item !== data.item));
    });
  };

  const deleteTrxDetailsb = (data) => {
    return <Button onClick={() => handleDeleteTrxDetailsb(data)} icon="pi pi-times" text small="true" severity="danger" />;
  };

  const allowExpansion = (rowData) => {
    return rowData.TransactionsDetails.length > 0;
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

  const totalCurrentColumn = () => {
    let total = 0;

    for (let trx of transactionsDetailsb) {
      total += parseInt(trx.price);
    }

    return total;
  };

  const totalOrderColumn = () => {
    let total = 0;

    for (let trx of currentRow ? currentRow.TransactionsDetails : []) {
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
  const updateTotals = priceTemplate(totalCurrentColumn());
  const orderTotals = priceTemplate(totalOrderColumn());
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en', { month: 'long' });
  const currentDate = date.getDate() + ' ' + formatter.format(date.getMonth()) + ' ' + date.getFullYear();
  const currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  var dateTime = currentDate + ' ' + currentTime;

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

  const totalUpdateColumnTemplate = (
    <ColumnGroup>
      <Row>
        <Column footer="Totals:" colSpan={2} footerStyle={{ textAlign: 'right' }} />
        <Column footer={updateTotals} footerStyle={{ textAlign: 'left' }} />
        <Column
          footer={
            <Button
              id="updatebtn"
              disabled={
                currentRow
                  ? currentRow.payment_type == paymentType &&
                    currentRow.cst_id == cstId &&
                    currentRow.TransactionsDetails == transactionsDetailsb
                  : true
              }
              form="updateTrx"
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

  const totalPaymentColumnTemplate = (
    <ColumnGroup>
      <Row>
        <Column footer="Totals:" colSpan={2} footerStyle={{ textAlign: 'right' }} />
        <Column footer={orderTotals} footerStyle={{ textAlign: 'left' }} />
      </Row>
    </ColumnGroup>
  );

  return (
    <MainCard
      title="Transactions"
      secondary={fab(() => {
        setInsertVisible(true);
        getCont(`${REACT_APP_IP}/trx/gen`).then((data) => setTrxId(data));
      })}
    >
      <PrimeReactProvider>
        <Toast ref={toast}></Toast>
        <ConfirmDialog
          visible={confirmPayVisible}
          onHide={() => setConfirmPayVisible(false)}
          message="Are you sure you want to proceed?"
          header="Pay"
          icon="pi pi-exclamation-triangle"
          accept={onSubmitPay}
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
        <Dialog
          baseZIndex={2000}
          header={`Update Transaction - ${currentRow ? currentRow.trx_id : ''}`}
          visible={updateVisible}
          style={{ width: '50vw' }}
          onHide={() => setUpdateVisible(false)}
        >
          <PrimeReactProvider>
            <div className="card flex justify-content-center mt-5">
              <ConfirmDialog
                visible={confirmUpdateVisible}
                onHide={() => setConfirmUpdateVisible(false)}
                message="Are you sure you want to proceed?"
                header={`Updating "${currentRow ? currentRow.name : ''}"`}
                icon="pi pi-exclamation-triangle"
                accept={updateForm.handleSubmit(onSubmitUpdate)}
                reject={reject}
              />
              <form id="updateTrx" onSubmit={updateForm.handleSubmit(onSubmitUpdate)} className="flex flex-row gap-2">
                <Controller
                  name="cst_id"
                  control={updateForm.control}
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
                          onChange={(e) => {
                            field.onChange(e.value);
                            setCstId(e.target.value);
                          }}
                          className={classNames({ 'p-invalid': fieldState.error })}
                        />
                        <label htmlFor={field.name}>Customer</label>
                      </span>
                    </>
                  )}
                />

                <Controller
                  name="payment_type"
                  control={updateForm.control}
                  rules={{ required: 'requied' }}
                  render={({ field, fieldState }) => (
                    <>
                      <span className="p-float-label">
                        <AutoComplete
                          inputId={field.name}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.value);
                            setPaymentType(e.target.value);
                          }}
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

                <Controller name="status" control={updateForm.control} render={() => <></>} />
                <Controller name="cst_name" control={updateForm.control} render={() => <></>} />
              </form>
            </div>
            <div className="card flex justify-content-center mt-5">
              <form onSubmit={detailsFormb.handleSubmit(updateTrxDetailsStateb)} className="flex flex-row gap-2">
                <Controller
                  name="item"
                  control={detailsFormb.control}
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
                            detailsFormb.setValue('price', e.value.sell_price);
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
                  control={detailsFormb.control}
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
                  control={detailsFormb.control}
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
                value={transactionsDetailsb}
                editMode="cell"
                tableStyle={{ width: '45rem' }}
                footerColumnGroup={totalUpdateColumnTemplate}
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
                <Column style={{ width: '1%' }} body={deleteTrxDetailsb} />
              </DataTable>
            </div>
          </PrimeReactProvider>
        </Dialog>
        <Dialog
          baseZIndex={2000}
          header={
            <span>
              <h2>
                <b>Order Summary</b>
              </h2>{' '}
              <h4>ID: {currentRow ? currentRow.trx_id : ''}</h4>
            </span>
          }
          headerStyle={{ textAlign: 'center', marginBottom: '-2%' }}
          visible={payVisible}
          style={{ width: '40vw' }}
          onHide={() => setPayVisible(false)}
        >
          <ul style={{ display: 'table' }}>
            <li style={{ display: 'table-row', lineHeight: 1.5, fontSize: 13 }}>
              <b style={{ display: 'table-cell', paddingRight: '1em' }}>Customer</b>
              <b>:</b> &nbsp; {currentRow ? currentRow.cst_name : ''}
            </li>
            <li style={{ display: 'table-row', lineHeight: 1.5, fontSize: 13 }}>
              <b style={{ display: 'table-cell', paddingRight: '1em' }}>Payment Date</b>
              <b>:</b> &nbsp; {dateTime}
            </li>
            <li style={{ display: 'table-row', lineHeight: 1.5, fontSize: 13 }}>
              <b style={{ display: 'table-cell', paddingRight: '1em' }}>Payment Type</b>
              <b>:</b> &nbsp; {currentRow ? currentRow.payment_type : ''}
            </li>
          </ul>
          <div className="card flex justify-content-center p-fluid mt-5">
            <DataTable
              value={currentRow ? currentRow.TransactionsDetails : []}
              showGridlines
              editMode="cell"
              tableStyle={{ width: '45rem' }}
              footerColumnGroup={totalPaymentColumnTemplate}
              emptyMessage=" "
            >
              <Column field="item" header="Item" align="left" style={{ width: '20%' }} onCellEditComplete={onCellEditComplete} sortable />
              <Column
                field="quantity"
                header="Quantity"
                align="left"
                style={{ width: '3%' }}
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
            </DataTable>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3%' }}>
            <Button
              type="button"
              onClick={setConfirmPayVisible}
              size="small"
              severity="success"
              label="Pay"
              style={{ width: '20%', height: '96%' }}
            />
          </div>
        </Dialog>
      </PrimeReactProvider>
    </MainCard>
  );
}

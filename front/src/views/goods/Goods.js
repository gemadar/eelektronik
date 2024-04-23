import React, { useState, useEffect, useRef } from 'react';
import { deleteCont, getCont, insertUpdateCont, getAuthToken, getToken } from 'components/controller';
import { priceTemplate, fab } from 'components/Formatter/format';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Menu } from 'primereact/menu';
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';
import MainCard from 'ui-component/cards/MainCard';
import { test } from 'views/goods/GoodsElement';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primeflex/primeflex.css'; // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css'; // core css

export default function Goods() {
  const [goods, setGoods] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [supp, setSupp] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
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

  const footer = goods == 0 ? `There is no goods.` : `There are ${goods.length} goods.`;

  // HAMBUREGER MENU
  const sideMenuTemplate = (data) => {
    return (
      <Button
        icon="pi pi-bars"
        className="mr-2"
        style={{ height: '1px' }}
        size="small"
        text
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
          prd_code: currentRow.prd_code,
          brand: currentRow.brand,
          quantity: currentRow.quantity,
          prd_category: currentRow.prd_category,
          buy_price: currentRow.buy_price,
          sell_price: currentRow.sell_price,
          supplier_name: supp.filter((supp) => supp.name === currentRow.supplier_name)[0].name
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
    data['supplier_id'] = parseInt(data.supplier_name.id);
    data['supplier_name'] = data.supplier_name.name;
    data['quantity'] = parseInt(data.quantity);
    data['buy_price'] = parseInt(data.buy_price);
    data['sell_price'] = parseInt(data.sell_price);

    insertUpdateCont(data, `${REACT_APP_IP}/goods`).then(setInsertVisible(false));

    insertState(data);

    insertForm.reset();
    toast.current.show({ severity: 'success', summary: 'Creating', detail: 'Data Added', life: 3000 });
  };

  const onSubmitUpdate = async (data) => {
    data['id'] = currentRow.id;
    data['buy_price'] = parseInt(data.buy_price);
    data['sell_price'] = parseInt(data.sell_price);
    data['supplier_id'] = supp.filter((supp) => supp.name === data.supplier_name)[0].id;

    insertUpdateCont(data, `${REACT_APP_IP}/goods`).then(setUpdateVisible(false));

    updateState(data);

    toast.current.show({ severity: 'warn', summary: 'Update', detail: 'Data Updated', life: 3000 });
  };

  useEffect(() => {
    getCont(`${REACT_APP_IP}/goods`).then((data) => setGoods(data));
    getCont(`${REACT_APP_IP}/goods/category`).then((data) => setCategory(data));
    getCont(`${REACT_APP_IP}/goods/brand`).then((data) => setBrand(data));
    getCont(`${REACT_APP_IP}/supp`).then((data) => setSupp(data));
  }, [REACT_APP_IP]);

  // STATE PURPOSE
  const updateState = (data) => {
    const newData = goods.map((obj) => {
      if (obj.id === data.id) {
        return {
          ...obj,
          id: data.id,
          name: data.name,
          prd_code: data.prd_code,
          brand: data.brand,
          quantity: data.quantity,
          prd_category: data.prd_category,
          buy_price: data.buy_price,
          sell_price: data.sell_price,
          supplier_name: data.supplier_name,
          created_at: Date.now()
        };
      }
      return obj;
    });

    setGoods(newData);
  };

  const insertState = (data) => {
    if (goods.length > 0) {
      setGoods([
        ...goods,
        {
          id: goods[goods.length - 1].id + 1,
          name: data.name,
          prd_code: data.prd_code,
          brand: data.brand,
          quantity: data.quantity,
          prd_category: data.prd_category,
          buy_price: data.buy_price,
          sell_price: data.sell_price,
          supplier_name: data.supplier_name,
          created_at: Date.now()
        }
      ]);
    } else {
      setGoods([
        {
          id: 1,
          name: data.name,
          prd_code: data.prd_code,
          brand: data.brand,
          quantity: data.quantity,
          prd_category: data.prd_category,
          buy_price: data.buy_price,
          sell_price: data.sell_price,
          supplier_name: data.supplier_name,
          created_at: Date.now()
        }
      ]);
    }
  };

  const acceptDelete = () => {
    deleteCont(currentRow.id, `${REACT_APP_IP}/goods/delete`).then(() => {
      setGoods(goods.filter((goods) => goods.id !== currentRow.id));
    });
    toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
  };

  const reject = () => {
    setUpdateVisible(false);
    toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  // const createdDateBodyTemplate = (rowData) => {
  //   return formatTimestamp(rowData.created_at);
  // };

  const sellPriceBodyTemplate = (rowData) => {
    return priceTemplate(rowData.sell_price);
  };

  const buyPriceBodyTemplate = (rowData) => {
    return priceTemplate(rowData.buy_price);
  };

  const token = getAuthToken();
  const role = getToken();

  return (
    <MainCard
      title="Goods"
      secondary={fab(() => {
        setInsertVisible(true);
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
          value={goods}
          showGridlines
          paginator
          rows={10}
          footer={footer}
          dataKey="id"
          emptyMessage=" "
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="name" header="Name" style={{ width: '20%' }} sortable />
          <Column field="prd_code" header="Product Code" style={{ width: '20%' }} sortable />
          <Column field="brand" header="Brand" style={{ width: '20%' }} sortable />
          <Column field="quantity" header="Quantity" style={{ width: '3%' }} sortable />
          <Column
            field="buy_price"
            header="Buy Price"
            body={buyPriceBodyTemplate}
            hidden={token && role.role === 'admin' ? false : true}
            style={{ width: '20%' }}
            sortable
          />
          <Column field="sell_price" header="Sell Price" body={sellPriceBodyTemplate} style={{ width: '20%' }} sortable />
          <Column field="supplier_name" header="Supplier" style={{ width: '20%' }} sortable />
          <Column
            headerStyle={{ width: '4rem', textAlign: 'center' }}
            bodyStyle={{ textAlign: 'center', overflow: 'visible', height: '1px' }}
            body={sideMenuTemplate}
          />
        </DataTable>
        <Dialog
          baseZIndex={2000}
          header="Add Goods"
          visible={insertVisible}
          style={{ width: '50vw' }}
          onHide={() => setInsertVisible(false)}
        >
          <PrimeReactProvider>
            {test(insertForm, insertErrors, false, brand, category, '', '', onSubmitInsert, currentRow, reject, supp)}
            <Button form="addgoods" label="Submit" type="submit" icon="pi pi-check" style={{ width: '20%', float: 'right' }} />
          </PrimeReactProvider>
        </Dialog>
        <Dialog header="Update Goods" visible={updateVisible} style={{ width: '50vw' }} onHide={() => setUpdateVisible(false)}>
          <PrimeReactProvider>
            {test(
              updateForm,
              updateErrors,
              true,
              brand,
              category,
              confirmUpdateVisible,
              setConfirmUpdateVisible,
              onSubmitUpdate,
              currentRow,
              reject,
              supp
            )}
            <Button
              onClick={setConfirmUpdateVisible}
              label="Submit"
              type="button"
              icon="pi pi-check"
              style={{ width: '20%', float: 'right' }}
            />
          </PrimeReactProvider>
        </Dialog>
      </PrimeReactProvider>
    </MainCard>
  );
}

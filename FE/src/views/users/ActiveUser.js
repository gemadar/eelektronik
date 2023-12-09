import React, { useState, useEffect, useRef } from 'react';
import { createdDateBodyTemplate, updatedDateBodyTemplate, fab, formErrorMessage } from 'components/Formatter/format';
import { getCont, insertUpdateCont, getAuthToken, getToken } from 'components/controller';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Controller, useForm } from 'react-hook-form';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { PrimeReactProvider } from 'primereact/api';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { userSeverity } from 'components/Formatter/severities';
import MainCard from 'ui-component/cards/MainCard';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primeflex/primeflex.css'; // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css'; // core css

export default function ActiveUser() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insertVisible, setInsertVisible] = useState(false);
  const toast = useRef(null);
  const insertForm = useForm();
  const insertErrors = insertForm.formState.errors;
  const { REACT_APP_IP } = process.env;
  const roles = [
    { name: 'Admin', code: 'admin' },
    { name: 'Employee', code: 'employee' }
  ];

  const onSubmitInsert = async (data) => {
    data['role'] = data.role.code;

    insertUpdateCont(data, `${REACT_APP_IP}/users`).then(setInsertVisible(false));

    insertState(data);
    insertForm.reset();

    toast.current.show({ severity: 'success', summary: 'Creating', detail: 'Data Added', life: 3000 });
  };

  useEffect(() => {
    getCont(`${REACT_APP_IP}/users`).then((data) => {
      setUsers(data);
      setLoading(false);
    });
    initFilters();
  }, [REACT_APP_IP]);

  const footer = users == 0 ? `There is no user.` : `There are ${users.length} users.`;

  const insertState = (data) => {
    if (users.length > 0) {
      setUsers([
        ...users,
        {
          id: users[users.length - 1].id + 1,
          name: data.name,
          role: data.role,
          created_at: Date.now(),
          updated_at: Date.now()
        }
      ]);
    } else {
      setUsers([
        {
          id: 1,
          name: data.name,
          role: data.role,
          created_at: Date.now(),
          updated_at: Date.now()
        }
      ]);
    }
  };

  const initFilters = () => {
    setFilters({
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
      updated_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
      role: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });
  };

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="dd/mm/yy"
        placeholder="dd/mm/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const roleBodyTemplate = (rowData) => {
    return <Tag value={rowData.role} severity={userSeverity(rowData.role)} />;
  };

  const roleFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={roles}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={roleItemTemplate}
        placeholder="Select Role"
        className="p-column-filter"
        showClear
      />
    );
  };

  const roleItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const token = getAuthToken();
  const role = getToken();

  return (
    token &&
    role.role === 'admin' && (
      <MainCard title="Active Users" secondary={fab(() => setInsertVisible(true))}>
        <PrimeReactProvider>
          <Toast ref={toast}></Toast>
          <DataTable
            value={users}
            paginator
            showGridlines
            rows={10}
            loading={loading}
            dataKey="id"
            filters={filters}
            footer={footer}
            emptyMessage=" "
          >
            <Column
              field="name"
              header="Name"
              filter
              filterPlaceholder="Search by name"
              showFilterOperator={false}
              showAddButton={false}
              style={{ width: '30rem' }}
            />
            <Column
              field="role"
              header="Role"
              filterMenuStyle={{ width: '20rem' }}
              showFilterMatchModes={false}
              showFilterMenuOptions={false}
              showFilterOperator={false}
              align="center"
              style={{ width: '15rem' }}
              body={roleBodyTemplate}
              filter
              filterElement={roleFilterTemplate}
            />
            <Column
              field="created_at"
              header="Created Date"
              align="center"
              filterField="created_at"
              dataType="date"
              showFilterOperator={false}
              showAddButton={false}
              style={{ width: '22rem' }}
              body={createdDateBodyTemplate}
              filter
              filterElement={dateFilterTemplate}
            />
            <Column
              field="updated_at"
              header="Updated Date"
              align="center"
              filterField="updated_at"
              showAddButton={false}
              showFilterOperator={false}
              dataType="date"
              style={{ width: '22rem' }}
              body={updatedDateBodyTemplate}
              filter
              filterElement={dateFilterTemplate}
            />
          </DataTable>
          <Dialog
            baseZIndex={2000}
            header="Add User"
            visible={insertVisible}
            style={{ width: '50vw' }}
            onHide={() => setInsertVisible(false)}
            closeOnEscape="true"
          >
            <PrimeReactProvider>
              <div className="card flex justify-content-center">
                <form onSubmit={insertForm.handleSubmit(onSubmitInsert)} className="flex flex-column gap-2">
                  <Toast ref={toast} />
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
                    name="username"
                    control={insertForm.control}
                    rules={{ required: 'Username is required.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <label htmlFor={field.name}>Username</label>
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
                    name="password"
                    control={insertForm.control}
                    rules={{ required: 'Password is required.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <label htmlFor={field.name}>Password</label>
                        <AutoComplete
                          inputId={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          inputRef={field.ref}
                          type="password"
                          className={classNames({ 'p-invalid': fieldState.error })}
                        />
                        {formErrorMessage(field.name, insertErrors)}
                      </>
                    )}
                  />
                  <Controller
                    name="role"
                    control={insertForm.control}
                    rules={{ required: 'Role is required.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <label htmlFor={field.name}>Role</label>
                        <Dropdown
                          id={field.name}
                          value={field.value}
                          optionLabel="name"
                          placeholder="Pick a Role"
                          options={roles}
                          focusInputRef={field.ref}
                          onChange={(e) => field.onChange(e.value)}
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
        </PrimeReactProvider>
      </MainCard>
    )
  );
}

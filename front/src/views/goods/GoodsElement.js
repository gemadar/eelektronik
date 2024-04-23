import { Controller } from 'react-hook-form';
import { AutoComplete } from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { Grid } from '@mui/material';
import { InputNumber } from 'primereact/inputnumber';
import { formErrorMessage } from 'components/Formatter/format';

function test(form, errors, type, brand, category, confirmUpdate, setConfirmUpdate, submit, currentRow, reject, supp) {
  return (
    <div className="card flex justify-content-center">
      {type === true && (
        <ConfirmDialog
          visible={confirmUpdate}
          onHide={() => setConfirmUpdate(false)}
          message="Are you sure you want to proceed?"
          header={`Updating "${currentRow ? currentRow.name : ''}"`}
          icon="pi pi-exclamation-triangle"
          accept={form.handleSubmit(submit)}
          reject={reject}
        />
      )}
      <form id="addgoods" onSubmit={form.handleSubmit(submit)} className="flex flex-column gap-2">
        <Grid container spacing={8}>
          <Grid container item xs={6} className="gap-2 mt-5" direction="column">
            <Controller
              name="name"
              control={form.control}
              rules={{ required: 'Name is required.' }}
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
                    <label htmlFor={field.name}>Name</label>
                  </span>
                  {formErrorMessage(field.name, errors)}
                </>
              )}
            />
            <Controller
              name="prd_code"
              control={form.control}
              rules={{ required: 'Product Code is required.' }}
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
                    <label htmlFor={field.name}>Product Code</label>
                  </span>
                  {formErrorMessage(field.name, errors)}
                </>
              )}
            />
            <Controller
              name="brand"
              control={form.control}
              rules={{ required: 'Brand is required.' }}
              render={({ field, fieldState }) => (
                <>
                  <span className="p-float-label">
                    <Dropdown
                      style={{ width: '100%' }}
                      id={field.name}
                      value={field.value}
                      placeholder="Pick a Brand"
                      options={brand}
                      focusInputRef={field.ref}
                      onChange={(e) => field.onChange(e.value)}
                      className={classNames({ 'p-invalid': fieldState.error })}
                    />
                    <label htmlFor={field.name}>Brand</label>
                  </span>
                  {formErrorMessage(field.name, errors)}
                </>
              )}
            />
            <Controller
              name="quantity"
              control={form.control}
              rules={{ required: 'Quantity is required.' }}
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
                  {formErrorMessage(field.name, errors)}
                </>
              )}
            />
          </Grid>
          <Grid container item xs={6} className="gap-2 mt-5" direction="column">
            <Controller
              name="prd_category"
              control={form.control}
              rules={{ required: 'Product Category is required.' }}
              render={({ field, fieldState }) => (
                <>
                  <span className="p-float-label">
                    <Dropdown
                      style={{ width: '100%' }}
                      id={field.name}
                      value={field.value}
                      placeholder="Pick a Category"
                      options={category}
                      focusInputRef={field.ref}
                      onChange={(e) => field.onChange(e.value)}
                      className={classNames({ 'p-invalid': fieldState.error })}
                    />
                    <label htmlFor={field.name}>Product Category</label>
                  </span>
                  {formErrorMessage(field.name, errors)}
                </>
              )}
            />
            <Controller
              name="buy_price"
              control={form.control}
              rules={{ required: 'Buy Price is required.' }}
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
                    <label htmlFor={field.name}>Buy Price</label>
                  </span>
                  {formErrorMessage(field.name, errors)}
                </>
              )}
            />
            <Controller
              name="sell_price"
              control={form.control}
              rules={{ required: 'Sell Price is required.' }}
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
                    <label htmlFor={field.name}>Sell Price</label>
                  </span>
                  {formErrorMessage(field.name, errors)}
                </>
              )}
            />
            <Controller
              name="supplier_name"
              control={form.control}
              rules={{ required: 'Supplier is required.' }}
              render={({ field, fieldState }) => (
                <>
                  <span className="p-float-label">
                    <Dropdown
                      style={{ width: '100%' }}
                      id={field.name}
                      value={field.value}
                      optionLabel="name"
                      optionValue={type === true ? 'name' : ''}
                      placeholder="Pick a Supplier"
                      options={supp}
                      focusInputRef={field.ref}
                      onChange={(e) => field.onChange(e.value)}
                      className={classNames({ 'p-invalid': fieldState.error })}
                    />
                    <label htmlFor={field.name}>Supplier</label>
                  </span>
                  {formErrorMessage(field.name, errors)}
                </>
              )}
            />
          </Grid>
        </Grid>
        <Controller name="supplier_id" control={form.control} render={({ field }) => <>{formErrorMessage(field.name, errors)}</>} />
      </form>
    </div>
  );
}

export { test };

import React, { useEffect, useState } from "react";
import { Grid, CircularProgress, Button as MUIButton } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import * as AppURL from '../../services/urlAPI';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
// components
import PageTitle from "../../components/PageTitle";
import instance from "../../services";

export default function Tables() {
  let history = useHistory();
  const [datatableData, setData] = useState(null);
  const [rowsSelectedByUser, setRowsSelected] = useState([]);
  useEffect(() => {
    instance.get(AppURL.getAllTripBusAddress)
      .then(res => {
        const body = res?.body;
        const data = body.map(tripBusAddress => {
          let tripBusAddressData = [];
          tripBusAddressData.push(tripBusAddress?.id, tripBusAddress?.address);
          return tripBusAddressData;
        })
        setData(data);
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  const handleRowClick = (rowData, rowMeta) => {
    console.log('hello', rowData, rowMeta);
    history.push(`/app/tripBusAddress/${rowData[0]}`);
  }

  const handleRowDelete = () => {
    let rowsToDelete = [];
    datatableData.map((data, idx) => {
      if (rowsSelectedByUser.includes(idx))
        rowsToDelete.push(data[0]);
    })
    instance.post(AppURL.deleteTripBusAddresses, rowsToDelete)
      .then(res => {
        toast.success(res?.msg);
      }).catch(error => {
        toast.error(error?.msg);
        return false;
      });
  }

  const handleSelectRow = (currentRowsSelected, allRowsSelected, rowsSelected) => {
    setRowsSelected(rowsSelected);
  }

  return (
    <>
      <PageTitle title="Tables"
        button={<MUIButton
          variant="contained"
          size="medium"
          color="primary"
          onClick={() => { history.push(`/app/tripBusAddress/create`) }}
        >
          New
        </MUIButton>} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {
            datatableData ? <MUIDataTable
              title="Trip Bus Address List"
              data={datatableData}
              columns={["Code", "Address"]}
              options={{
                filterType: "checkbox",
                draggableColumns: true,
                onRowClick: handleRowClick,
                onRowsDelete: handleRowDelete,
                onRowSelectionChange: handleSelectRow
              }}
            /> : <CircularProgress />
          }

        </Grid>
      </Grid>
    </>
  );
}

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
    instance.get(AppURL.getAllLineBus)
      .then(res => {
        const body = res?.body;
        const data = body.map(lineBus => {
          let lineBusData = [];
          lineBusData.push(lineBus?.id, lineBus?.firstPoint.address, lineBus?.lastPoint.address, lineBus?.length, lineBus?.complexity);
          return lineBusData;
        })
        setData(data);
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  const handleRowClick = (rowData, rowMeta) => {
    console.log('hello', rowData, rowMeta);
    history.push(`/app/lineBuses/${rowData[0]}`);
  }

  const handleRowDelete = () => {
    let rowsToDelete = [];
    datatableData.map((data, idx) => {
      if (rowsSelectedByUser.includes(idx))
        rowsToDelete.push(data[0]);
    })
    instance.post(AppURL.deleteLineBuses, rowsToDelete)
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
          onClick={() => { history.push(`/app/lineBuses/create`) }}
        >
          New
        </MUIButton>} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {
            datatableData ? <MUIDataTable
              title="LineBus List"
              data={datatableData}
              columns={["Code", "First Point", "Last Point", "Length", "Complexity"]}
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

import React, { useEffect, useState } from "react";
import { Grid, CircularProgress, Button as MUIButton } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import * as AppURL from '../../services/urlAPI';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
// components
import PageTitle from "../../components/PageTitle/PageTitle";
import instance from "../../services";

export default function TripBus() {
  let history = useHistory();
  const [datatableData, setData] = useState(null);
  const [rowsSelectedByUser, setRowsSelected] = useState([]);
  useEffect(() => {
    instance.get(AppURL.getAllTripBus)
      .then(res => {
        const listTripBus = res?.body.listTripBus;
        const listTripBusDriver = res?.body.listTripBusDriver;
        const data = listTripBus.map(tripbus => {
          let tripBusData = [];
          let driverId = listTripBusDriver.find(item => item.tripbusId == tripbus?.id && item.roleCar == '1')?.driverId;
          let assitDriverId = listTripBusDriver.find(item => item.tripbusId == tripbus?.id && item.roleCar == '0')?.driverId;
          console.log("driverId: " + driverId);
          if(!driverId) driverId = "";
          tripBusData.push(tripbus?.id, driverId, assitDriverId, tripbus?.bus.carNumber, tripbus?.bus.color, tripbus.lineBus.firstPoint.address,  tripbus.lineBus.lastPoint.address,  tripbus?.numberGuest, tripbus?.priceTrip, tripbus?.timeTrip);
          return tripBusData;
        })
        console.log(data);
        setData(data);
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  const handleRowClick = (rowData, rowMeta) => {
    console.log('hello', rowData, rowMeta);
    // history.push(`/app/tripbus/${rowData[0]}/${rowData[1]}/${rowData[1]}`);
    history.push({
      pathname: `/app/tripbus/${rowData[0]}`,
      state: {
        id: rowData[0],
        driverId: rowData[1],
        assitanceId: rowData[2]
      }
    })
  }

  const handleRowDelete = () => {
    let rowsToDelete = [];
    datatableData.map((data, idx) => {
      if (rowsSelectedByUser.includes(idx))
        rowsToDelete.push(data[0]);
    })
    instance.post(AppURL.deleteBus, rowsToDelete)
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
          onClick={() => { history.push(`/app/tripbus/create`) }}
        >
          New
        </MUIButton>} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {
            datatableData ? <MUIDataTable
              title="TripBus List"
              data={datatableData}
              columns={[ "Id" ,"","",  "CarNumber", "color", "FirstPoint", "LastPoint","NumberGuest", "PriceTrip", "TimeTrip"]}
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

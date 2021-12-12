import React, { useEffect, useState } from "react";
import { Grid, CircularProgress, Button as MUIButton } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import * as AppURL from '../../services/urlAPI';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
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
          let driverId = listTripBusDriver.find(item => item.tripbus.id == tripbus?.id && item.roleCar == '1')?.driver?.id;
          let assitDriverId = listTripBusDriver.find(item => item.tripbus.id == tripbus?.id && item.roleCar == '0')?.driver.id;
          if(!driverId) driverId = "";
          const dateTime = new Date(tripbus?.timeTrip).toLocaleString('vi-VI');
          tripBusData.push(tripbus?.id, driverId, assitDriverId, tripbus?.bus.carNumber, tripbus?.bus.color, tripbus.lineBus.firstPoint.address,  tripbus.lineBus.lastPoint.address,  tripbus?.numberGuest, tripbus?.priceTrip, dateTime);
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
    instance.post(AppURL.deleteTripBus, rowsToDelete)
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
              // columns={[ "TripBus Code" ,,"Assistance Code",  "CarNumber", "Color", "First Point", "Last Point","Number of Guest", "Trip Price", "Trip Time"]}
              columns = {[
                {
                 name: "TripBus Code",
                 options: {
                  display: true
                 }
                },
                {
                  name: "Driver Code",
                  options: {
                   display: false
                  }
                 },
                {
                  name: "Assistance Code",
                  options: {
                   display: false
                  }
                 },
                 {
                  name: "CarNumber",
                  options: {
                   display: true
                  }
                 },
                 {
                  name: "Color",
                  options: {
                   display: true
                  }
                 },
                 {
                  name: "First Point",
                  options: {
                   display: true
                  }
                 },
                 {
                  name: "Last Point",
                  options: {
                   display: true
                  }
                 },
                 {
                  name: "Number of Guest",
                  options: {
                   display: true
                  }
                 },
                 {
                  name: "Trip Price",
                  options: {
                   display: true
                  }
                 },
                 {
                  name: "Trip Time",
                  options: {
                   display: true
                  }
                 }
               ]}
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

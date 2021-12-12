import React, { useEffect, useState } from "react";
import {
    Grid,
    CircularProgress
} from "@material-ui/core";
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import * as AppURL from '../../services/urlAPI'
import instance from "../../services";
import Widget from "../../components/Widget/Widget";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
const states = {
    sent: "success",
    pending: "warning",
    declined: "secondary",
};


const useStyles = makeStyles((theme) => ({
    input: {
        width: '80%',
        fontSize: '14px !important',
        marginBottom: '30px'
    },
}));


export default function RevenueBus() {
    const [listData, setlistData] = useState([]);
    let history = useHistory();

    const data = {
        busId: "",
        carNumber: "",
        tripBusId: "",
        numberGuest: "",
        priceTrip: "",
        timeTrip: "",
        revenue: "",
    };
    const handleRowClick = (rowData, rowMeta) => {
        console.log('hello', rowData, rowMeta);
        history.push(`/app/revenueBus/${rowData[0]}`);
      }
    instance.get(AppURL.getRevenueBus)
        .then(res => {

            const data = res?.body.map(item => {
                let labelitem = [];
                labelitem.push(item?.busId, item?.carNumber,  item?.revenue);
                return labelitem;
            })
            setlistData(data);
        })
        .catch(error => {
            toast.error("Error Found RevenueBus");
        })

console.log("listData: " + JSON.stringify(listData));

return (
    <Grid item xs={12}>
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <PageTitle
                    title="Statistical Revenue Bus"
                />
                <Widget disableWidgetMenu>
                    <Grid container item xs={12}>
                        <Grid item xs={12}>
                            {
                                listData ? <MUIDataTable
                                    title="Revenue Bus List"
                                    data={listData}
                                    columns={["Bus Code", "Car Number","Revenue"]}
                                    options={{
                                        filterType: "checkbox",
                                        draggableColumns: true,
                                        onRowClick: handleRowClick
                                      }}
                                /> : <CircularProgress />
                            }
                        </Grid>
                    </Grid>
                </Widget>
            </Grid>
        </Grid>
    </Grid>
);
}

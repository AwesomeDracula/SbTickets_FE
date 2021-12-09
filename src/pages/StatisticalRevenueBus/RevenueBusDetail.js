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
import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { Button as MUIButton } from "@material-ui/core";
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
    const { id } = useParams();
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
    let url = AppURL.getRevenueBuById + '/' + id;
    instance.get(url)
        .then(res => {

            const data = res?.body.map(item => {
                let labelitem = [];
                const dateTime = new Date(item?.timeTrip).toLocaleString('vi-VI');
                labelitem.push(item?.busId, item?.carNumber, item?.tripBusId, item?.numberGuest, item?.priceTrip, dateTime, item?.revenue);
                return labelitem;
            })
            setlistData(data);
        })
        .catch(error => {
            toast.error("Not Found");
        })

console.log("listData: " + JSON.stringify(listData));

return (
    <Grid item xs={12}>
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <PageTitle
                    title="Statistical Detail Revenue Bus"
                    buttonBack={<MUIButton
                        variant="contained"
                        size="medium"
                        color="secondary"
                        onClick={() => history.goBack()}
                    >
                        Back
                    </MUIButton>}
                />
                <Widget disableWidgetMenu>
                    <Grid container item xs={12}>
                        <Grid item xs={12}>
                            {
                                listData ? <MUIDataTable
                                    title="Detail Revenue Bus List"                                   
                                    data={listData}
                                    columns={["Bus Code", "Car Number", "TripBus Code", "Number Guest", "Trip Price", "Trip Time", "Revenue"]}
                                    options={{
                                        filterType: "checkbox",
                                        draggableColumns: true,
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

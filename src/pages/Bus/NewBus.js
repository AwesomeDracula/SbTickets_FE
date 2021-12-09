import React, { useState, useEffect } from 'react';
import { Grid, TextField, CircularProgress, Button as MUIButton } from "@material-ui/core";
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import instance from '../../services';
import * as AppURL from '../../services/urlAPI';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Utils from "../../utils";

const useStyles = makeStyles((theme) => ({
    input: {
        width: '80%',
        fontSize: '14px !important',
        marginBottom: '30px'
    },
}));

const data = {
    carNumber: "",
    color: "",
    manufacturer: "",
    lifeCar: "",
    numberSeats: "",
    dateMantain: "2022-01-01",
    yearUse: 3,
    image: "body?.image",
};

function NewBus() {
    let history = useHistory();
    const classes = useStyles();
    const [formValues, setFormValues] = useState(data);

    const handleSaveButton = () => {
        instance.post(AppURL.createBus, {
            ...formValues,
            carNumber: parseInt(formValues.carNumber),
            numberSeats: parseInt(formValues.numberSeats),
            yearUse: parseInt(formValues.yearUse),
            dateMantain: Utils.formatDateShow(formValues.dateMantain)
        })
            .then(res => {
                toast.success(res?.msg);
                history.goBack();
            })
            .catch(error => {
                toast.error(error?.msg);
            })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    return (
        <>
            {
                formValues ? <>
                    <PageTitle
                        title="Bus Details"
                        buttonBack={<MUIButton
                            variant="contained"
                            size="medium"
                            color="secondary"
                            onClick={() => history.goBack()}
                        >
                            Back
                        </MUIButton>}
                        button={<MUIButton
                            variant="contained"
                            size="medium"
                            color="primary"
                            onClick={handleSaveButton}
                        >
                            Save
                        </MUIButton>} />
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Widget disableWidgetMenu>
                                <Grid container item xs={12}>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="carNumber"
                                            name="carNumber"
                                            label="Car Number"
                                            type="text"
                                            className={classes.input}
                                            value={formValues?.carNumber}
                                            onChange={handleInputChange}
                                            type="variant"
                                            variant="outlined"
                                        />
                                        <TextField
                                            id="color"
                                            name="color"
                                            label="Color"
                                            type="text"
                                            className={classes.input}
                                            value={formValues?.color}
                                            onChange={handleInputChange}
                                            type="variant"
                                            variant="outlined"
                                        />
                                        <TextField
                                            id="manufacturer"
                                            name="manufacturer"
                                            label="Manufacturer"
                                            type="text"
                                            className={classes.input}
                                            value={formValues?.manufacturer}
                                            onChange={handleInputChange}
                                            type="variant"
                                            variant="outlined"
                                        />
                                        <TextField
                                            id="lifeCar"
                                            name="lifeCar"
                                            label="Life Car"
                                            type="text"
                                            className={classes.input}
                                            value={formValues?.lifeCar}
                                            onChange={handleInputChange}
                                            type="variant"
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="numberSeats"
                                            name="numberSeats"
                                            label="Number Seats"
                                            type="text"
                                            className={classes.input}
                                            value={formValues?.numberSeats}
                                            onChange={handleInputChange}
                                            type="variant"
                                            variant="outlined"
                                        />
                                        <TextField
                                            id="yearUse"
                                            name="yearUse"
                                            label="Year Use"
                                            type="text"
                                            className={classes.input}
                                            value={formValues?.yearUse}
                                            onChange={handleInputChange}
                                            type="variant"
                                            variant="outlined"
                                        />
                                        <TextField
                                            id="dateMantain"
                                            label="Date Maintain"
                                            type="date"
                                            sx={{ width: 220 }}
                                            onChange={handleInputChange}
                                            value={Utils.formatDateShow(formValues.dateMantain)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            name="dateMantain"
                                            className={classes.input}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Widget>
                        </Grid>
                    </Grid>
                </> : <CircularProgress />
            }

        </>
    )
}

export default NewBus

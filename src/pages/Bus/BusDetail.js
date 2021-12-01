import React, { useState, useEffect } from 'react';
import { Grid, TextField, CircularProgress, Button as MUIButton } from "@material-ui/core";
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import instance from '../../services';
import { useParams } from 'react-router-dom';
import * as AppURL from '../../services/urlAPI';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
    input: {
        width: '80%',
        fontSize: '14px !important',
        marginBottom: '30px'
    },
}));

function BusDetail() {
    let history = useHistory();
    const classes = useStyles();
    const { id } = useParams();
    const [formValues, setFormValues] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        let url = AppURL.getBus + '/' + id;
        instance.get(url)
            .then(res => {
                if (res?.status === 200) {
                    const body = res?.body;
                    let data = {
                        carNumber: body?.carNumber,
                        color: body?.color,
                        manufacturer: body?.manufacturer,
                        lifeCar: body?.lifeCar,
                        numberSeats: body?.numberSeats,
                        yearUse: body?.yearUse,
                        dateMantain: body?.dateMantain,
                    };
                    setFormValues(data);
                }

            })
    }, []);

    const handleEditButton = () => {
        if (isEditing) {
            let url = AppURL.updateBus + '/' + id;
            instance.put(url, {
                ...formValues,
                carNumber: parseInt(formValues.carNumber),
                numberSeats: parseInt(formValues.numberSeats),
                yearUse: parseInt(formValues.yearUse),
                dateMantain: '2022-01-01'
            }).then(res => {
                toast.success(res?.msg);
                history.goBack();
            }).catch(error => {
                toast.error(error?.msg);
            })
        }
        setIsEditing(!isEditing);
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
                            onClick={handleEditButton}
                        >
                            {isEditing ? 'Save' : 'Edit'}
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
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            id="dateMantain"
                                            label="Date Maintain"
                                            type="date"
                                            value={new Date(new Date(formValues?.dateMantain).getTime() - new Date(formValues?.dateMantain).getTimezoneOffset() * 60 * 1000)}
                                            sx={{ width: 220 }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            name="dateMantain"
                                            className={classes.input}
                                            variant="outlined"
                                            disabled={!isEditing}
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

export default BusDetail

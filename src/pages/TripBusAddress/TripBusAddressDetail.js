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

function TripBusAddressDetail() {
    let history = useHistory();
    const classes = useStyles();
    const { id } = useParams();
    const [formValues, setFormValues] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [datemain, setDateMain] = useState("");
    useEffect(() => {
        let url = AppURL.getTripBusAddress + '/' + id;
        console.log(url);
        instance.get(url)
            .then(res => {
                if (res?.status === 200) {
                    const body = res?.body;
                    let data = {
                        address: body?.address,
                    };
                    setFormValues(data);
                    setDateMain(body?.dateMantain);
                }

            })
    }, []);

    const handleEditButton = () => {
        if (isEditing) {
            let url = AppURL.updateTripBusAddress + '/' + id;
            instance.put(url, {
                ...formValues,
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
        console.log("name" + e.target.name + " " + e.target.value)
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
                        title="Trip Bus Address Details"
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
                                            id="address"
                                            name="address"
                                            label="Address"
                                            type="text"
                                            className={classes.input}
                                            value={formValues?.address}
                                            onChange={handleInputChange}
                                            type="variant"
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

export default TripBusAddressDetail

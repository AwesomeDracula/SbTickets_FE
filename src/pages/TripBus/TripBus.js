import React, { useState, useEffect } from 'react';
import { Grid, TextField, CircularProgress, Button as MUIButton, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import instance from '../../services';
import * as AppURL from '../../services/urlAPI';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles((theme) => ({
  input: {
    width: '80%',
    fontSize: '14px !important',
    marginBottom: '30px'
  },
}));

const data = {
  tripBusId: "",
  busId: "",
  lineBusId: "",
  numberGuest: "",
  priceTrip:"",
  timeTrip: "",
};

function TripBusNew() {
  let history = useHistory();
  const classes = useStyles();
  const [formValues, setFormValues] = useState(data);
  const [selectedDriver, setselectedDriver] = useState("");
  const [selectedassitDriver, setselectedassitDriver] = useState("");
  const [listTripBus, setListTripBus] = useState([]);
  const [listLineBus, setListLineBus] = useState([]);
  const [listDriver, setlistDriver] = useState([]);

  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
    let url = AppURL.getAllBuses;
    instance.get(url)
      .then(res => {
        if (res?.status === 200) {
          const body = res?.body;
          setListTripBus(body);
        }
      })
  }, []);

  useEffect(() => {
    let url = AppURL.getAllDrivers;
    instance.get(url)
      .then(res => {
        //console.log(res);
        if (res?.status === 200) {
          const body = res?.body;
          setlistDriver(body);
        }
      })
  }, []);
  
  useEffect(() => {
    let url = AppURL.getAllLineBus;
    instance.get(url)
      .then(res => {
        if (res?.status === 200) {
          const body = res?.body;
          setListLineBus(body);
        }

      })
  }, []);

  const handleSaveButton = () => {
    instance.post(AppURL.createTripBus, {
      ...formValues,
      driverId: selectedDriver,
      assistantBusId: selectedassitDriver,
      timeTrip: selectedDate
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
            title="TripBus"
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
                  <FormControl className="MuiTextField-root makeStyles-input-79" style={{ marginBottom: `30px`,width: `80%`}}>
                    <InputLabel id="demo-simple-select-label">List Bus</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={formValues.busId}
                      label="Bus"
                      onChange={handleInputChange}
                      name="busId"
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }}

                      //disabled={!isEditing}
                    >
                      {
                          listTripBus.length > 0 && listTripBus.map((e) => (
                            <MenuItem value={e.id}>{e.carNumber} {e.color} {e.manufacturer} </MenuItem>
                          ))
                      }

                      {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>

                  

                  <FormControl className="MuiTextField-root makeStyles-input-79" style={{ marginBottom: `30px`,width: `80%`}}>
                    <InputLabel id="demo-simple-select-label">List Driver</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="LineBus"
                      name="driverId"
                      value={selectedDriver}
                      onChange={(e) => setselectedDriver(e.target.value)}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }}

                      //disabled={!isEditing}
                    >
                      {
                          listDriver.length > 0 && listDriver.map((e) => {
                            if(selectedassitDriver === e.id) return;
                            return <MenuItem value={e.id}>{e.name}</MenuItem>
                          })
                      }
                      {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>

                  <FormControl className="MuiTextField-root makeStyles-input-79" style={{ marginBottom: `30px`,width: `80%`}}>
                    <InputLabel id="demo-simple-select-label">List Assistant</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="LineBus"
                      name="driverId"
                      value={selectedassitDriver}
                      onChange={(e) => setselectedassitDriver(e.target.value)}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }}

                      //disabled={!isEditing}
                    >
                      {
                          listDriver.length > 0 && listDriver.map((e) => {
                            if(selectedDriver === e.id) return;
                            return <MenuItem value={e.id}>{e.name}</MenuItem>
                          }
                          )
                      }
                      {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>
                  
                   
                  </Grid>
                  <Grid item xs={6}>
                    
                    {/* <TextField
                      id="numberGuest"
                      name="numberGuest"
                      label="numberGuest"
                      type="text"
                      className={classes.input}
                      value={formValues?.numberGuest}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                      disabled={true}
                    /> */}
                    <FormControl className="MuiTextField-root makeStyles-input-79" style={{ marginBottom: `30px`,width: `80%`}}>
                    <InputLabel id="demo-simple-select-label">List LineBus</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="LineBus"
                      name="lineBusId"
                      value={formValues.lineBusId}
                      onChange={handleInputChange}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }}

                      //disabled={!isEditing}
                    >
                      {
                          listLineBus.length > 0 && listLineBus.map((e) => (
                            <MenuItem value={e.id}>{e.firstPoint.address} {e.lastPoint.address}</MenuItem>
                          ))
                      }
                      {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>

                    <TextField
                      id="priceTrip"
                      name="priceTrip"
                      label="Trip Price"
                      type="text"
                      className={classes.input}
                      value={formValues.priceTrip}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                      //disabled={!isEditing}
                    />
                    
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DateTimePicker
                        label="Time trip"
                        inputVariant="outlined"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className={classes.input}
                      />
                    </MuiPickersUtilsProvider>
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

export default TripBusNew

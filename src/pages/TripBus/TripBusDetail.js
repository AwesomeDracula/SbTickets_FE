import React, { useState, useEffect } from 'react';
import { Grid, TextField, CircularProgress, Button as MUIButton, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import instance from '../../services';
import { useParams } from 'react-router-dom';
import * as AppURL from '../../services/urlAPI';
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  input: {
    width: '80%',
    fontSize: '14px !important',
    marginBottom: '30px'
  },
}));

function TripBusDetail({prop}) {
  let history = useHistory();
  let location = useLocation();
  //console.log(location.state);
  const classes = useStyles();
  const { id } = useParams();
  const { driverId } = useParams();
  const { assitanceId } = useParams();
  const [formValues, setFormValues] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [listTripBus, setListTripBus] = useState([]);
  const [listLineBus, setListLineBus] = useState([]);
  const [listDriver, setlistDriver] = useState([]);

  const [selectedDriver, setselectedDriver] = useState(location.state?.driverId);
  const [selectedassitDriver, setselectedassitDriver] = useState(location.state?.assitanceId);
  useEffect(() => {
    let url = AppURL.findTripBus + '/' + id;
    //console.log(url);
    instance.get(url)
      .then(res => {
        //console.log(res);
        if (res?.status === 200) {
          const body = res?.body;
          let data = {
            tripBusId: body?.id,
            carNumber: body?.bus.carNumber,
            busId: body?.bus.id,
            lineBusId: body?.lineBus.id,
            numberGuest: body?.numberGuest,
            priceTrip: body?.priceTrip,
            timeTrip: body?.timeTrip,
          };
          //console.log(data);
          setFormValues(data);
        }
      })
  }, []);

  useEffect(() => {
    let url = AppURL.getAllBus;
    instance.get(url)
      .then(res => {
        //console.log(res);
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
          console.log("driver: " + JSON.stringify(body));
          console.log(selectedDriver);
          console.log(selectedassitDriver);
        }

      })
  }, []);

  // useEffect(() => {
  //   if(listAllDriver.length > 0){
  //     let listDriverNew = listAllDriver.filter(e => {
  //       return e.id != selectedDriver
  //     })
  //     console.log("listDriverNew" + listDriverNew);
  //     setListTripBusAssistant(listDriverNew);
  //   }
  // }, [selectedDriver]);

  // useEffect(() => {
  //   if(listAllDriver.length > 0){
  //     let listDriverNew = listAllDriver.filter(e => {
  //       return e.id != selectedassitDriver
  //     })
  //     console.log("listDriverNewAAÂ" + listDriverNew);
  //     setlistDriver(listDriverNew);
  //   }
  // }, [selectedassitDriver]);
  
  useEffect(() => {
    let url = AppURL.getAllLineBus;
    instance.get(url)
      .then(res => {
        ////console.log(res);
        if (res?.status === 200) {
          const body = res?.body;
          setListLineBus(body);
        }

      })
  }, []);

  const handleEditButton = () => {
    if (isEditing) {
      let url = AppURL.editTripBus;
      instance.post(url, {
        ...formValues,
        driverId: selectedDriver,
        assistantBusId: selectedassitDriver,
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
    //console.log(e.target);
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
            title="TripBus Details"
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

                      disabled={!isEditing}
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

                      disabled={!isEditing}
                    >
                      {
                          listLineBus.length > 0 && listLineBus.map((e) => (
                            <MenuItem value={e.id}>{e.firstPoint} {e.lastPoint}</MenuItem>
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

                      disabled={!isEditing}
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

                      disabled={!isEditing}
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
                      id="carNumber"
                      name="carNumber"
                      label="CarNumber"
                      type="text"
                      className={classes.input}
                      value={formValues?.carNumber}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                      disabled={!isEditing}
                    /> */}
                    <TextField
                      id="numberGuest"
                      name="numberGuest"
                      label="numberGuest"
                      type="text"
                      className={classes.input}
                      value={formValues?.numberGuest}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                      disabled={!isEditing}
                    />
                    <TextField
                      id="priceTrip"
                      name="priceTrip"
                      label="priceTrip"
                      type="text"
                      className={classes.input}
                      value={formValues.priceTrip}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                      disabled={!isEditing}
                    />
                    <TextField
                      id="timeTrip"
                      name="timeTrip"
                      label="timeTrip"
                      type="text"
                      className={classes.input}
                      value={formValues.timeTrip}
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

export default TripBusDetail

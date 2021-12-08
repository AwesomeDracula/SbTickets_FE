import React, { useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress
} from "@material-ui/core";
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import * as AppURL from '../../services/urlAPI'
import instance from "../../services";
import Widget from "../../components/Widget/Widget";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
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


export default function Statistical() {
  //var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  //keys.shift(); // delete "id" key
  const classes = useStyles();
  const [listDriver, setlistDriver] = useState([]);
  const [listData, setlistData] = useState([]);
  const [timePicker, settimePicker] = useState("");
  const [selecteDriver, setSelecteDriver] = useState("");
  const [sumwages, setSumWages] = useState(0);
  console.log("timePicker: " + timePicker);
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

  const data = {
    driverName: "",
    tripBusId: "",
    scrapDateTime: "",
    roleCar: "",
    wages:"",
    fixedSalary: "",
  };

  
  
  const searchData = () => {
      if(timePicker === "" || selecteDriver === ""){
        toast.warning("Please select driver and time to Statistical");
      }
      else{
        let time = timePicker.split("-")[1].length === 1 ? timePicker.split("-")[0] + "-0" + timePicker.split("-")[1] : timePicker;
        instance.post(AppURL.getListWages, {
          id: selecteDriver,
          scrapTime: time,
        })
          .then(res => {

            const data = res?.body.map(item => {
              let labelitem = [];
              labelitem.push(item?.driverName, item?.tripBusId, item?.scrapDateTime,item?.roleCar === "1" ? "Driver" : "Assistant", item?.wages,  item?.fixedSalary);
              return labelitem;
            })

            if(data){
              let sum = 0;
              res?.body.forEach(element => {
                console.log("element?.wages" + element);
                sum = sum + parseInt(element?.wages);
                console.log(sum);
              });
              setSumWages(sum);
            }


            setlistData(data);
          })
          .catch(error => {
            toast.error("Not Found");
          })
      }
  }

  console.log("listData: " + JSON.stringify(listData));


  
  return (
    
    
    <Grid item xs={12}>
    <Grid container spacing={4}>
            <Grid item xs={12}>
            <PageTitle
                  title="Statistical Wages"
                 />
              <Widget disableWidgetMenu>
                <Grid container item xs={12}>
                  <Grid item xs={3}>
                  <FormControl className="MuiTextField-root makeStyles-input-79" style={{ marginBottom: `30px`,width: `80%`}}>
                    <InputLabel id="demo-simple-select-label">List Driver</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="LineBus"
                      name="driverId"
                      //value={selectedDriver}
                      onChange={(e) => setSelecteDriver(e.target.value)}
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
                            return <MenuItem value={e.id}>{e.name}</MenuItem>
                          })
                      }
                      {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                    
                   

                  </FormControl>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ marginBottom: `30px`,width: `80%`}}>
                      <Grid container justify="flex-start">
                          <DatePicker
                            variant="inline"
                            openTo="year"
                            views={["year", "month"]}
                            label="Year and Month"
                            helperText="Start from year selection"
                            value={timePicker}
                            onChange={(e) => {
                              //console.log(e.target.value);
                              settimePicker(e.getFullYear() + "-" +e.getMonth());
                            }}
                          />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  {/* <TextField
                      id="dob"
                      //label="Date of Birth"
                      type="date"
                      //value={new Date(new Date(formValues?.dob).getTime() - new Date(formValues?.dob).getTimezoneOffset() * 60 * 1000)}
                      sx={{ width: 220 }}
                      
                      //type="variant"
                      variant="filled"
                      className={classes.input}
                      onChange={(e) => {
                        console.log(e.target.value);
                        settimePicker(e.target.value)
                      }}
                      variant="outlined"
                    /> */}

                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={searchData}
                    style={{ marginTop: `30px`,width: `80%`}}
                  >
                     Statistical
                    </Button>
                
                  </Grid>
                  <Grid item xs={9}>

                            {
                      listData ? <MUIDataTable
                        title="TripBus List"
                        data={listData}
                        columns={[ "DriverName", "TripBusId" , "ScrapDateTime", "RoleCar", "Wages", "FixedSalary"]}
                      /> : <CircularProgress />
                    }

                    <Grid container item xs={12} style={{ marginTop: `30px`,}}>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                      <TextField
                        id="dob"
                        label="SumWages"
                        type="text"
                        value={sumwages}
                        sx={{ width: 200 }}
                        
                        //type="variant"
                        className={classes.input}
                        variant="outlined"
                        disabled={true}
                      />
                    </Grid>
                    </Grid>

                  </Grid>
                </Grid>
                </Widget>
            </Grid>
     </Grid>
     </Grid>
  );
}

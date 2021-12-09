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
import { Image } from "@material-ui/icons";
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


export default function StatisticalCustomerBook() {
  //var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  //keys.shift(); // delete "id" key
  const classes = useStyles();
  const [listTripBus, setTripBus] = useState([]);
  const [listData, setlistData] = useState([]);
  const [timePicker, settimePicker] = useState("");
  const [selecteTripBus, setSelecteTripBus] = useState("");
  const [sumwages, setSumWages] = useState(0);
  console.log("timePicker: " + timePicker);
  useEffect(() => {
    let url = AppURL.getAllTripBus;
    instance.get(url)
      .then(res => {
        //console.log(res);
        if (res?.status === 200) {
          const body = res?.body;
          setTripBus(body.listTripBus);
          console.log(JSON.stringify(listTripBus));
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
        if(selecteTripBus.length == 0){
          toast.error("Please selectTripBus");
        }
        else{
          let url = AppURL.getTripBusCustomer + '/' + selecteTripBus;
    //console.log(url);
        instance.get(url)
          .then(res => {

            const data = res?.body.map(item => {
              let labelitem = [];
              labelitem.push(item?.fullName, item?.address,item?.birthday, item?.cmt,  item?.bookseat);
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
                  title="Booked ByCustomer"
                 />
              <Widget disableWidgetMenu>
                <Grid container item xs={12}>
                  <Grid item xs={3}>
                  <FormControl className="MuiTextField-root makeStyles-input-79" style={{ marginBottom: `30px`,width: `80%`}}>
                    <InputLabel id="demo-simple-select-label">LineTripBus</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="LineTripBus"
                      name="driverId"
                      //value={selectedDriver}
                      onChange={(e) => setSelecteTripBus(e.target.value)}
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
                          listTripBus.length > 0 && listTripBus.map((e) => {
                            return <MenuItem value={e.id}>{e.lineBus.firstPoint.address} - {e.lineBus.lastPoint.address} - {e.id}</MenuItem>
                          })
                      }
                      {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                    
                   

                  </FormControl>
                  
                  <div className="MuiFormControl-root MuiTextField-root makeStyles-input-60">
                        <img src={'../laixe.jpg'}
                            variant="outlined"
                            id="image" 
                            width="200" height="120" />
                      </div>

                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ marginBottom: `30px`,width: `80%`}}>
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
                    </MuiPickersUtilsProvider> */}
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
                     Search BookedSeat
                    </Button>
                
                  </Grid>
                  <Grid item xs={9}>

                            {
                      listData ? <MUIDataTable
                        title="List Booked TripBus"
                        data={listData}
                        columns={[ "CustomerName", "Address" , "BirthDay", "NationId", "Bookseat"]}
                      /> : <CircularProgress />
                    }

                    {/* <Grid container item xs={12} style={{ marginTop: `30px`,}}>
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
                    </Grid> */}

                  </Grid>
                </Grid>
                </Widget>
            </Grid>
     </Grid>
     </Grid>
  );
}

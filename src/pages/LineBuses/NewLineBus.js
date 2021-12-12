import React, { useState, useEffect } from 'react';
import { Grid, TextField, CircularProgress, Button as MUIButton, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import instance from '../../services';
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

const data = {
  firstPoint: "",
  lastPoint: "",
  length: 0,
  complexity: 0,
};

function NewLineBus() {
  let history = useHistory();
  const classes = useStyles();
  const [formValues, setFormValues] = useState(data);

  const [firstId, setFirstId] = useState("");
  const [lastId, setLastId] = useState("");
  const [listLocation, setlistLocation] = useState([]);

  const handleSaveButton = () => {
    instance.post(AppURL.createLineBus, {
      ...formValues,
      firstId: parseInt(firstId),
      lastId: parseInt(lastId),
      length: parseInt(formValues.length),
      complexity: parseInt(formValues.complexity)
    })
      .then(res => {
        toast.success(res?.msg);
        history.goBack();
      })
      .catch(error => {
        toast.error(error?.msg);
      })
  }

  useEffect(() => {
    let url = AppURL.getLocation;
    instance.get(url)
      .then(res => {
        //console.log(res);
        if (res?.status === 200) {
          const body = res?.body;
          setlistLocation(body);
        }

      })
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  console.log("firstId " + firstId);
  console.log("lastId" + lastId);
  console.log("listLocation" + listLocation);

  return (
    <>
      {
        formValues ? <>
          <PageTitle
            title="Line Bus Details"
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
                    <InputLabel id="demo-simple-select-label">First Point</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="LineBus"
                      value={firstId}
                      onChange={(e) => setFirstId(e.target.value)}
                      name="firstPoint"
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

                    >
                      {
                          listLocation.length > 0 && listLocation.map((e) => {
                            if(lastId === e.id) return;
                            return <MenuItem value={e.id}>{e.address}</MenuItem>
                          })
                      }
                      {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>

                  <FormControl className="MuiTextField-root makeStyles-input-79" style={{ marginBottom: `30px`,width: `80%`}}>
                    <InputLabel id="demo-simple-select-label">Last Point</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="LineBus"
                      value={lastId}
                      onChange={(e) => setLastId(e.target.value)}
                      name="lastPoint"
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

                    >
                      {
                          listLocation.length > 0 && listLocation.map((e) => {
                            if(firstId === e.id) return;
                            return <MenuItem value={e.id}>{e.address}</MenuItem>
                          }
                          )
                      }
                      {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>
                    <TextField
                      id="length"
                      name="length"
                      label="Length"
                      type="number"
                      className={classes.input}
                      value={formValues?.length}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                    <TextField
                      id="complexity"
                      name="complexity"
                      label="Complexity"
                      type="number"
                      className={classes.input}
                      value={formValues?.complexity}
                      onChange={handleInputChange}
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

export default NewLineBus

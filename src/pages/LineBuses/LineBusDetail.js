import React, { useState, useEffect } from 'react';
import { Grid, TextField, CircularProgress, Button as MUIButton, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
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

function LineBusDetail() {
  let history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [formValues, setFormValues] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [listLocation, setlistLocation] = useState([]);

  const [firstId, setFirstId] = useState("");
  const [lastId, setLastId] = useState("");

  useEffect(() => {
    let url = AppURL.getLineBus + '/' + id;
    instance.get(url)
      .then(res => {
        if (res?.status === 200) {
          const body = res?.body;
          let data = {
            firstPoint: body?.firstPoint.id,
            lastPoint: body?.lastPoint.id,
            length: body?.length,
            complexity: body?.complexity,
          };
          setFirstId(body?.firstPoint.id);
          setLastId(body?.lastPoint.id);
          setFormValues(data);
        }

      })
  }, []);


  useEffect(() => {
    let url = AppURL.getLocation;
    instance.get(url)
      .then(res => {
        console.log(firstId);
        console.log(lastId);
        if (res?.status === 200) {
          const body = res?.body;
          setlistLocation(body);
        }
      })
  }, []);

  console.log("firstId " + firstId);
  console.log("lastId" + lastId);
  console.log("listLocation" + listLocation);

  const handleEditButton = () => {
    if (isEditing) {
      let url = AppURL.updateLineBus + '/' + id;
      instance.put(url, {
        ...formValues,
        firstId: parseInt(firstId),
        lastId: parseInt(lastId),
        length: parseInt(formValues.length),
        complexity: parseInt(formValues.complexity)
      })
      .then(res => {
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

                      disabled={!isEditing}
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

                      disabled={!isEditing}
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
                      type="text"
                      className={classes.input}
                      value={formValues?.length}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                      disabled={!isEditing}
                    />
                    <TextField
                      id="complexity"
                      name="complexity"
                      label="Complexity"
                      type="text"
                      className={classes.input}
                      value={formValues?.complexity}
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

export default LineBusDetail

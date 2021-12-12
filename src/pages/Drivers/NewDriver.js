import React, { useState, useEffect } from 'react';
import { Grid, TextField, CircularProgress, Button as MUIButton } from "@material-ui/core";
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
  nationalId: "",
  name: "",
  codeLicense: "",
  typeLicense: "",
  address: "",
  dob: "2000-01-01",
  seniority: 0,
  image: "../Duong-Tuan-Anh1.jpg",
};

function NewDriver() {
  let history = useHistory();
  const classes = useStyles();
  const [formValues, setFormValues] = useState(data);

  const handleSaveButton = () => {
    instance.post(AppURL.createDriver, {
      ...formValues,
      seniority: parseInt(formValues.seniority),
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
    console.log("name" + e.target.name + " " + e.target.value)
    setFormValues({
      ...formValues,
      image: "../Duong-Tuan-Anh1.jpg",
      [name]: value,
    });
  };

  return (
    <>
      {
        formValues ? <>
          <PageTitle
            title="Driver Details"
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
                      id="nationalId"
                      name="nationalId"
                      label="National ID"
                      type="text"
                      className={classes.input}
                      value={formValues?.nationalId}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                    />
                    <TextField
                      id="name"
                      name="name"
                      label="Name"
                      type="text"
                      className={classes.input}
                      value={formValues?.name}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                    />
                    <TextField
                      id="codeLicense"
                      name="codeLicense"
                      label="Code License"
                      type="text"
                      className={classes.input}
                      value={formValues?.codeLicense}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                    />
                    <TextField
                      id="typeLicense"
                      name="typeLicense"
                      label="Type License"
                      type="text"
                      className={classes.input}
                      value={formValues.typeLicense}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                    />
                  </Grid>
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
                    />
                    <TextField
                      id="dob"
                      label="Date of Birth"
                      type="date"
                      //value={new Date(new Date(formValues?.dob).getTime() - new Date(formValues?.dob).getTimezoneOffset() * 60 * 1000)}
                      sx={{ width: 220 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleInputChange}
                      name="dob"
                      className={classes.input}
                      variant="outlined"
                    />
                    <TextField
                      id="seniority"
                      name="seniority"
                      label="Seniority"
                      type="number"
                      className={classes.input}
                      value={formValues?.seniority}
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

export default NewDriver

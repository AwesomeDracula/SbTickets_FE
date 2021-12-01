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
  firstPoint: "",
  lastPoint: "",
  length: 0,
  complexity: 0,
};

function NewLineBus() {
  let history = useHistory();
  const classes = useStyles();
  const [formValues, setFormValues] = useState(data);

  const handleSaveButton = () => {
    instance.post(AppURL.createLineBus, {
      ...formValues,
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
                      id="firstPoint"
                      name="firstPoint"
                      label="First Point"
                      type="text"
                      className={classes.input}
                      value={formValues?.firstPoint}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                    />
                    <TextField
                      id="lastPoint"
                      name="lastPoint"
                      label="Last Point"
                      type="text"
                      className={classes.input}
                      value={formValues?.lastPoint}
                      onChange={handleInputChange}
                      type="variant"
                      variant="outlined"
                    />
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

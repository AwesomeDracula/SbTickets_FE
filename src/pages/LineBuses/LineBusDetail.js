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

function LineBusDetail() {
  let history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [formValues, setFormValues] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let url = AppURL.getLineBus + '/' + id;
    instance.get(url)
      .then(res => {
        if (res?.status === 200) {
          const body = res?.body;
          let data = {
            firstPoint: body?.firstPoint,
            lastPoint: body?.lastPoint,
            length: body?.length,
            complexity: body?.complexity,
          };

          setFormValues(data);
        }

      })
  }, []);

  const handleEditButton = () => {
    if (isEditing) {
      let url = AppURL.updateLineBus + '/' + id;
      instance.put(url, {
        ...formValues,
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
                    />
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

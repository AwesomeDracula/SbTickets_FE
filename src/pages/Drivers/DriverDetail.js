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
import * as Utils from "../../utils";

const useStyles = makeStyles((theme) => ({
  input: {
    width: '80%',
    fontSize: '14px !important',
    marginBottom: '30px'
  },
}));

function DriverDetail() {
  let history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [formValues, setFormValues] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let url = AppURL.getDriver + '/' + id;
    instance.get(url)
      .then(res => {
        if (res?.status === 200) {
          const body = res?.body;
          let data = {
            nationalId: body?.nationalId,
            name: body?.name,
            codeLicense: body?.codeLicense,
            typeLicense: body?.typeLicense,
            address: body?.address,
            dob: Utils.formatDateShow(body?.dob),
            seniority: body?.seniority,
            image: body?.image,
          };
          setFormValues(data);
          setImageDriver(data.image);
        }

      })
  }, []);

  const handleEditButton = () => {
    if (isEditing) {
      let url = AppURL.updateDriver + '/' + id;
      instance.put(url, {
        ...formValues,
        seniority: parseInt(formValues.seniority),
        salaryId: 1,
        dob: Utils.formatDateShow(formValues.dob),
        image: imageDrvier
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
    if(e.target.name === 'image'){
      setImageDriver("../" + e.target.files[0].name);
    }
    const { name, value }  = e.target;
    setFormValues({
      ...formValues,
      image: "../Duong-Tuan-Anh1.jpg",
      [name]: value,
    });
  };

  const [imageDrvier, setImageDriver] = useState("");

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
              onClick={handleEditButton}
            >
              {isEditing ? 'Save' : 'Edit'}
            </MUIButton>} />
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Widget disableWidgetMenu>
                <Grid container item xs={12}>
                  <Grid item xs={6}>
                      <div className="MuiFormControl-root MuiTextField-root makeStyles-input-60">
                        <img src={imageDrvier}
                            variant="outlined"
                            id="image" 
                            width="200" height="120" />
                      </div>
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
                      disabled={!isEditing}
                      style={{marginTop: `30px`}}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
                    />
                    
                  </Grid>
                  <Grid item xs={6}>
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
                      disabled={!isEditing}
                    />
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
                    <TextField
                      id="dob"
                      label="Date of Birth"
                      type="date"
                      value={Utils.formatDateShow(formValues?.dob)}
                      onChange={handleInputChange}
                      sx={{ width: 220 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      name="dob"
                      className={classes.input}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                    <TextField
                      id="seniority"
                      name="seniority"
                      label="Seniority"
                      type="text"
                      className={classes.input}
                      value={formValues?.seniority}
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

export default DriverDetail

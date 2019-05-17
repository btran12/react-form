import React, { Component, Fragment } from 'react';
import './ApplicationForms.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import util from "../Utilities";

class MinorForm extends Component {
    handleChange = event => {
        const target = event.target;

        let value = "";

        if (target.type === 'checkbox') value = target.checked;
        else {
            value = (target.type === 'file') ? target.files[0] : target.value;
        }
        const name = target.name;
        this.props.onFormChange(name, value);
    };

    render() {
        return (
            <Fragment>
                <Typography variant="h6" gutterBottom>
                    Minor Information
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isMinor"
                                    checked={this.props.isMinor}
                                    onChange={this.handleChange}
                                />
                            }
                            label="Is applicant a minor?"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Button fullWidth disabled={!this.props.isMinor} color="secondary" variant="outlined" size="small" component="label">
                            Consent Form
                            <CloudUploadIcon className="button-icon"/>
                            <input
                                type="file"
                                name="consentBlob"
                                accept=".pdf"
                                onChange={this.handleChange}
                            />
                        </Button>
                        <small>{this.props.consentBlob.name}</small>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button fullWidth disabled={!this.props.isMinor} color="secondary" variant="outlined" size="small" component="label">
                            Birth Certificate Image
                            <CloudUploadIcon className="button-icon"/>
                            <input
                                type="file"
                                name="birthCertificateBlob"
                                accept="image/jpeg"
                                onChange={this.handleChange}
                            />
                        </Button>
                        <small>(jpeg)</small>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth disabled={!this.props.isMinor}
                                   name="motherName"
                                   label="Mother's Full Name"
                                   type="text"
                                   value={this.props.motherName}
                                   onChange={this.handleChange}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth disabled={!this.props.isMinor}
                                   name="fatherName"
                                   label="Father's Full Name"
                                   type="text"
                                   value={this.props.fatherName}
                                   onChange={this.handleChange}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button fullWidth disabled={!this.props.isMinor} color="secondary" variant="outlined" size="small" component="label">
                            Mother's Passport Image
                            <CloudUploadIcon className="button-icon"/>
                            <input
                                type="file"
                                name="motherPassportBlob"
                                accept="image/jpeg"
                                onChange={this.handleChange}
                            />
                        </Button>
                        <small>(jpeg)</small>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button fullWidth disabled={!this.props.isMinor} color="secondary" variant="outlined" size="small" component="label">
                            Father's Passport Image
                            <CloudUploadIcon className="button-icon"/>
                            <input
                                type="file"
                                name="fatherPassportBlob"
                                accept="image/jpeg"
                                onChange={this.handleChange}
                            />
                        </Button>
                        <small>(jpeg)</small>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button fullWidth disabled={!this.props.isMinor} color="secondary" variant="outlined" size="small" component="label">
                            Additional Documents
                            <CloudUploadIcon className="button-icon"/>
                            <input
                                type="file"
                                name="additionalBlob, .pdf"
                                accept="image/jpeg"
                                onChange={this.handleChange}
                            />
                        </Button>
                        <small>{this.props.additionalBlob.name}</small>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <img src={util.createObjectURL(this.props.birthCertificateBlob)} 
                            alt="Birth Certificate" 
                            width="100%" 
                            hidden={this.props.birthCertificateBlob === null}/> 
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <img src={util.createObjectURL(this.props.motherPassportBlob)} 
                            alt="Mother's Passport" 
                            width="100%" 
                            hidden={this.props.motherPassportBlob === null}/> 
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <img src={util.createObjectURL(this.props.fatherPassportBlob)} 
                            alt="Father's Passport" 
                            width="100%"
                            hidden={this.props.fatherPassportBlob === null} /> 
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
    
}

export default MinorForm;
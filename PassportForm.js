import React, { Component, Fragment } from 'react';
import './ApplicationForms.css';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import { DatePicker } from 'material-ui-pickers';
import {COUNTRIES, COUNTRIES_CODE, FILTERS} from "../../constants";
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import util from "../Utilities";
import GuideLinesDialog from '../Guidelines';
import PASSPORT_BIO_PDF from '../resources/SamplePassportBioPage.pdf'
import PHOTO_PDF from '../resources/BrazilPhotoGuidelines.pdf'

const genders = [
    {
        value: 0,
        label: 'Male',
    },
    {
        value: 1,
        label: 'Female',
    }
];

class PassportForm extends Component {
    state = {
        passportGuidelines: false,
        photoGuidelines: false,
        touched: {
            firstName: false,
            lastName: false,
            gender: false,
            passport: false,
            currNationality: false,
        }
    }

    handleBlur = event => {
        const name = event.target.name;
        this.setState({
            touched: { ...this.state.touched, [name]: true },
        });
    }

    isTouched = name => {
        return this.state.touched[name];
    }

    isError = name => {
        let props = this.props;
        const firstNameValid = props.firstName.length < 3;
        const lastNameValid = props.lastName.length < 3;
        const genderValid = props.gender < 0;
        const passportValid = props.passport.length < 10;
        const nationalValid = props.currNationality.length < 1;

        //TODO changes are delayed
        if (name === 'all') {   // Check all fields for any errors. Don't care if touched or not
            let isError = firstNameValid || lastNameValid ||
                genderValid || passportValid || nationalValid;

            this.props.onFormChange('isPassportError', isError);
            return;
        }
        
        if (!this.isTouched(name)) return false;
        
        switch (name) {
            case 'firstName':
                return firstNameValid;
            case 'lastName':
                return lastNameValid;
            case 'gender':
                return genderValid;
            case 'passport':
                return passportValid;
            case 'currNationality':
                return nationalValid;
            default:
                return false;
        }
    }

    handleChange = event => {

        const target = event.target;
        const name = target.name;

        let value = null;
        if (target.type === 'file') {
            const validationObject = util.fileValidation(target.files[0]);
            value = validationObject.file;
            if (value == null) {
                this.notify(validationObject.message);
            }
        } else {
            value = target.value;
        }


        const isValidName       = FILTERS.validName.test(value);
        const isAlphaNumeric    = FILTERS.alphaNumeric.test(value);

        let grantModification = false;

        switch(name) {
            case 'passport':
                if (value === '' || isAlphaNumeric) {
                    grantModification = true;
                }
                break;
            default:
                if (name.indexOf("Name") !== -1 || name === 'maiden') {

                    if (value === '' || isValidName) {
                        grantModification = true;
                    }

                } else {
                    grantModification = true;                    
                }
                
        }
        if (grantModification) {
            this.props.onFormChange(name, value);
            this.isError('all');
        }
    };

    handleDateChange = name => date => {
        this.props.onFormChange(name, date);
    };

    notify = message => {
        this.props.onNotify(message);
    }

    handleClickOpen = event => {
        const name = event.target.name;
        if (name === 'passport') {
            this.setState({ passportGuidelines: true });            
        } else {
            this.setState({ photoGuidelines: true});
        }
    };

    handleClose = () => {
        this.setState({ 
            passportGuidelines: false,
            photoGuidelines: false 
        });
    };

    render() {
        return (
            <Fragment>
                <Typography variant="h6" gutterBottom>
                    Passport Information
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                        <Button fullWidth color="secondary" variant="outlined" size="small" component="label">
                            Passport Bio Page
                            <CloudUploadIcon className="button-icon" />
                            <input
                                type="file"
                                name="appPassportBlob"
                                accept="image/jpeg"
                                onChange={this.handleChange}
                            />
                        </Button>
                        <small>
                            <a href="#" 
                                name='passport'
                                style={{marginRight:'10px'}}
                                onClick={this.handleClickOpen}
                            >
                                Passport Guidelines
                            </a>
                            (jpeg, max 1MB)
                        </small>
                        <br/>
                        <img src={util.createObjectURL(this.props.appPassportBlob)} 
                            alt="Passport Bio" 
                            hidden={this.props.appPassportBlob === null}
                            className="thumbnail-img"/>
                        
                        <GuideLinesDialog 
                            open={this.state.passportGuidelines}
                            onHandleClose={this.handleClose}
                            title={'Passport Bio Page Guidelines'}
                            url={PASSPORT_BIO_PDF}
                        />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button fullWidth color="secondary" variant="outlined" size="small" component="label">
                            Passport Photo
                            <CloudUploadIcon className="button-icon" />
                            <input
                                type="file"
                                name="appPhotoBlob"
                                accept="image/jpeg"
                                onChange={this.handleChange}
                            />
                        </Button>
                        <small>
                            <a href="#" 
                                name='photo'
                                style={{ marginRight: '10px' }} 
                                onClick={this.handleClickOpen}
                            >
                                Photo Guidelines
                            </a>
                            (jpeg, max 1MB)
                        </small>
                        <br/>
                        <img src={util.createObjectURL(this.props.appPhotoBlob)} 
                            alt="Applicant Face Close Up" 
                            hidden={this.props.appPhotoBlob === null}
                            className="thumbnail-img"/>

                        <GuideLinesDialog
                            open={this.state.photoGuidelines}
                            onHandleClose={this.handleClose}
                            title={'Photo Guidelines'}
                            url={PHOTO_PDF}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth
                            name="firstName"
                            label="First Name"
                            value={this.props.firstName}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            error={this.isError('firstName')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth
                            name="middleName"
                            label="Middle Name"
                            value={this.props.middleName}
                            onChange={this.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth
                            name="lastName"
                            label="Last Name"
                            value={this.props.lastName}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            error={this.isError('lastName')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth select
                            name="gender"
                            label="Gender"
                            value={this.props.gender}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            error={this.isError('gender')}
                        >
                            <MenuItem value={-1}>
                                Please Select
                            </MenuItem>
                            {genders.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <DatePicker required fullWidth keyboard disableOpenOnEnter disableFuture autoOk
                            label="Date of Birth"
                            format="MM/dd/yyyy"
                            mask={value => value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [] }
                            value={this.props.birthDate}
                            onChange={this.handleDateChange('birthDate')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth select
                                   name="residence"
                                   label="Country of Residence"
                                   value={this.props.residence}
                                   onChange={this.handleChange}
                        >
                            {COUNTRIES_CODE.map((code, index) => (
                                <MenuItem key={code} value={code}>
                                    {COUNTRIES[index]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth
                                   inputProps={{ maxLength: 10 }}
                                   name="passport"
                                   label="Passport Number"
                                   value={this.props.passport}
                                   onChange={this.handleChange}
                                   onBlur={this.handleBlur}
                                   error={this.isError('passport')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <DatePicker required fullWidth keyboard disableOpenOnEnter autoOk
                                    label="Passport Date Issued"
                                    format="MM/dd/yyyy"
                                    maxDate={new Date(this.props.dateExpires)}
                                    mask={value => value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [] }
                                    value={this.props.dateIssued}
                                    onChange={this.handleDateChange('dateIssued')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <DatePicker required fullWidth keyboard disableOpenOnEnter autoOk
                                    label="Passport Expiration Date"
                                    format="MM/dd/yyyy"
                                    minDate={new Date(this.props.dateIssued)}
                                    mask={value => value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [] }
                                    value={this.props.dateExpires}
                                    onChange={this.handleDateChange('dateExpires')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField required fullWidth select
                                   name="currNationality"
                                   label="Current Nationality"
                                   value={this.props.currNationality}
                                   onChange={this.handleChange}
                                   onBlur={this.handleBlur}
                                   error={this.isError('currNationality')}
                        >
                            <MenuItem value=''> Please Select </MenuItem>
                            <MenuItem value='USA'> United States </MenuItem>
                            <MenuItem value='AUS'> Australia </MenuItem>
                            <MenuItem value='CAN'> Canada </MenuItem>
                            <MenuItem value='JPN'> Japan </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth select
                                   name="prevNationality"
                                   label="Previous Nationality"
                                   value={this.props.prevNationality}
                                   onChange={this.handleChange}
                        >
                            <MenuItem value=''> Please Select </MenuItem>
                            {COUNTRIES_CODE.map((code, index) => (
                                <MenuItem key={code} value={code}>
                                    {COUNTRIES[index]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default PassportForm;
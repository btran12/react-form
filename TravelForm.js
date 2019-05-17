import React, { Component, Fragment } from 'react';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import {DatePicker} from "material-ui-pickers";
import { FILTERS } from '../../constants';

class TravelForm extends Component {

    state = {
        touched: {
            purpose: false,
            los: false
        }
    }

    handleBlur = event => {
        const name = event.target.name;
        this.setState({
            touched: { ...this.state.touched, [name]: true}
        });
    }

    handleChange = event => {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        let grantModification = false;
        switch (name) {
            case 'los':
                if (value === '' || FILTERS.numeric.test(value)){
                    grantModification = true;
                }
                break;
            default:
                grantModification = true;
        }

        if (grantModification) {
            this.props.onFormChange(name, value);
        }
    };

    handleDateChange = name => date => {
        this.props.onFormChange(name, date);
    };

    isError(name) {
        if (!this.state.touched[name]) return false;    // Not touched yet
        switch (name) {
            case 'purpose':
                return this.props.purpose.length < 3;
            case 'los':
                return this.props.los === '';
            default:
                return true;
        }
    }

    render() {
        return (
            <Fragment>
                <Typography variant="h6" gutterBottom>
                    Travel Information
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                        <TextField required fullWidth select
                                   name="purpose"
                                   label="Purpose of Visit"
                                   type="text"
                                   value={this.props.purpose}
                                   onChange={this.handleChange}
                                   onBlur={this.handleBlur}
                                   error={this.isError('purpose')}
                        >
                            <MenuItem value=''> Please Select </MenuItem>
                            <MenuItem value='PLEASURE'> Pleasure </MenuItem>
                            <MenuItem value='BUSINESS'> Business </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker required fullWidth keyboard clearable disableOpenOnEnter disablePast autoOk
                                    label="Date of Entry"
                                    format="MM/dd/yyyy"
                                    mask={value => value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [] }
                                    value={this.props.entryDate}
                                    onChange={this.handleDateChange('entryDate')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField required fullWidth
                                    name="los"
                                    label="Length of Stay (days)"
                                    type="text"
                                    value={this.props.los}
                                    onChange={this.handleChange}
                                    onBlur={this.handleBlur}
                                    error={this.isError('los')}
                                    inputProps={{ maxLength: 4 }}
                        />
                                    
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default TravelForm;
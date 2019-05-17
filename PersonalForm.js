import React, { Component, Fragment } from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from "@material-ui/core/FormControl";
import { FILTERS, STATES } from '../../constants';

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

class PersonalForm extends Component {
    state = {
        touched: {
            address: false,
            city: false,
            state: false,
            zipcode: false,
            phone: false,
            email: false,
            marriage: false,
            occupation: false
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

        if (!this.isTouched(name)) return false;

        switch (name) {
            case 'address':
                return props.address.length < 3;
            case 'city':
                return props.city.length < 3;
            case 'state':
                return props.state.length < 3;
            case 'zipcode':
                return props.zipcode.length < 5;
            case 'phone':
                return props.phone.replace(/\D/g, '').length < 10;
            case 'email':
                return !(FILTERS.comprehensiveEmail.test(props.email));
            case 'marriage':
                return props.marriage.length < 2;
            case 'occupation':
                return props.occupation.length < 2;
            default:
                return false;
        }
    }

    handleChange = event => {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        let isValid = true;
        switch(name) {
            case 'address':
                if (!FILTERS.alphaNumeric_.test(value)) {
                    isValid = false;
                }
                break;
            case 'city':
            case 'occupation':
                if (!FILTERS.alpha.test(value)) {
                    isValid = false;
                }
                break;
            case 'zipcode':
                if (!FILTERS.numeric.test(value)) {
                    isValid = false;
                }
                break;
            case 'email':
                if (!FILTERS.validEmail.test(value)) {
                    isValid = false;
                }
                break;
            case 'maiden':
                if (!FILTERS.validName.test(value)) {
                    isValid = false;
                }
                break;
            default:
        }

        if (!isValid) {
            value = value.substring(0, value.length - 1); // Don't include the new character
        }
        
        this.props.onFormChange(name, value);
    };

    render() {
        return (
            <Fragment>
                <Typography variant="h6" gutterBottom>
                    Personal Information
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                        <TextField required fullWidth
                            name="address"
                            label="Street Address"
                            type="text"
                            value={this.props.address}
                            onChange={this.handleChange} 
                            onBlur={this.handleBlur}
                            error={this.isError('address')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth
                            name="city"
                            label="City"
                            type="text"
                            value={this.props.city}
                            onChange={this.handleChange} 
                            onBlur={this.handleBlur}
                            error={this.isError('city')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth select
                            name="state"
                            label="State"
                            type="text"
                            value={this.props.state}
                            onChange={this.handleChange} 
                            onBlur={this.handleBlur}
                            error={this.isError('state')}
                        >
                            <MenuItem value=''> Please Select </MenuItem>
                            {STATES.map((code) => (
                                <MenuItem key={code} value={code.toUpperCase()}>
                                    {code}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth
                            name="zipcode"
                            label="Zip Code"
                            type="text"
                            value={this.props.zipcode}
                            onChange={this.handleChange} 
                            onBlur={this.handleBlur}
                            inputProps={{ maxLength: 5 }}
                            error={this.isError('zipcode')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="phone-input">Phone Number *</InputLabel>
                            <Input
                                value={this.props.phone}
                                name="phone"
                                onChange={this.handleChange} 
                                onBlur={this.handleBlur}
                                id="phone-input"
                                inputComponent={TextMaskCustom}
                                required={true}
                                error={this.isError('phone')}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth
                            name="email"
                            label="Email Address"
                            type="email"
                            value={this.props.email}
                            onChange={this.handleChange} 
                            onBlur={this.handleBlur}
                            error={this.isError('email')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth select
                                   name="marriage"
                                   label="Marital Status"
                                   value={this.props.marriage}
                                   onChange={this.handleChange} 
                                   onBlur={this.handleBlur}
                                error={this.isError('marriage')}
                        >
                            <MenuItem value=''> Please Select </MenuItem>
                            <MenuItem value='SINGLE'> Single </MenuItem>
                            <MenuItem value='MARRIED'> Married </MenuItem>
                            <MenuItem value='DIVORCED'> Divorced </MenuItem>
                            <MenuItem value='WIDOWED'> Widowed </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth
                           name="maiden"
                           label="Maiden Name (if any)"
                           value={this.props.maiden}
                           onChange={this.handleChange} 
                           onBlur={this.handleBlur}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField required fullWidth
                           name="occupation"
                           label="Occupation"
                           value={this.props.occupation}
                           onChange={this.handleChange} 
                           onBlur={this.handleBlur}
                            error={this.isError('occupation')}
                        />
                    </Grid>

                </Grid>
            </Fragment>
        )
    }
}

export default PersonalForm;
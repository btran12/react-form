import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import util from "../Utilities";
import visa from "../resources/CreditCards/visa-outline.png"
import masterCard from "../resources/CreditCards/mastercard-outline.png"
import discover from "../resources/CreditCards/discover-outline.png"
import CreditCard from '@material-ui/icons/CreditCard';
import Fingerprint from '@material-ui/icons/Fingerprint';
import AttachMoney from '@material-ui/icons/AttachMoney';
import MenuItem from "@material-ui/core/MenuItem";
import { MONTHS, YEARS, FILTERS } from "../../constants";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

class PaymentForm extends Component {
    state = {
        touched: {
            creditCardName: false,
            creditCard: false,
            cvv: false,
        }
    }

    handleBlur = event => {
        const name = event.target.name;
        this.setState({
            touched: { ...this.state.touched, [name]: true},
        });
    }

    handleChange = event => {
        const target = event.target
        let value = (target.type === 'checkbox') ? target.checked : target.value;
        const name = target.name;
        
        let isValid = true;
        switch (name) {
            case 'creditCardName':
                if (!FILTERS.validName.test(value)) {
                    isValid = false;
                }
                break;
            case 'cvv':
                if (!FILTERS.numeric.test(value)) {
                    isValid = false;
                }
                break;
            case 'creditCard':
                const trimmedValue = value.trim(); 
                if (trimmedValue.length > 4 && !util.isCreditCardNumberValid(value)) { // This checks whether the first four characters are valid first
                    value = ''; // Reset the value
                }

                break;
            default:
        }
        if (!isValid) {
            value = value.substring(0, value.length - 1); // Don't include the new character
        }

        this.props.onFormChange(name, value);
    };

    isError(name) {
        switch (name) {
            case 'creditCardName':
                return this.props.creditCardName.length < 2 && this.state.touched.creditCardName;
            case 'creditCard':
                return this.props.creditCard.replace(/\D/g, '').length < 16 && this.state.touched.creditCard;
            case 'cvv':
                return this.props.cvv.length < 3 && this.state.touched.cvv;
            default:
                return false;
        }
    }

    render() {
        return (
            <Fragment>
                <Typography variant="h6" gutterBottom>
                    Payment
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                        <TextField fullWidth
                            label="Brazilian Government Fee"
                            type="text"
                            value={this.props.govFee}
                            disabled
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoney />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth
                            name="creditCardName"
                            label="Name on Card"
                            type="text"
                            value={this.props.creditCardName}
                            onChange={this.handleChange} 
                            onBlur={this.handleBlur}
                            error={this.isError('creditCardName')}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth
                            name="creditCard"
                            label="Credit Card Number"
                            type="text"
                            value={this.props.creditCard}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            inputProps={{ maxLength: 16 }}
                            error={this.isError('creditCard')}
                            required={true}
                            // eslint-disable-next-line
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCard />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div>
                            <img width="40px" src={visa} alt="Visa Credit Card Logo" />
                            <img width="40px" src={masterCard} alt="MasterCard Credit Card Logo" style={{margin: "0 5px 0 5px"}}/>
                            <img width="40px" src={discover} alt="Discover Credit Card Logo" />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth
                            name="cvv"
                            label="CVV"
                            type="text"
                            value={this.props.cvv}
                            onChange={this.handleChange} 
                            onBlur={this.handleBlur}
                            inputProps={{ maxLength: 3 }}
                            // eslint-disable-next-line
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Fingerprint />
                                    </InputAdornment>
                                ),
                            }}
                            error={this.isError('cvv')}
                            required={true}
                            />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth select
                            name="creditCardMonth"
                            label="Expiration Month"
                            value={this.props.creditCardMonth}
                            onChange={this.handleChange}
                        >
                            {MONTHS.map((code, index) => (
                                <MenuItem key={code} value={index}>
                                    {code}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField required fullWidth select
                            name="creditCardYear"
                            label="Expiration Year"
                            value={this.props.creditCardYear}
                            onChange={this.handleChange}
                        >
                            {YEARS.map((code, index) => (
                                <MenuItem key={code} value={code}>
                                    {code}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField required fullWidth select
                            name="service"
                            label="Service Fee"
                            value={this.props.service}
                            onChange={this.handleChange}
                        >
                            <MenuItem value={69}> $69.00 (11 - 15 business day processing) </MenuItem>
                            <MenuItem value={99}> $99.00 (8 - 10 business day processing)  </MenuItem>
                            <MenuItem value={149}>$149.00 (5 - 7  business day processing) </MenuItem>
                            <MenuItem value={199}>$199.00 (3 - 4  business day processing) </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="doAccept"
                                    checked={this.props.doAccept}
                                    onChange={this.handleChange}
                                    value="doAccept"
                                />
                            }
                            label="By checking this box, you understand that all fees listed above are non-refundable 
                            irrespective of final visa decision made by the Brazilian government."
                        />
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default PaymentForm;
import React, { Component, Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PersonalForm from './PersonalForm';
import {Button, Paper, Step, StepLabel, Stepper, Typography} from "@material-ui/core/index";
import PassportForm from "./PassportForm";
import TravelForm from "./TravelForm";
import PaymentForm from "./PaymentForm";
import ReviewForm from "./ReviewForm";
import {MuiPickersUtilsProvider} from "material-ui-pickers";
import DateFnsUtils from '@date-io/date-fns';
import MinorForm from "./MinorForm";
import Utilities from "../Utilities";
import Snackbar from '@material-ui/core/Snackbar';
import {isStaging} from '../../constants';

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
            width: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
    textCenter: {
        textAlign: 'center'
    },

});

const steps = ['Passport Details', 'Personal Details', 'Travel Details', 'Minor Details', 'Payment Details', 'Review'];

class BrazilForm extends Component {
    newDate = new Date();
    messageQueue = [];

    state = {
        activeStep: 0,
        notify: true,
        notifyMessage:{
            message: 'Welcome!',
            key: new Date().getTime(),
        },
        stepsDisabled: {
            passport: false,
            personal: false,
            travel: false,
            minor: false,
            payment: false
        },

        firstName:  '',
        middleName: '',
        lastName:   '',

        gender:     -1,
        birthDate: this.newDate,
        residence:  'USA',

        passport:   '',
        dateIssued: this.newDate,
        dateExpires: this.newDate,

        currNationality: '',
        prevNationality: '',

        appPassportBlob: null,
        appPhotoBlob:   null,

        address: '',
        city: '',
        state: '',
        zipcode: '',
        phone: '(  )    -    ',
        email: '',
        marriage: '',
        maiden: '',
        occupation: '',

        purpose: '',
        entryDate: this.newDate,
        los: '',
        isMinor: false,

        motherName: '',
        fatherName: '',
        consentBlob: { name: '(pdf)' },
        birthCertificateBlob: null,
        motherPassportBlob: null,
        fatherPassportBlob: null,
        additionalBlob: { name: '(jpeg, pdf)' },

        govFee: 44.24,
        creditCardName: '',
        creditCard: ' ',
        cvv: '',
        creditCardMonth: 0,
        creditCardYear: (new Date()).getFullYear(),
        service: 69,
        doAccept: false,

        isPassportError: !isStaging
    };

    isStepOptional = step => step === 3;

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleNotify = (message) => {
        this.messageQueue.push({
            message,
            key: new Date().getTime(),
        });

        if (this.state.notify) {
            this.setState({ notify: false });
        } else {
            this.processQueue();
        }
    }

    processQueue = () => {
        if (this.messageQueue.length > 0) {
            this.setState({
                notifyMessage: this.messageQueue.shift(),
                notify: true,
            });
        }
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ notify: false });
    };

    handleExited = () => {
        this.processQueue();
    };

    onChildChange = (fieldName, fieldValue) => {
        fieldValue = Utilities.formatValue(fieldValue);
        this.setState({
           [fieldName]: fieldValue
        });
    };

    render() {
        const { classes } = this.props;
        const { activeStep } = this.state;  // {} is reference to the element within state

        return (
            <Fragment>
                <CssBaseline />

                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Brazil E-Visa Application
                        </Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel>
                            {steps.map((label, index) => {
                                const labelProps = {};
                                if (this.isStepOptional(index)) {
                                    labelProps.optional = <Typography variant="caption" className={classes.textCenter}>Optional</Typography>;
                                }
                                return (
                                    <Step key={label}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>

                        <Fragment>
                            {this.state.activeStep === steps.length ? (
                                <Fragment>
                                    <Typography>All steps completed</Typography>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        {this.getStepContent(activeStep)}
                                    </MuiPickersUtilsProvider>
                                    <div className={classes.buttons}>
                                        <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                                            Back
                                        </Button>
                                        <Button disabled={this.isStepDisabled(activeStep)} variant="contained" color="primary" onClick={this.handleNext} className={classes.button}>
                                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                        </Button>
                                    </div>
                                </Fragment>
                            )}
                        </Fragment>

                    </Paper>
                </main>
                <Snackbar
                    key={this.state.notifyMessage.key}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.notify}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    onExited={this.handleExited}
                    message={this.state.notifyMessage.message}
                />
            </Fragment>
        );
    }

    getStepContent(step) {
        switch (step) {
            case 0:
                return <PassportForm {...this.state} onFormChange={this.onChildChange}  onNotify={this.handleNotify} />;
            case 1:
                return <PersonalForm {...this.state} onFormChange={this.onChildChange}  onNotify={this.handleNotify} />;
            case 2:
                return <TravelForm {...this.state} onFormChange={this.onChildChange}    onNotify={this.handleNotify} />;
            case 3:
                return <MinorForm {...this.state} onFormChange={this.onChildChange}     onNotify={this.handleNotify} />;
            case 4:
                return <PaymentForm {...this.state} onFormChange={this.onChildChange}   onNotify={this.handleNotify} />;
            case 5:
                return <ReviewForm {...this.state} onFormChange={this.onChildChange}    onNotify={this.handleNotify} />;
            default:
                throw new Error('Unknown Step');
        }
    }

    isStepDisabled(step) {
        switch (step) {
            case 0:
                return this.state.isPassportError;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                if (this.state.doAccept === false) return true;
                break;
            case 5:
                break;
            default:
                throw new Error('Unknown Step');
        }
    }

}

BrazilForm.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(BrazilForm);
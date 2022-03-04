import React from 'react';
import firebase from 'firebase/app';
import { getFirebase } from 'react-redux-firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import {
  Box, Card, IconButton, makeStyles, Typography
} from '@material-ui/core';
import { useFormik } from 'formik';

import * as Yup from 'yup';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import GrandPermition from '../../../utils/GrandPermission';
import axios from '../../../lib/axios';

const useStyles = makeStyles((theme) => ({
  closeIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }

}));

const SitesForm = ({
  showModal,
  selectedSite,
  closeModal,
  accounts,
  getRoleByUsersId,
  getAccountByName
}) => {
  const classes = useStyles();
  const firebaseG = getFirebase();
  const usersId = firebaseG.auth().currentUser.uid;
  const accIdFromRedux = getRoleByUsersId(usersId).usersAccountId;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedSite ? selectedSite.name : '',
      accountId: accIdFromRedux
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(1).required('Please write a name'), // minumum 1 ord
      accountId: Yup.string().notRequired(), // min?, required?
    }),

    onSubmit: async (values, { resetForm }) => {
      values = { ...values };
      if (selectedSite !== null) {
          try {
            // Update site
            const JWTToken = await firebase.auth().currentUser.getIdToken();
            const response = await axios.patch(`/adm/site/${selectedSite.id}`, values, {
              headers: {
                Authorization: `Bearer ${JWTToken}`
              }
            });
            const code = response.status;
            if (code >= 200 && code < 300) {
              formik.setSubmitting(false);
              closeModal();
              resetForm({ values: '' });
            }
          } catch (error) {
            formik.setSubmitting(false);
              let { message: errorMessage } = error;
              if (errorMessage === null || errorMessage === '') {
                errorMessage = 'Something went wrong. Please try again later.';
              }
              console.log(errorMessage);
          }
      } else {
        values = { ...values };
        try {
          // Create new site
          const JWTToken = await firebase.auth().currentUser.getIdToken();
          const response = await axios.post('/adm/site/', values, {
            headers: {
              Authorization: `Bearer ${JWTToken}`
            }
          });
          const code = response.status;
          if (code >= 200 && code < 300) {
            formik.setSubmitting(false);
            closeModal();
            resetForm({ values: '' });
          }
        } catch (error) {
          formik.setSubmitting(false);
            let { message: errorMessage } = error;
            if (errorMessage === null || errorMessage === '') {
              errorMessage = 'Something went wrong. Please try again later.';
            }
            console.log(errorMessage);
        }
      }
    }
  });

  const role = getRoleByUsersId(usersId).usersRole;
  const grantPermitionResult = GrandPermition(role);

// om user är ACCOUNT_USER
if (!grantPermitionResult) {
  return (
    <Dialog open={showModal} aria-labelledby="form-dialog-title">
      <Card
        style={{ padding: 24 }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box>
            <Typography
              color="textPrimary"
              variant="h2"
              align="center"
            >

              {selectedSite ? 'Edit site' : 'Add new site'}

            </Typography>
            <IconButton aria-label="close" className={classes.closeIcon} onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helpertext={formik.touched.name && formik.errors.name}
            label="Site name"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur('name')}
            onChange={formik.handleChange('name')}
            type="text"
            value={formik.values.name}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Account"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            margin="normal"
            name="companyName"
            type="text"
            value={getAccountByName(accIdFromRedux)}
          />

          <Box my={2}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"

            >

              {selectedSite ? 'Save' : 'Add Site'}

            </Button>
          </Box>
        </form>
      </Card>
    </Dialog>
  );
}
// om usern är ADMIN_USER
return (
  <Dialog open={showModal} aria-labelledby="form-dialog-title">
    <Card
      style={{ padding: 24 }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Typography
            color="textPrimary"
            variant="h2"
            align="center"
          >

            {selectedSite ? 'Edit site' : 'Add new site'}

          </Typography>
          <IconButton aria-label="close" className={classes.closeIcon} onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          fullWidth
          helpertext={formik.touched.name && formik.errors.name}
          label="Site name"
          margin="normal"
          name="name"
          onBlur={formik.handleBlur('name')}
          onChange={formik.handleChange('name')}
          type="text"
          value={formik.values.name}
        />

        <FormControl fullWidth>
          <InputLabel id="Input label">Accounts</InputLabel>
          <Select
            labelId="Input label"
            id="Select"
            error={Boolean(formik.touched.accountId && formik.errors.accountId)}
            fullWidth
            helpertext={formik.touched.accountId && formik.errors.accountId}
            onBlur={formik.handleBlur('accountId')}
            onChange={formik.handleChange('accountId')}
            value={formik.values.accountId}
          >
            {
            accounts && accounts.map((company) => {
              return (
                <MenuItem
                  value={company.id}
                  key={company.id}
                >
                  {company.companyName}
                </MenuItem>
              );
            })

            }
          </Select>
        </FormControl>

        <Box my={2}>
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"

          >

            {selectedSite ? 'Save' : 'Add Site'}

          </Button>
        </Box>
      </form>
    </Card>
  </Dialog>
);
};

SitesForm.propTypes = {
  showModal: PropTypes.bool.isRequired,
  selectedSite: PropTypes.object,
  accounts: PropTypes.array,
  closeModal: PropTypes.func,
  getAccountByName: PropTypes.func,
  getRoleByUsersId: PropTypes.func
};

export default SitesForm;

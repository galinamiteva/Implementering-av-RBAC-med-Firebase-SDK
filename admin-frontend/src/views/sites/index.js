import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  makeStyles,
  SvgIcon,
  TextField
} from '@material-ui/core';
import firebase from 'firebase/app';
import { useTranslation } from 'react-i18next';

import { Search as SearchIcon } from 'react-feather';
import { isLoaded } from 'react-redux-firebase';
import Page from 'src/components/Page';
import AlertDialog from 'src/components/AlertDialog';
import LoadingComponent from 'src/components/LoadingComponent';
import axios from '../../lib/axios';
import SitesTable from './SitesTable';
import SitesForm from './SitesForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  searchField: {
    maxWidth: 1000,
    display: 'flex',
    alignItems: 'center'
  },
  searchButton: {
    marginLeft: theme.spacing(2),
    height: 36
  },
  addNewButton: {
    marginLeft: theme.spacing(2),
    height: 36,
    alignSelf: 'center'
  }

}));

const SiteView = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [sites, setSites] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAlertModal, setShowDeleteAlertModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  async function downloadSites() {
    try {
      const JWTToken = await firebase.auth().currentUser.getIdToken();
      const response = await axios.get('/adm/sites', {
        headers: {
          Authorization: `Bearer ${JWTToken}`
        }
      });
      const code = response.status;
      if (code >= 200 && code < 300) {
        setSites(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function downloadAccounts() {
    try {
      const response = await axios.get('/adm/accounts');
      const code = response.status;
      if (code >= 200 && code < 300) {
        setAccounts(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function downloadUsers() {
    try {
      const response = await axios.get('/adm/users');
      const code = response.status;
      if (code >= 200 && code < 300) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }
// Refreshning efter varje ändring
 useEffect(() => {
  downloadSites();
  downloadAccounts();
  downloadUsers();
}, [selectedSite, showModal]);

/* Add en new site */
  const onAddSite = async () => {
    setSelectedSite(null);
    setShowModal(true);
  };

  const onUpdateSite = async (e, site) => {
    e.stopPropagation();
    setSelectedSite(site);
    setShowModal(true);
  };

   const onAskToDeleteSite = (e, site) => {
    e.stopPropagation();
    setSelectedSite(site);
    setShowDeleteAlertModal(true);
  };
// Delete site med refreshing
  const deleteSite = async (e, site) => {
    e.stopPropagation();
    setSelectedSite(site);

    try {
      const response = await axios.delete(`/adm/site/${selectedSite.id}`);
      const code = response.status;
      if (code >= 200 && code < 300) {
        setSelectedSite(null);
        console.log('en site var deleted-SiteID:', selectedSite.id);
      }
    } catch (err) {
      console.error(err);
    }
    setShowDeleteAlertModal(false);
  };

  const onModalClosed = () => {
    setShowModal(false);
  };

  const onSearchKeyChanged = (e) => {
    setSearchTerm(e.target.value);
  };

 const onCancelSearch = (e) => {
  e.preventDefault();
  setSearchTerm('');
  };

  const onAlertDialogClsed = () => {
    setShowDeleteAlertModal(false);
  };

  const getAccountByName = (accountId) => {
    let accountName = null;
    accounts.forEach((value) => {
      if (accountId === value.id) {
        accountName = value.companyName;
      }
    });
    return accountName;
  };

  const getRoleByUsersId = (userId) => {
    let usersRole = null;
    let usersAccountId = null;
    users.forEach((value) => {
      if (userId === value.id) {
        usersRole = value.role;
        usersAccountId = value.accountId;
      }
    });
    return { usersRole, usersAccountId };
  };

  return (
    <Page
      className={classes.root}
      title={t('sites')}
    >
      <Container maxWidth={false}>
        <div>
          <Box>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                >
                  <Box className={classes.searchField}>
                    <TextField
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon
                              fontSize="small"
                              color="action"
                            >
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        )
                      }}
                      placeholder="Search sites name"
                      variant="outlined"
                      onChange={onSearchKeyChanged}

                    />
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.searchButton}
                      onClick={onCancelSearch}
                      type="reset"
                    >
                      Search
                    </Button>
                  </Box>
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.addNewButton}
                    onClick={onAddSite}
                  >
                    Add new site
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </div>
        <Box mt={3}>
          {isLoaded(sites) ? (
            <SitesTable
              searchTerm={searchTerm}
              data={sites}
              getRoleByUsersId={getRoleByUsersId}
              onUpdateSite={onUpdateSite}
              onAskToDeleteSite={onAskToDeleteSite}
              getAccountByName={getAccountByName}
            />
          ) : <LoadingComponent />}
        </Box>
        <SitesForm
          showModal={showModal}
          selectedSite={selectedSite}
          accounts={accounts}
          closeModal={onModalClosed}
          getAccountByName={getAccountByName}
          getRoleByUsersId={getRoleByUsersId}
        />
        <AlertDialog
          showModal={showDeleteAlertModal}
          title="Delete site?"
          content="Are you sure to delete this site?"
          onAccept={deleteSite}
          closeModal={onAlertDialogClsed}
        />
      </Container>
    </Page>
  );
};

export default SiteView;

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getFirebase } from 'react-redux-firebase';
import axios from '../lib/axios';

const PrivateRoute = ({ component: Component, type, ...rest }) => {
    const [accounts, setAccounts] = useState([]);
    const [users, setUsers] = useState([]);

    // Downloading accounts - collections
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

      useEffect(() => {
        downloadAccounts();
        downloadUsers();
        return () => {
            setAccounts([]); // det funkar i stackoverflow
          };
      }, []);
     // console.log('OUTSIDE ACCOUNTS ', accounts);

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

    const firebaseG = getFirebase();
  const usersId = firebaseG.auth().currentUser.uid;
    const accountId = getRoleByUsersId(usersId).usersAccountId;

    const getTypeFromAccount = (accountsId) => {
        let accountType = '';
        accounts.forEach((value) => {
          if (accountsId === value.id) {
            accountType = value.type;
          }
        });
        return accountType;
      };

    const currentUserAccountsType = getTypeFromAccount(accountId); // BASIC ACCOUNT
    const grantPermission = type.includes(currentUserAccountsType); // gav true
    console.log('GRANT PERMISSION ', grantPermission);

     if (!usersId) {
        return (<Navigate to="/login" replace />);
    }

    if (usersId) {
        return (<Component {...rest} />);
    }

    return (<Navigate to="/dashboard" replace />);
  };
  export default PrivateRoute;

  PrivateRoute.propTypes = {
    component: PropTypes.any,
    type: PropTypes.array
  };

/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
} from '@material-ui/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getFirebase } from 'react-redux-firebase';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GrandPermition from '../../utils/GrandPermission';

const SitesTable = ({ data, searchTerm, onUpdateSite, onAskToDeleteSite,
   getAccountByName, getRoleByUsersId }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

const firebaseG = getFirebase();
const usersId = firebaseG.auth().currentUser.uid;
const role = getRoleByUsersId(usersId).usersRole;

const grantPermitionResult = GrandPermition(role);
  // if user är ACCOUNT_USER
if (!grantPermitionResult) {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              <TableCell align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {data.filter((val) => {
              if (searchTerm === '') {
                return val;
              } if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return val;
              }
            }).slice(0, limit).map((site) => {
              return (
                <TableRow
                  hover
                  key={site.id}
                >
                  <TableCell>
                    {site.name}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => onUpdateSite(e, site)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={(e) => onAskToDeleteSite(e, site)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
            );
})}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
      />
    </Card>
  );
}
return (
  <Card>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {/* <TableCell>
              Id
            </TableCell> */}
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Company name
            </TableCell>
            <TableCell align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {data.filter((val) => {
            if (searchTerm === '') {
              return val;
            } if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return val;
            }
          }).slice(0, limit).map((site) => {
            return (
              <TableRow
                hover
                key={site.id}
              >
                <TableCell>
                  {site.name}
                </TableCell>
                <TableCell>
                  {getAccountByName(site.accountId)}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => onUpdateSite(e, site)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={(e) => onAskToDeleteSite(e, site)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
          );
})}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      component="div"
      count={data.length}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleLimitChange}
      page={page}
      rowsPerPage={limit}
    />
  </Card>
);
};

SitesTable.propTypes = {
  data: PropTypes.array.isRequired,
  searchTerm: PropTypes.string,
  onUpdateSite: PropTypes.func,
  onAskToDeleteSite: PropTypes.func,
  getAccountByName: PropTypes.func,
  getRoleByUsersId: PropTypes.func,
};

export default SitesTable;

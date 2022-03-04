import React from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@material-ui/core';
import PropTypes from 'prop-types';

const AlertDialog = ({
  showModal,
  title,
  content,
  onAccept,
  closeModal,
}) => {
  return (
    <Dialog
      open={showModal}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAccept} color="primary" autoFocus>
          OK
        </Button>
        <Button onClick={closeModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  showModal: PropTypes.bool.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  onAccept: PropTypes.func,
  closeModal: PropTypes.func,
};

export default AlertDialog;

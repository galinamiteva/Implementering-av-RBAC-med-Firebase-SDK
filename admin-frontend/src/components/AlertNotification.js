import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const AlertNotification = forwardRef((
  {
    severity = 'success',
    error = '',
    onClose,
    ...rest
  }, ref
) => {
  return (
    <Snackbar
      ref={ref}
      {...rest}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open
      severity={severity}
      message={error}
      autoHideDuration={3000}
      onClose={onClose}
      action={(
        <>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      )}
    />
  );
});

AlertNotification.propTypes = {
  severity: PropTypes.string,
  error: PropTypes.string,
  onClose: PropTypes.func
};

export default AlertNotification;

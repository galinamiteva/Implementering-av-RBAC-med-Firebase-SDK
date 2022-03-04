import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));

const LoadingComponent = () => {
  const classes = useStyles();
  return (
    <div
      className={classes.loader}
    >
      <CircularProgress />
    </div>
  );
};

export default LoadingComponent;

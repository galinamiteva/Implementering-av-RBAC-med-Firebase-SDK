const Role = {
  ADMIN_USER: 'ADMIN_USER',
  ACCOUNT_USER: 'ACCOUNT_USER' };

const GrandPersmission = (role) => {
  if (role === Role.ADMIN_USER) {
    return true;
  }

    return false;
  };
  export default GrandPersmission;

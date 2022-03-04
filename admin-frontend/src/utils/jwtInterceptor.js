import axios from 'axios';

import firebase from 'firebase/app';

async function jwtInterceptorDefault() {
    axios.interceptors.request.use(async (request) => {
        // add auth header with jwt if account is logged in and request is to the api url
        const JWTToken = await firebase.auth().currentUser.getIdToken();
        if (JWTToken) {
            request.headers.Authorization = `Bearer ${JWTToken}`;
        }
        return request;
    });
}

export default jwtInterceptorDefault;

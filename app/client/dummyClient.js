import { get, post } from './fetchWrapper';

const API_CLIENT_URL = process.env.NEXT_PUBLIC_API_CLIENT_URL;

function sendOtp(mobileNo) {   
    return post(`${API_CLIENT_URL}/user/request-otp?username=${mobileNo}`, null);
}

function generateToken(username, otp, password) {   
    return post(`${API_CLIENT_URL}/user/generate/login/token`, { username, otp });
}

function getRefreshToken(token) {   
    return post(`${API_CLIENT_URL}/user/refresh-token`, { token });
}

function getCurrentUser(accessToken) {
    return get(`${API_CLIENT_URL}/current-user`, {
        headers: {
            'x-auth-token': accessToken
        }
    });
}

function getBankDetailsByParams(projectId) {
    let searchUrl = `${API_CLIENT_URL}/bank-details/get/all`
    if(!!projectId) {
        searchUrl = addSearchParam(searchUrl,"projectId=" + projectId)
    }
    return get(searchUrl, { next: { cache: false }});
}

function addSearchParam(url, param){
    return url + (url.indexOf("?") > -1 ? "&":"?") + param;
}

export {
    generateToken,
    getCurrentUser,
    sendOtp,
    getRefreshToken
}
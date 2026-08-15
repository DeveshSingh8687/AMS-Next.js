import { get, post } from './fetchWrapper';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

function logOut (email, password) {   
    return post(`${API_CLIENT_URL}/auth/login`, { email, password });
}

export {
    logOut,
}
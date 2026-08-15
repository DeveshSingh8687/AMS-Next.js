import { _delete, get, patch, post, put } from './fetchWrapper';

const API_CLIENT_URL = process.env.NEXT_PUBLIC_API_BASE_URL

function getAllEmployee(token) {
    console.log(token, 'in APi')
    return get(`${API_CLIENT_URL}/users`, token);
}

function addnewEmployee(employeeData, token) {
    return post(`${API_CLIENT_URL}/users`, employeeData, token);
}

function updateEmployee(userId, employeeData, token) {
    return put(`${API_CLIENT_URL}/users/${userId}`, employeeData, token);
}

function deleteEmployee(userId, token) {
    return _delete(`${API_CLIENT_URL}/users/${userId}`, token);
}

function toggleUserStatus(userId, token) {
    return patch(`${API_CLIENT_URL}/users/${userId}/toggle-login`, token);
}

export {
    getAllEmployee,
    addnewEmployee,
    updateEmployee,
    deleteEmployee,
    toggleUserStatus
}

Object.defineProperty(Promise, 'allKeys', {
    configurable: true,
    writable: true,
    value: async function allKeys(object) {
        const resolved = {}
        const promises = Object
            .entries(object)
            .map(async ([key, promise]) =>
                resolved[key] = await promise
            )
        await Promise.all(promises)
        return resolved
    }
});

function get(url, token, options = {}) {
    console.log(token, 'tokenq', url)
    const requestOptions = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body, token, options = {}) {
    const requestOptions = {
        method: 'POST',
        origin: null,
        body: JSON.stringify(body),
        cache: 'no-store',
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body, token, options = {}) {
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(body),
        cache: 'no-store',
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url, token, options = {}) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function patch(url, token, body, options = {}) {
    const requestOptions = {
        method: 'PATCH',
        body: JSON.stringify(body),
        cache: 'no-store',
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}


export {
    get,
    post,
    put,
    _delete,
    patch
};
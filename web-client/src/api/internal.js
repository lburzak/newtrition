import AuthStorage from '../auth/storage'

const URL = '/api';

export async function api(path, init) {
    return await fetch(`${URL}/${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init.headers
        },
    });
}

export async function apiAuthenticated(path, init) {
    return await api(path, {
        ...init,
        headers: {
            "Authorization": `Bearer ${AuthStorage.accessToken}`,
            ...init.headers
        }
    })
}
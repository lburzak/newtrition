class AuthStorage {
    get username() {
        return localStorage.getItem('username');
    }

    set username(value) {
        localStorage.setItem('username', value);
    }

    get accessToken() {
        return localStorage.getItem('accessToken');
    }

    set accessToken(value) {
        localStorage.setItem('accessToken', value);
    }

    clear() {
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
    }
}

const authStorage = new AuthStorage();
export default authStorage;
export default class Result {
    payload;
    error;

    constructor({payload, error}) {
        this.payload = payload;
        this.error = error;
    }

    static success(payload) {
        return new Result({payload});
    }

    static failure(error, payload) {
        return new Result({error, payload});
    }

    get isSuccess() { return this.error === undefined || this.error === null; }
    get isFailure() { return !this.isSuccess };
}
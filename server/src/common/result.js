class Result {
    error;
    data;

    constructor(error, data) {
        this.error = error;
        this.data = data;
    }

    get hasError() {
        return this.error != null
    }

    static withError(error) {
        return new Result(error, null);
    }

    static empty() {
        return new Result(null, null);
    }
}

module.exports = Result;
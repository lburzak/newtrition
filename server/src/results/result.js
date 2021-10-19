module.exports = {
    withError: (error) => ({error}),
    withData: (data) => ({data}),
    empty: () => ({})
};
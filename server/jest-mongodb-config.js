module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            skipMD5: true,
        },
        autoStart: false,
        instance: {},
    },
    useSharedDBForAllJestWorkers: false,
    mongoURLEnvName: 'MONGO_URI'
};
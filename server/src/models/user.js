module.exports = {
    serializeUser: (userEntity) => ({
        username: userEntity.username
    })
};
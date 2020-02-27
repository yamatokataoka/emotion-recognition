module.exports = {
    mqtt: {
        http: {
            port: process.env.PORT || 3002,
            bundle: true,
            static: './'
        }  
    }
}

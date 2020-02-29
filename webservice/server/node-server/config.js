module.exports = {
    mqtt: {
        http: {
            port: parseInt(process.env.PORT) || 3002,
            bundle: true,
            static: './'
        }  
    }
}

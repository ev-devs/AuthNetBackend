const mysql = require('mysql')

// first let us connect to the mysql database
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'devices'
})

const query = connect.query("INSERT INTO devices (guid) VALUES(" + guid  + ");", function(error, result){
    if (error) {
        console.log(error)
    }
    else {
        console.log(result)
    }
})

connection.connect(function(error){
    if (error){
        console.log("There was an error connecting to the mysql database")
    }
    console.log('Connection')
})

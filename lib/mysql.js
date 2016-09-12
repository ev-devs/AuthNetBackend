const mysql = require('mysql')

// first let us define the connection
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'devices'
})


// now let us connect
connection.connect(function(error){
    if (error){
        console.log("There was an error connecting to the mysql database")
    }
    console.log('Connected to mysql database')
})

// Now let us query the database
const query = connection.query("INSERT INTO devices (guid) VALUES(" + guid  + ");", function(error, result){
    if (error) {
        console.log(error)
    }
    else {
        console.log(result)
    }
})

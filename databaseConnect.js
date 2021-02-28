var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '55555',
  database : 'fintech'
});
 
connection.connect();
 
connection.query('SELECT * FROM fintech.user;', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});
 
connection.end();
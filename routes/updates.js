/**
 * http://usejsdoc.org/
 */
var mysql = require('mysql');

exports.postupdates = function(req, res) {

  var type = req.body.type;
  var post = req.body.post;
  emailid = req.session.emailid;
  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();
  query = connection.query('SELECT * from fbusers where emailid=?',
      [ emailid ], function(err, rows, fields) {
        if (!err) {
          result = rows[0];
          ID = result["ID"];
          console.log("id" + ID);
          var updates = {
            userid : ID,
            post : post,
            type : type
          };
          query = connection.query('INSERT INTO updates set ?', [ updates ],
              function(err, rows, fields) {
                console.log(query.sql);

              })
        }

        connection.end();
      })

};
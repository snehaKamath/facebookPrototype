/**
 * http://usejsdoc.org/
 */
var mysql = require('mysql');
exports.about_details = function(req, res) {

  emailid = req.session.emailid;
  var mysql = require('mysql');

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();

  query = connection.query('SELECT ID from fbusers where emailid=?', emailid,
      function(err, rows, fields) {
        if (!err) {
          result = rows[0];
          id = result["ID"];
          query = connection.query('SELECT * from aboutusers where userid=?',
              id, function(err, rows, fields) {

                if (!err) {
                  result = rows[0];
                  var about_details = {
                    bio : result["bio"],
                    study : result["study"],
                    work : result["work"],
                    music : result["music"],
                    sports : result["sports"]
                  };
                  res.send(about_details);
                } else {
                  console.log(err);
                }
                connection.end();
              });

        }
      })
};

exports.posts_details = function(req, res) {

  var mysql = require('mysql');
  emailid = req.session.emailid;
  console.log("email id session:" + emailid);
  console.log("inside posts_details");
  console.log("email" + emailid);
  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();

  query = connection.query('SELECT ID from fbusers where emailid=?', emailid,
      function(err, rows, fields) {
        if (!err) {
          updates = [];
          result = rows[0];
          id = result["ID"];
          query = connection.query(
              'SELECT * from updates where userid=? ORDER BY updateTime DESC',
              id, function(err, rows, result) {

                if (!err) {
                  if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                      result = rows[i];
                      updates.push({
                        post : result["post"],
                        type : result["type"],
                        time : result["updateTime"]
                      });

                    }

                    res.send(updates);
                  } else {

                  }
                  ;
                } else {
                  console.log("error");
                }
                connection.end();
              })

        }
        // connection.end();
      })
}

exports.suggestFriends = function(req, res) {

  emailid = req.session.emailid;
  var mysql = require('mysql');

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();

  suggest_friends = [];
  query = connection
      .query(
          'SELECT ID from fbusers where emailid=?',
          emailid,
          function(err, rows, fields) {
            if (!err) {

              result = rows[0];
              id = result["ID"];

              query = connection
                  .query(
                      'select fname,lname from fbusers where fbusers.ID NOT IN(select friendid from friends where fbusers.ID=friendid and userid=?)',
                      id, function(err, rows, fields) {
                        if (!err) {
                          for (var i = 0; i < rows.length; i++) {
                            result = rows[i];
                            fname = result["fname"];
                            lname = result["lname"];
                            suggest_friends.push({
                              fname : fname,
                              lname : lname
                            });
                            console.log("fname:" + fname);
                          }
                          res.send(suggest_friends);
                        } else {
                          console.log(err);
                        }
                        connection.end();
                      })
            }

          });

}

/*
 * GET users listing.
 */

exports.list = function(req, res) {
  res.send("respond with a resource");
};

var mysql = require('mysql');

exports.signup = function(req, res) {

  var fname = req.body.fname;
  var lname = req.body.lname;
  var emailid = req.body.emailid;
  var password = req.body.password;
  var signup_values = {
    fname : fname,
    lname : lname,
    emailid : emailid,
    password : password

  };

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();
  query = connection.query('SELECT * from fbusers where emailid=?',
      [ signup_values.emailid ], function(err, rows, fields) {

        if (!err) {
          if (rows.length > 1) {
            //res.send({result:"Email Id already exists!"});
          } else {
            connection.query('INSERT INTO fbusers set ?', signup_values,
                function(err, rows, fields) {

                  if (!err) {
                    req.session.emailid = signup_values.emailid;
                    res.send({
                      result : "success"
                    });

                  } else {
                    res.send('Error while performing signup Query!');
                  }
                  connection.end();
                });

          }

        }

      });

};

exports.login = function(req, res) {

  var emailid = req.body.emailid;
  var password = req.body.password;

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();

  query = connection.query('SELECT * from fbusers where emailid= ?',
      [ emailid ], function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
          if (rows.length > 0) {
            var result = rows[0];
            var valid_email = result["emailid"];
            var valid_password = result["password"];
            var userid = result["ID"];
            if (emailid == valid_email && password == valid_password) {
              req.session.emailid = emailid;
              req.session.userid = userid;
              //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

              res.send({
                result : "success"
              });

            } else {
              res.send({
                result : "fail"
              });
            }
          }
        } else {

          res.send({
            result : "Database error"
          });
        }
        connection.end();
      });

};

exports.logout = function() {

  if (req.session.emailid) {
    console.log("Session Data Already Exists..");
    req.session.destroy();
    res.send(JSON.stringify({
      "response" : "Session Destroyed"
    }));

  }

};
exports.about = function(req, res) {

  var bio = req.body.bio;
  var study = req.body.study;
  var work = req.body.work;
  var contact = req.body.contact;
  var music = req.body.music;
  var sports = req.body.sports;
  var emailid = req.session.emailid;

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();

  query = connection.query('SELECT ID from fbusers where emailid=?',
      [ emailid ], function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
          if (rows.length > 0) {
            var result = rows[0];

            var userid = result["ID"];

            var add_about = {
              bio : bio,
              study : study,
              work : work,
              contact : contact,
              music : music,
              sports : sports,
              userid : userid
            };
            query = connection.query('INSERT INTO aboutusers set ?',
                [ add_about ], function(err, rows, fields) {
                  res.send({
                    result : "success"
                  });

                });

          }
        } else {
          console.log(err);
          res.send({
            result : "error during inserting"
          });
        }
        connection.end();
      });

}
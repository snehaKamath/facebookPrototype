/**
 * http://usejsdoc.org/
 */
var mysql = require('mysql');
exports.addFriend = function(req, res) {

  emailid = req.session.emailid;
  fname = req.body.fname;
  lname = req.body.lname;

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
          userid = result["ID"];
          query = connection.query(
              'SELECT ID from fbusers where fname=? and lname=?', [ fname,
                  lname ], function(err, rows, fields) {
                if (!err) {
                  result = rows[0];
                  friendid = result["ID"];
                  var friendreq = {
                    userid : userid,
                    friendid : friendid,
                    flag : 0
                  };
                  query = connection.query('INSERT INTO friends set ?',
                      [ friendreq ], function(err, rows, fields) {

                        if (!err) {
                          console.log("friend request sent");
                        } else {
                          console.log(err);
                        }

                      })

                } else {
                  console.log(err);
                }

              })

        } else {
          console.log(err);
        }

      });

};

exports.friendRequest = function(req, res) {

  emailid = req.session.emailid;

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();

  query = connection
      .query(
          'SELECT * from fbusers where emailid=?',
          [ emailid ],
          function(err, rows, fields) {

            if (!err) {

              result = rows[0];
              userid = result["ID"];
            } else {
              console.log(err);
            }

            query = connection
                .query(
                    'select * from fbusers where fbusers.ID IN (select userid from friends where friendid=? and flag=0)',
                    userid, function(err, rows, fields) {
                      if (!err) {
                        if (rows.length > 0) {
                          requests = [];
                          for (var i = 0; i < rows.length; i++) {
                            result = rows[i];
                            fname = result["fname"];
                            lname = result["lname"];
                            requests.push({
                              fname : fname,
                              lname : lname,
                              requestorid : result["ID"],
                              selfid : userid
                            });

                          }
                          res.send(requests);

                        } else {
                          res.send("no requests");
                        }

                      } else {
                        console.log(err);
                      }

                    });
          });
}

exports.acceptFriend = function(req, res) {

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();
  friends = [];
  query = connection.query(
      "UPDATE friends set flag=1 where userid=? and friendid=?", [
          req.body.requestorid, req.body.selfid ], function(err, rows, fields) {

        var friend = {
          userid : req.body.selfid,
          friendid : req.body.requestorid,
          flag : 1
        };
        query = connection.query("INSERT INTO friends set ?", [ friend ],
            function(err, rows, fields) {

            });

      })

}

exports.viewFriends = function(req, res) {

  emailid = req.session.emailid;
  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();
  friends = [];
  query = connection
      .query(
          'SELECT * from fbusers where emailid=?',
          [ emailid ],
          function(err, rows, fields) {

            result = rows[0];
            userid = result["ID"];

            query = connection
                .query(
                    "select fname,lname,ID from fbusers where fbusers.ID IN (select friendid from friends where userid=? and flag=1)",
                    userid, function(err, rows, field) {

                      if (!err) {
                        if (rows.length > 0) {
                          for (var i = 0; i < rows.length; i++) {
                            result = rows[i];
                            friends.push({
                              fname : result["fname"],
                              lname : result["lname"],
                              userid : result["ID"]
                            });

                          }
                          res.send(friends);
                        } else {
                          res.send("no friends");
                        }

                      }

                      connection.end();
                    })
          })

}

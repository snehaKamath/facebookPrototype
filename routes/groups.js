/**
 * http://usejsdoc.org/
 */
var mysql = require('mysql');

exports.createGroup = function(req, res) {

  var emailid = req.session.emailid;
  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();

  ;
  groupMembers = req.body;
  add_admin = {
    groupname : req.body[0].groupname,
    userid : req.session.userid
  };
  query = connection.query("INSERT INTO groups set ?", [ add_admin ], function(
      err, rows, fields) {
    if (!err) {

      console.log(query.sql);
    } else {
      console.log(err);
    }
  })

  for (var i = 0; i < groupMembers.length; i++) {

    query = connection.query("INSERT INTO groups set ?", groupMembers[i],
        function(err, rows, fields) {
          if (!err) {

            console.log(query.sql);
          } else {
            console.log(err);
          }

        })
  }

};

exports.getGroups = function(req, res) {

  var emailid = req.session.emailid;

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();
  groups = [];
  query = connection.query("select groupname from groups where userid=?",
      req.session.userid, function(err, rows, fields) {
        if (!err) {
          if (rows.length > 0) {

            for (var i = 0; i < rows.length; i++) {
              result = rows[i];
              groups.push({
                groupname : result["groupname"]
              });
            }
            res.send(groups);
          }
        } else {
          console.log(err);
        }

      })
};

exports.getMembers = function(req, res) {

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();
  console.log("body" + req.body.groupname);
  members = [];
  query = connection
      .query(
          "select fname,lname from fbusers where ID in (select userid from groups where groupname=?)",
          req.body.groupname, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
              if (rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                  result = rows[i];
                  members.push({
                    fname : result["fname"],
                    lname : result["lname"],
                    groupname : req.body.groupname
                  });
                }
                res.send(members);
              }

            } else {
              console.log(err);
            }

          })

};

exports.removeMembers = function(req, res) {
  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });

  connection.connect();

  for (var i = 0; i < req.body.length; i++) {
    query = connection
        .query(
            "delete from groups where groupname=?  and userid =(select ID from fbusers where fname=?  and lname=?)",
            [ req.body[i].groupname, req.body[i].fname, req.body[i].lname ],
            function(err, rows, fields) {

              if (!err) {
                console.log("deleted");
              } else {
                console.log(err);
              }
            })
  }

};

exports.deleteGroup = function(req, res) {

  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });
  console.log("delete" + req.body.groupname);
  connection.connect();

  query = connection.query("delete from groups  where groupname=?",
      req.body.groupname, function(err, rows, fields) {
        if (err) {
          console.log(query.sql);
          console.log(err);
        }
      })

};

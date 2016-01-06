/**
 * http://usejsdoc.org/
 */

var mysql = require('mysql');

exports.newsFeed = function(req, res) {

  var emailid = req.session.emailid;
  var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fbapp'
  });
  feeds = [];
  connection.connect();
  query = connection
      .query(
          'SELECT * from fbusers where emailid=?',
          emailid,
          function(err, rows, fields) {
            if (!err) {

              result = rows[0];
              ID = result["ID"];
              query = connection
                  .query(
                      "select DISTINCT updates.userid,post,type,updateTime,fname,lname from updates  INNER JOIN fbusers on updates.userid=fbusers.ID INNER JOIN friends on updates.userid=friendid and flag=1 and friends.userid=? ORDER BY updateTime DESC LIMIT 10  ",
                      ID, function(err, rows, fields) {

                        if (!err) {
                          for (var i = 0; i < rows.length; i++) {
                            result = rows[i];
                            fname = result["fname"];
                            lname = result["lname"];
                            post = result["post"];
                            type = result["type"];
                            updateTime = result["updateTime"];

                            feeds.push({
                              fname : fname,
                              lname : lname,
                              post : post,
                              type : type,
                              updateTime : updateTime
                            });
                          }
                          res.send(feeds);
                        } else {
                          console.log(err);
                        }

                      })
            }
          })
}

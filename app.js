
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , fetchdata=require('./routes/fetchdata')
  , updates=require('./routes/updates')
  , friends=require('./routes/friends')
  , newsFeed = require('./routes/newsFeed')
  , groups=require('./routes/groups')
  , http = require('http')
  , path = require('path')
  , mysql=require('mysql');
var engine = require('ejs-locals');
var app = express();

// all environments
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboardcat', cookie: { maxAge: 600000 }}));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/users', user.list);
app.post('/signup',user.signup);
app.post('/login',user.login);
app.post('/about',user.about);
app.post('/postStatus',updates.postupdates);
app.get('/fetch_details',fetchdata.about_details);
app.get('/fetch_updates',fetchdata.posts_details);
app.post('/suggestFriends',fetchdata.suggestFriends);
app.post('/addFriend',friends.addFriend);
app.post('/friendRequest', friends.friendRequest);
app.post('/acceptFriend',friends.acceptFriend);
app.post('/viewFriends',friends.viewFriends);
app.post('/newsFeed',newsFeed.newsFeed);
app.post('/createGroup',groups.createGroup);
app.post('/getGroups',groups.getGroups);
app.post('/getGroupMembers',groups.getMembers);
app.post('/removeMembers',groups.removeMembers);
app.post('/deleteGroup',groups.deleteGroup);
app.get('/partials/:name', routes.partials);
app.get('/', routes.index);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

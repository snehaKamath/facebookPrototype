/**
 * http://usejsdoc.org/
 */
var fbApp = angular.module('fbApp', [ 'ngRoute', 'ui.router' ]);

fbApp.config([ '$urlRouterProvider', '$stateProvider',
    function($urlRouterProvider, $stateProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider.state('/', {
        url : '/',
        templateUrl : 'partials/welcome',
        controller : 'welcomeController'
      }).state('home', {
        url : '/home',
        templateUrl : 'partials/home',
      // controller: 'feedsController'
      }).state('self_profile', {
        url : '/self_profile',
        templateUrl : 'partials/self_profile',
      // controller : 'selfController'
      }).state('self_profile.status', {
        url : '/status',
        templateUrl : 'partials/status',
      // controller : 'selfController'
      }).state('self_profile.life_event', {
        url : '/life_event',
        templateUrl : 'partials/life_event',
        controller : 'selfController'
      }).state('self_profile.add_friends', {
        url : '/add_friends',
        templateUrl : 'partials/addfriends',
      // controller : 'suggestfriendsController'

      }).state('self_profile.friendRequests', {
        url : '/request_friends',
        templateUrl : 'partials/friendRequests',
        controller : 'friendRequests'

      }).state('about', {
        url : '/about_user',
        templateUrl : 'partials/about_user',
        controller : 'aboutController'
      }).state('logout', {
        url : '/logout',
        templateUrl : 'partials/welcome',
        controller : 'logoutController'
      })

    } ])

// Handles login, signup,signout of the user
fbApp.controller("welcomeController", function($scope, $http, $location,
    $window, $state) {
  // login
  $scope.login = function() {

    $scope.login_details = {
      'emailid' : $scope.email_login,
      'password' : $scope.password_login
    };

    $http.post('/login', $scope.login_details)

    .success(function(data) {

      if (data.result == "success") {
        $state.go('self_profile');
      } else if (data.result == "fail") {
        alert("invalid username or password. Please try again!")
      }

    }).error(function(data) {
      alert("Database error. Please try again");
    });

  };
  // signup
  $scope.signup = function() {

    $scope.signup_details = {
      'fname' : $scope.fname,
      'lname' : $scope.lname,
      'emailid' : $scope.email_signup,
      'password' : $scope.password_signup

    };

    $http.post('/signup', $scope.signup_details).success(function(data) {

      if (data.result == "success") {
        $state.go('about');
      } else {
        alert(data.result);
      }

    }).error(function(data) {
      alert(data.result);

    }

    );
  };

});

fbApp.controller("aboutController", function($scope, $state, $http, $location,
    $window) {

  $scope.about = function() {

    $scope.about_details = {
      'bio' : $scope.bio,
      'study' : $scope.study,
      'work' : $scope.work,
      'contact' : $scope.contact,
      'music' : $scope.music,
      'sports' : $scope.sports,

    };

    $http.post("/about", $scope.about_details).success(function(data) {

      if (data.result == "success") {
          $state.go('self_profile');
      }

    }).error(function(data) {
      alert(data.result);

    });

  };

});
fbApp.controller("fetchInfoController", function($scope, $http, $state,
    $location, $window) {

  $http.get("/fetch_updates").success(function(data) {

    $scope.updates = data;
  }).error(function(data) {
  });

  $http.get('/fetch_details').success(function(data) {
    $scope.work = data.work;
    $scope.study = data.study;
    $scope.bio = data.bio;
    $scope.music = data.music;
    $scope.sports = data.sports;

  }).error(function(data) {
    alert("error");
  });

});

fbApp.controller("postController", function($scope, $http, $state, $location,
    $window) {

  $scope.postStatus = function() {

    $scope.status = {
      post : $scope.status,
      type : "status",

    };
    $http.post('/postStatus', $scope.status).success(function(data) {

    }).error(function(data) {

    });

  }

  $scope.postEvent = function() {

    $scope.event = {
      post : $scope.event,
      type : "event",

    };
    $http.post('/postStatus', $scope.event).success(function(data) {

    }).error(function(data) {

    });

  }

});

fbApp.controller("suggestfriendsController", function($scope, $rootScope,
    $window, $location, $http) {
  alert("inside suggestfriends controller");

  $scope.suggest_friends = {
    emailid : $rootScope.currentemail
  };
  $http.post("/suggestFriends", $scope.suggest_friends).success(function(data) {

    $scope.suggestFriends = data;

  }).error(function(data) {

  });

  $scope.addFriend = function(friend) {

    fname = friend.fname;
    lname = friend.lname;

    add_friend = {
      fname : fname,
      lname : lname,
      emailid : $rootScope.currentemail
    };

    $http.post("/addFriend", add_friend).success(function(data) {

    }).error(function(data) {

    });

  }

});

fbApp.controller("friendRequests", function($scope, $rootScope, $window,
    $location, $http) {
  $scope.requests = null;
  $scope.friend_request = {
    emailid : $rootScope.currentemail
  };
  $http.post("/friendRequest", $scope.friend_request).success(function(data) {

    $scope.requests = data;

  }).error(function(data) {
    alert("error");
  });

  $scope.acceptFriend = function(request) {
    alert("inside acceptfriend");
    fname = request.fname;
    lname = request.lname;
    requestorid = request.requestorid;
    selfid = request.selfid;

    $scope.acceptfriend = {
      fname : fname,
      lname : lname,
      requestorid : requestorid,
      selfid : selfid
    };
    $http.post("/acceptFriend", $scope.acceptfriend).success(function(data) {

    }).error(function(data) {

    });

  }

});

fbApp.controller("viewFriends", function($scope, $rootScope, $window,
    $location, $http) {

  $scope.viewfriends = function() {

    $scope.view_friends = {
      emailid : $rootScope.currentemail
    };
    $http.post("/viewFriends", $scope.view_friends).success(function(data) {

      $rootScope.friends = data;

    }).error(function(data) {
      alert("error");
    });
  };

});

fbApp.controller('feedsController',
    function($scope, $interval, $http, $window) {

      $interval(function() {

        $http.post('/newsFeed').success(function(data) {

          $scope.feeds = data;

        }).error(function(data) {

        });

      }, 20000);
    });

fbApp.controller('groupController', function($scope, $http, $window) {

  $scope.groupMembers = [];
  $scope.removeMembers = [];

  /*
   * $scope.addMember=function(checkStatus,friend){ if(checkStatus==false)
   * {alert("true")
   * 
   * $scope.groupMembers.push({groupname:$scope.groupName,fname:friend.fname,lname:friend.lname}); }
   * else { alert("false"); } }
   */

  $scope.addMember = function(friend) {

    $scope.groupMembers.push({
      groupname : $scope.groupName,
      userid : friend.userid
    });

  }

  $scope.removeMember = function(member) {

    $scope.removeMembers.push(member);

  }

  $scope.removeMembersFromGroup = function() {

    $http.post("/removeMembers", $scope.removeMembers).success(function(data) {
      alert("members removed");

    }).error(function(data) {

    });

  }

  $scope.createGroup = function() {

    $http.post("/createGroup", $scope.groupMembers).success(function(data) {

    }).error(function(data) {

    });

  }

  $scope.getMembers = function(group) {

    $http.post("/getGroupMembers", {
      groupname : group.groupname
    }).success(function(data) {
      $scope.members = data;
    }).error(function(data) {
      ;
    })

  }
  $scope.deleteGroup = function(group) {

    $http.post('/deleteGroup', {
      groupname : group.groupname
    }).success(function(data) {

    }).error(function(data) {

    });
  }

  // $scope.getGroups=function(){

  $http.post("/getGroups").success(function(data) {

    $scope.myGroups = data;

  }).error(function(data) {

  });

  // }

})

fbApp.controller("logoutController",
    function($scope, $http, $window, $location) {
      $http.del("/logout", function(data) {
        $state.go("welcome");
      }).error(function(data) {

      });

    })

fbApp.directive('mydir', function() {
  return {
    restrict : 'A',
    template : '<input value="" class="btn btn-primary">',
    link : function(scope, elem, attrs) {
      elem.bind("click", function() {

        if (elem.val() == "Add friend") {
          elem.val("Request sent");
        } else {
          elem.val("Add friend");
        }

      })
    }
  }
});

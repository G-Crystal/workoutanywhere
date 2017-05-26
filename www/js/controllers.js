angular.module('your_app_name.controllers', [])

// APP - RIGHT MENU
.controller('AppCtrl', function($scope, AuthService, $rootScope) {

  $scope.$on('$ionicView.enter', function(){
    // Refresh user data & avatar
    $scope.user = AuthService.getUser();

              $rootScope.user = AuthService.getUser();

  });
})

// CATEGORIES MENU
.controller('PushMenuCtrl', function($scope, Categories) {

  var getItems = function(parents, categories){

    if(parents.length > 0){

      _.each(parents, function(parent){
        parent.name = parent.title;
        parent.link = parent.slug;

        var items = _.filter(categories, function(category){ return category.parent===parent.id; });

        if(items.length > 0){
          parent.menu = {
            title: parent.title,
            id: parent.id,
            items:items
          };
          getItems(parent.menu.items, categories);
        }
      });
    }
    return parents;
  };

  Categories.getCategories()
  .then(function(data){
    var sorted_categories = _.sortBy(data.categories, function(category){ return category.title; });
    var parents = _.filter(sorted_categories, function(category){ return category.parent===0; });
    var result = getItems(parents, sorted_categories);

    $scope.menu = {
      title: 'All Categories',
      id: '0',
      items: result
    };
  });
})


// BOOKMARKS
.controller('BookMarksCtrl', function($scope, $rootScope, BookMarkService) {

  $scope.bookmarks = BookMarkService.getBookmarks();
  console.log($scope.bookmarks);
  // When a new post is bookmarked, we should update bookmarks list
  $rootScope.$on("new-bookmark", function(event, post_id){
    $scope.bookmarks = BookMarkService.getBookmarks();
  });

  $scope.remove = function(bookmarkId) {
    BookMarkService.remove(bookmarkId);
    $scope.bookmarks = BookMarkService.getBookmarks();
  };
})


// CONTACT
.controller('ContactCtrl', function($scope) {

  //map
  $scope.position = {
    lat: 43.07493,
    lng: -89.381388
  };

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });
})

// SETTINGS
.controller('SettingCtrl', function($scope, $ionicActionSheet, $ionicModal, $state, AuthService) {
  $scope.notifications = true;
  $scope.sendLocation = false;

  $ionicModal.fromTemplateUrl('views/common/terms.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/common/faqs.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.faqs_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/common/credits.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.credits_modal = modal;
  });

  $scope.showTerms = function() {
    $scope.terms_modal.show();
  };

  $scope.showFAQS = function() {
    $scope.faqs_modal.show();
  };

  $scope.showCredits = function() {
    $scope.credits_modal.show();
  };

  // Triggered on a the logOut button click
  $scope.showLogOutMenu = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      // buttons: [
      // { text: '<b>Share</b> This' },
      // { text: 'Move' }
      // ],
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //Called when one of the non-destructive buttons is clicked,
        //with the index of the button that was clicked and the button object.
        //Return true to close the action sheet, or false to keep it opened.
        return true;
      },
      destructiveButtonClicked: function(){
        //Called when the destructive button is clicked.
        //Return true to close the action sheet, or false to keep it opened.
        AuthService.logOut();
        $state.go('login');
      }
    });
  };
})

//EMAIL SENDER
.controller('EmailSenderCtrl', function($scope, $cordovaEmailComposer) {

  $scope.sendFeedback = function(){
    cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
          to:      'john@doe.com',
          cc:      'jane@doe.com',
          subject: 'Feedback',
          body:    'This app is awesome'
        });
      }
    );
  };

  $scope.sendContactMail = function(){
    //Plugin documentation here: http://ngcordova.com/docs/plugins/emailComposer/

    $cordovaEmailComposer.isAvailable().then(function() {
      // is available
        $cordovaEmailComposer.open({
          to: 'john@doe.com',
          cc: 'sally@doe.com',
          subject: 'Contact from ionWordpress',
          body: 'How are you? Nice greetings from Uruguay'
        })
        .then(null, function () {
          // user cancelled email
        });
    }, function () {
      // not available
    });
  };

})


// RATE THIS APP
.controller('RateAppCtrl', function($scope) {

  $scope.rateApp = function(){
    if(ionic.Platform.isIOS()){
      AppRate.preferences.storeAppURL.ios = '<my_app_id>';
      AppRate.promptForRating(true);
    }else if(ionic.Platform.isAndroid()){
      AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
      AppRate.promptForRating(true);
    }
  };
})


//ADMOB
.controller('AdmobCtrl', function($scope, $ionicActionSheet, AdMob) {

  $scope.manageAdMob = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [
      { text: 'Show AdMob Banner' },
      { text: 'Show AdMob Interstitial' }
      ],
      destructiveText: 'Remove Ads',
      titleText: 'Choose the ad to show',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {
        console.log("removing ads");
        AdMob.removeAds();
        return true;
      },
      buttonClicked: function(index, button) {
        if(button.text == 'Show AdMob Banner')
        {
          console.log("show AdMob banner");
          AdMob.showBanner();
        }
        if(button.text == 'Show AdMob Interstitial')
        {
          console.log("show AdMob interstitial");
          AdMob.showInterstitial();
        }
        return true;
      }
    });
  };
})


//IAD
.controller('iAdCtrl', function($scope, $ionicActionSheet, iAd) {

  $scope.manageiAd = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [
      { text: 'Show iAd Banner' },
      { text: 'Show iAd Interstitial' }
      ],
      destructiveText: 'Remove Ads',
      titleText: 'Choose the ad to show - Interstitial only works in iPad',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {
        console.log("removing ads");
        iAd.removeAds();
        return true;
      },
      buttonClicked: function(index, button) {
        if(button.text == 'Show iAd Banner')
        {
          console.log("show iAd banner");
          iAd.showBanner();
        }
        if(button.text == 'Show iAd Interstitial')
        {
          console.log("show iAd interstitial");
          iAd.showInterstitial();
        }
        return true;
      }
    });
  };
})


// WALKTHROUGH
.controller('WalkthroughCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

  $scope.$on('$ionicView.enter', function(){
    //this is to fix ng-repeat slider width:0px;
    $ionicSlideBoxDelegate.$getByHandle('walkthrough-slider').update();
  });
})

//LOGIN
.controller('LoginCtrl', function($scope, $rootScope, $state, $ionicLoading, AuthService) {
  $scope.user = {};

  $scope.doLogin = function(){

    $ionicLoading.show({
      template: 'Logging in...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password
    };

    AuthService.doLogin(user)
    .then(function(user){
      console.log(user);
          $rootScope.user = user;

      //success
      $state.go('app.home');

      $ionicLoading.hide();
    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };
})


// FORGOT PASSWORD
.controller('ForgotPasswordCtrl', function($scope, $state, $ionicLoading, AuthService) {
  $scope.user = {};

  $scope.recoverPassword = function(){

    $ionicLoading.show({
      template: 'Recovering password...'
    });

    AuthService.doForgotPassword($scope.user.userName)
    .then(function(data){
      if(data.status == "error"){
        $scope.error = data.error;
      }else{
        $scope.message ="Link for password reset has been emailed to you. Please check your email.";
      }
      $ionicLoading.hide();
    });
  };
})


// REGISTER
.controller('RegisterCtrl', function($scope, $state, $ionicLoading, AuthService) {
  $scope.user = {};

  $scope.doRegister = function(){

    $ionicLoading.show({
      template: 'Registering user...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password,
      email: $scope.user.email,
      displayName: $scope.user.displayName
    };
    $rootScope.user = user;

    AuthService.doRegister(user)
    .then(function(user){
      //success
      $state.go('app.home');
      $ionicLoading.hide();
    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };
})
.controller('ProfileCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService) {
console.log($scope.user);
})
.controller('NutritionCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService) {

})
.controller('CoachCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService) {

})
.controller('ActivityfeedCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService, $http) {
  $scope.bookmarkPost = function(post){
    console.log(post);
    $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
    PostService.bookmarkPost(post);

      // $scope.doRefresh();

  };
$scope.addFav = function(id, title) {



     $http.get("https://workoutanywhere.net/bp-api.php?pp=addfav&uid="+$rootScope.uid+"&pid="+id)
    .then(function(response) {
        //First function handles success
        



    }, function(response) {
        //Second function handles error
    });




// $rootScope.favs[id] = title;
// console.log($rootScope.favs);


};
  $scope.comment_feed = function(pid){
    $scope.comments = "";
    $scope.nocomments = "Loading comments...";




$scope.pcomments = "";
  $http.get("https://workoutanywhere.net/wp-json/wp/v2/comments?post="+pid)
    .then(function(response) {
        //First function handles success
        console.log(response.data);
        $scope.pcomments = response.data;

        if($scope.pcomments === ""){
          $scope.nocomments = "No comments to display. Leave a comment below.";
        } else {
              $scope.nocomments = "";

        }



    }, function(response) {
        //Second function handles error
    });


  
 };


   $http.get("https://workoutanywhere.net/api-/bp-api.php")
    .then(function(response) {
        //First function handles success

        $scope.content = response.data;
        console.log(response.data);
    }, function(response) {
        //Second function handles error
        $scope.content = "Something went wrong";
    });
    
    
    $scope.hiddenHeroes = {};

$scope.toggleContent = function (idx) {

    $scope.hiddenHeroes[idx] = !$scope.hiddenHeroes[idx];
};

$scope.commentMsg = "";
$scope.postComment = function(pid, comment){




          var token = $cookies.get('woa-wp-token');

    console.log(pid);
    $scope.commentMsg = "Thanks for placing a comment!";
    
    $scope.newName = "Justin";
    $http( {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + $cookies.get('woa-wp-token')},

      url: 'https://workoutanywhere.net/wp-json/wp/v2/comments',
      data: {
        'content': comment,
        "post": pid
      }
    } ).success( function( data ) { console.log( data ); } );
  
  
  
     
    
};


    $scope.hiddenDivs = false;
    
    $scope.fullArticle = function(id){

    //     $http( {
    // method: 'POST',
    // headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + $cookies.get('woa-wp-token')},

    //   url: 'http://workoutanywhere.net/api/buddypressread/settings_get_settings/?username=demo',
    //   data: {
    //     "user": 1
    //   }
    // } ).success( function( data ) { console.log( data ); } );






    //     $http.get("http://workoutanywhere.net/api/buddypressread/settings_get_settings/?username=demo")
    // .then(function(response) {
    //           console.log(response.data);

    //     //First function handles success
    //     $scope.full = response.data;
        
    //     $scope.renderedContent = response.data.content.rendered;

    //     console.log(response.data);
    // }, function(response) {
    //     //Second function handles error
    //     $scope.full = "Something went wrong";
    // });
        
    };
    
    
    $scope.toggle = [];
$scope.toggleFilter = function(inx) {
  $scope.toggle[inx] = $scope.toggle[inx] === false ? true : false;
};

    $scope.togglec = [];
$scope.toggleFilterc = function(inx) {
  $scope.togglec[inx] = $scope.togglec[inx] === false ? true : false;
};
    
$scope.htmlToPlaintext = function(text) {
  return text ? String(text).replace(/<[^>]+>/gm, '') : '';
};






// The controller


//  $scope.photoFind = "https://www.w3schools.com/images/colorpicker.gif";
 $scope.parseEncode = function(text){
         var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }
    
    
   $scope.photoFind = urlArray[0];


 };
 
 
 function parseEncoded (text){
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }
    
   
    // var postId =  parseInt(urlArray[0].match(/[0-9]+/)[0], 10);
    return urlArray[0];
    


 }

//     $scope.photoFind = function(photo){

// }


})
.controller('DashboardCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService) {

})

.controller('addworkoutCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService, $http, AuthService) {
          var user = AuthService.getUser();

$scope.addWorkout = function(message){


      var content = "Lesson: " +this.lesson + "  " +"Level: " + this.level + "  " +"Length: " + this.lengths + "  " +"Rounds: "+ this.rounds+ "  " +"Experience: "+ this.experience;

   $http( {
    method: 'POST',


      url: 'http://workoutanywhere.net/add-workout.php?uid='+user.data.id+'&content='+content,
        headers : {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    },
      data: {
        // user_id : $rootScope.user.user_id,
        // content : "test activity",
      }

    } ).success( function( data ) { 


     } );
  };
})

.controller('CommunityCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService, $http) {
  console.log($rootScope.user);
$scope.addMessage = function(message){
   $http( {
    method: 'POST',

      url: 'https://workoutanywhere.net/chat.php?post=1&content='+message+"&user="+$rootScope.user.data.displayname+"&avt="+$rootScope.user.data.avatar,
        headers : {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    },
      data: {
      }

    } ).success( function( data ) { 


      $http.get("http://workoutanywhere.net/chat.php")
    .then(function(response) {
        //First function handles success
        // $scope.userData = response.data[0];
        $scope.chats = response.data;
        console.log( $scope.chats);
      

    }, function(response) {
        //Second function handles error
    });

     } );
  };



$scope.chats = {};

      $http.get("http://workoutanywhere.net/chat.php")
    .then(function(response) {
        //First function handles success
        // $scope.userData = response.data[0];
        $scope.chats = response.data;
        console.log( $scope.chats);
      

    }, function(response) {
        //Second function handles error
    });

})

// HOME - GET RECENT POSTS
.controller('HomeCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService) {
  $scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;

  $scope.doRefresh = function() {
    $ionicLoading.show({
      template: 'Loading posts...'
    });

    //Always bring me the latest posts => page=1
    PostService.getRecentPosts(1)
    .then(function(data){

      $scope.totalPages = data.pages;
      $scope.posts = PostService.shortenPosts(data.posts);

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getRecentPosts($scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.pages;
      var new_posts = PostService.shortenPosts(data.posts);
      $scope.posts = $scope.posts.concat(new_posts);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.sharePost = function(link){
    PostService.sharePost(link);
  };

  $scope.bookmarkPost = function(post){
    $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
    PostService.bookmarkPost(post);
  };

  $scope.doRefresh();

})


// POST
.controller('PostCtrl', function($scope, post_data, $ionicLoading, PostService, AuthService, $ionicScrollDelegate) {
  $scope.post = post_data.post;
  $scope.comments = _.map(post_data.post.comments, function(comment){
    if(comment.author){
      PostService.getUserGravatar(comment.author.id)
      .then(function(avatar){
        comment.user_gravatar = avatar;
      });
      return comment;
    }else{
      return comment;
    }
  });
  $ionicLoading.hide();

  $scope.sharePost = function(link){
    window.plugins.socialsharing.share('Check this post here: ', null, null, link);
  };

  $scope.addComment = function(){

    $ionicLoading.show({
      template: 'Submiting comment...'
    });

    PostService.submitComment($scope.post.id, $scope.new_comment)
    .then(function(data){
      if(data.status=="ok"){
        var user = AuthService.getUser();

        var comment = {
          author: {name: user.data.username},
          content:$scope.new_comment,
          date: Date.now(),
          user_gravatar : user.avatar,
          id: data.comment_id
        };
        $scope.comments.push(comment);
        $scope.new_comment = "";
        $scope.new_comment_id = data.comment_id;
        $ionicLoading.hide();
        // Scroll to new post
        $ionicScrollDelegate.scrollBottom(true);
      }
    });
  };
})


// CATEGORY
.controller('PostCategoryCtrl', function($scope, $rootScope, $state, $ionicLoading, $stateParams, PostService) {

  $scope.category = {};
  $scope.category.id = $stateParams.categoryId;
  $scope.category.title = $stateParams.categoryTitle;

  $scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;

  $scope.doRefresh = function() {
    $ionicLoading.show({
      template: 'Loading posts...'
    });

    PostService.getPostsFromCategory($scope.category.id, 1)
    .then(function(data){
      $scope.totalPages = data.pages;
      $scope.posts = PostService.shortenPosts(data.posts);

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getPostsFromCategory($scope.category.id, $scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.pages;
      var new_posts = PostService.shortenPosts(data.posts);
      $scope.posts = $scope.posts.concat(new_posts);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.sharePost = function(link){
    PostService.sharePost(link);
  };

  $scope.bookmarkPost = function(post){
    $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
    PostService.bookmarkPost(post);
  };

  $scope.doRefresh();
})


// WP PAGE
.controller('PageCtrl', function($scope, page_data) {
  $scope.page = page_data.page;
})

;

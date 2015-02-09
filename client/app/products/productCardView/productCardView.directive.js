'use strict';

angular.module('cornerfindApp')
  .directive('productCardView', function (Auth, products, likes) {
    return {
      templateUrl: 'app/products/productCardView/productCardView.html',
      restrict: 'EA',
      scope: {
      	product: '=info',
        currentUser: '=currentUser',
      },
      link: function (scope, element, attrs) {

        likes.resource.getProductLikes({id: scope.product._id}).$promise.then(function(data){
          
          scope.product.likes = data;

          if(scope.product.likes.length === 1){
            scope.likeText = scope.product.likes[0].username + " likes this";
            if( scope.likeText.length > 40)
            scope.likeText = scope.likeText.slice(0,37) + "..."
          }
          else if(scope.product.likes.length > 1){
            scope.likeText = scope.product.likes[0].username + " and " + scope.product.likes.length + " others like this";
            if( scope.likeText.length > 40)
            scope.likeText = scope.likeText.slice(0,37) + "..."
          }

          scope.product.likes.forEach(function(el){
            if(el.userId == scope.currentUser._id){
                  console.log(scope.product.likes);
                  scope.favorited = true;
            }
            else{
                scope.favorited = false;
            }
          })
   
        
          likes.resource.getUserLikes({id: scope.currentUser._id}).$promise.then(function(data){
              scope.currentUser.likes = data;
          });

        });

      
        //toggle favorite function to update backend. 
        scope.toggleFavorite = function(){
          var likeObject = {productId: scope.product._id, userId: scope.currentUser._id};
          
          // If already favorited do this
          if (scope.favorited) {
             
            var userLikeIndex = scope.currentUser.likes.map(function(e) { return e.productId; }).indexOf(scope.product._id);
            scope.currentUser.likes.splice(userLikeIndex, 1);

            var productLikeIndex = scope.product.likes.map(function(e) { return e.userId; }).indexOf(scope.currentUser._id);
            scope.product.likes.splice(productLikeIndex, 1);
            
            likes.resource.deleteLike({productid: scope.product._id, userid: scope.currentUser._id});
            scope.favorited = false;
          }
          // If not favorited do this
          else{
            scope.currentUser.likes.push({productId: scope.product._id, userId: scope.currentUser._id});
            scope.product.likes.push({productId: scope.product._id, userId: scope.currentUser._id});
            likes.resource.save({productId: scope.product._id, userId: scope.currentUser._id});
            scope.favorited = true;
          }
          

      }
    }
  }
  });
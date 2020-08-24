document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views

 // document.querySelector('#Following').addEventListener('click', () => load_tweets('following'));
 // document.querySelector('#NewPosts').addEventListener('click', compose_tweet);  
  
  // By default, load the inbox
  var tweets = document.getElementsByClassName("like");
for (var i = 0; i < tweets.length; i++) {
   getlikes(tweets.item(i).getAttribute("data"));
}
var bodies = document.getElementsByClassName("tweet");
for (var i = 0; i < bodies.length; i++) {
   bodies[i].style.display = 'block';
}
var edits = document.getElementsByClassName("edit");
for (var i = 0; i < edits.length; i++) {
   edits[i].style.display = 'none';
}
});

document.addEventListener('click', event => {
    const element = event.target;
    if (element.id == 'user') {
        user(element.parentElement.id)
    }
    if (element.id == 'like') {
        console.log("liking")
        like(element.parentElement.id);
        console.log("liked")
        getlikes(element.parentElement.id);

    }
    if (element.id == 'follow') {
        follow(element.parentElement.id);
        user(element.parentElement.id);
    }
    if (element.id == 'unlike') {
        like(element.parentElement.id);
    }
    if (element.id == 'edit') {
        edit(element.parentElement.id);
    }
    if (element.id == 'postEdit') {
        const num =element.parentElement.getAttribute("data")
        postEdit(num, document.getElementById('edit-body'+ num).value);
    }
    if (element.id == 'post') {
    const bod = document.getElementById('compose-body').value;  
    postTweet(bod);
  }
    

})

function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}

function user(name, tweet) {

  const user_id = JSON.parse(document.getElementById('user_id').textContent);
  const post =document.createElement('div');
  post.id = name
  const element = event.target;
  fetch ('user/followers/' + name, {
      method: 'GET'
  })
  .then(response => response.json())
  .then( user => {
      followers = user.followers
      following = user.following
  post.innerHTML = '<h3>' +name + '</h3>';
  post.innerHTML += '<h4> Followers: ' + followers.length + '</h4>'
    post.innerHTML += '<h4> Following: ' + following.length + '</h4>'
    if(user.username != name){
    if(followers.includes(user_id)) {
    post.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"follow\">Unfollow </button>" 
    }
    else {
    post.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"follow\">Follow </button>" 
    }
    }
      })
document.querySelector('#feed-view').append(post)
}

function getlikes(tweet) {
clearBox("like"+tweet)
const user_id = JSON.parse(document.getElementById('user_id').textContent);
  const post =document.createElement('div');
  post.id = tweet
fetch(tweet, {
    method: 'GET'
    })
.then(response => response.json())
.then(result => {
     likes = result.likes
     post.innerHTML = '<h4> Likes: ' + likes.length + '</h4>'
    if(likes.includes(user_id)) {
    post.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"like\">Unlike </button>" 
    }
    else {
    post.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"like\">Like </button>" 
    } 
    
});
document.querySelector('#like'+tweet).append(post)
}
function postTweet(bod) {
fetch('/network', {
  method: 'POST',
  body: JSON.stringify({
      body: bod
  })
});
}

function like(num){

fetch(num, {
    method: 'PUT' 
});
}


function follow(name) {
    fetch ('user/followers/' + name, {
        method: 'PUT'
        });
}

function edit(tweet) {
    document.querySelector('#tweet'+tweet).style.display = 'none';
    document.querySelector('#edit'+tweet).style.display = 'block';
}

function postEdit(tweet, bod) {
  fetch(tweet, {
  method: 'POST',
  body: JSON.stringify({
     body: bod
     })
     });
}

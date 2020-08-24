

document.addEventListener('DOMContentLoaded', function() {
 var val = document.getElementById('title').getAttribute("data");
 console.log(val)
 user(val);
  // Use buttons to toggle between views
 // document.querySelector('#AllPosts').addEventListener('click', () => load_tweets('all'));
 // document.querySelector('#Following').addEventListener('click', () => load_tweets('following'));
 // document.querySelector('#NewPosts').addEventListener('click', compose_tweet);  
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



function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}

document.addEventListener('click', event => {
    const element = event.target;
    if (element.id == 'user') {
        console.log(element.parentElement.className)
        user(element.parentElement.className)
    }
    if (element.id == 'like') {
        like(element.parentElement.id);
        getlikes(element.parentElement.id);
    }
    if (element.id == 'follow') {
        follow(element.parentElement.id);
        user(element.parentElement.id);
    }
    if (element.id == 'unlike') {
        like(element.parentElement.id);
        load_tweets('all');
    }
    if (element.id == 'post') {
    const bod = document.getElementById('compose-body').value;  
    console.log(bod);
    postTweet(bod);
    load_tweets('following');
  }
    

})


function compose_tweet() {
  var element = document.getElementById("SendTweet");
    if (element != null) {
    element.parentNode.removeChild(element);
    }
  document.querySelector('#compose-body').value = '';
  const mail =document.createElement('div');
  mail.setAttribute("id","SendEmail");
  document.querySelector('#compose-view').append(mail);
}


function load_tweets(feed) {
    const start = counter;
    const end = start + quantity - 1;
    counter = end + 1;
  // Show the mailbox and hide other views
  document.querySelector('#feed-view').style.display = 'block';

  // Show the mailbox name
  document.querySelector('#feed-view').innerHTML = `<h3>${feed.charAt(0).toUpperCase() + feed.slice(1)}</h3>`;
  
  const element = event.target;
  if (feed == 'all') {
      fetch ('all')
     
  }
  else if (feed == 'following'){
      fetch ('following')
  }
  
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

function user(name) {
  clearBox("follower-view")
  const user_id = JSON.parse(document.getElementById('user_id').textContent);
  const post =document.createElement('div');
  post.id = name
  const element = event.target;
  fetch ('user/followers/' + name, {
      method: 'GET'
  })
  .then(response => response.json())
  .then( user => {
      console.log(user)
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
document.querySelector('#follower-view').append(post)
}




function postTweet(bod) {
fetch('network', {
  method: 'POST',
  body: JSON.stringify({
      body: bod
  })
})
.then(response => response.json())
.then(result => {
    // Print result
    console.log(result);
    load_mailbox('sent');   
    console.log("Sent");
});
}

function like(num){

fetch('network/' + num, {
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

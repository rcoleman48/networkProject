// Start with first post
let counter = 1;

// Load posts 20 at a time
const quantity = 20;

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
 // document.querySelector('#AllPosts').addEventListener('click', () => load_tweets('all'));
 // document.querySelector('#Following').addEventListener('click', () => load_tweets('following'));
 // document.querySelector('#NewPosts').addEventListener('click', compose_tweet);  
  
  // By default, load the inbox
  console.log("loading>>>");
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
        load_tweets('all');
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

function load_tweet(tweet) {

    const user_id = JSON.parse(document.getElementById('user_id').textContent);
    const post =document.createElement('div');
    post.id = tweet.id
    post.className = tweet.poster;
    post.innerHTML = "<a id=\"user\">" + tweet.poster+ "</a>"
    post.innerHTML += "<h2>" + tweet.body + "</h2>";
    post.innerHTML += "<h4> <i>" + tweet.timestamp + "</i> </h4>";
    console.log(tweet.likes)
    
    document.querySelector('#all-view').append(post);
    post.innerHTML += "<h4> Likes:" + tweet.likes.length + "</h4>"
    if(tweet.likes.includes(user_id)) {
    post.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"like\">Unlike </button>" 
    }
    else {
    post.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"like\">Like </button>" 
    }
    if(tweet.poster.id == user_id){
    post.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"edit\">Edit </button>"
    }

}

function user(name) {
  console.log(name)
  const user_id = JSON.parse(document.getElementById('user_id').textContent);
  document.querySelector('#all-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  clearBox("all-view");
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
    fetch ('network/' + name)
      .then(response => response.json())
      .then(tweets => {
          tweets.forEach(load_tweet);
      })
document.querySelector('#title-view').append(post)
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

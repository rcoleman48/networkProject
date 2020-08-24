document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelectorAll('#user').forEach(button => {
        button.onclick = () => {
            user(button.parentElement.id);
        }
    });
 // document.querySelector('#Following').addEventListener('click', () => load_tweets('following'));
 // document.querySelector('#NewPosts').addEventListener('click', compose_tweet);  
  
  // By default, load the inbox
  console.log("loading>>>");
});

document.addEventListener('click', event => {
    const element = event.target;
    if (element.id == 'user') {
        console.log(element.parentElement.id)
        user(element.parentElement.id)
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

function user(name) {
  console.log(name)
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
document.querySelector('#feed-view').append(post)
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

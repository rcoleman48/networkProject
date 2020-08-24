document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#AllPosts').addEventListener('click', () => load_tweets('all'));
  document.querySelector('#Following').addEventListener('click', () => load_tweets('following'));
//  document.querySelector('#NewPosts').addEventListener('click', compose_tweet);  
  
  // By default, load the inbox
  console.log("loading>>>");
        load_tweets('following');
});

function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}

document.addEventListener('click', event => {
    const element = event.target;
    if (element.id == 'reply') {
        reply(element.parentElement.id)
    }
    if (element.id == 'archive') {
        archive(element.parentElement.id)
        load_mailbox('inbox');
    }
    if (element.id == 'unarchive') {
        unarchive(element.parentElement.id)
        load_mailbox('archive');
    }
    if (element.id == 'post') {
    const bod = document.getElementById('compose-body').value;  
    console.log(bod);
    sendEmail(recips, sub, bod);
  }
    

})


function compose_tweet() {
  var element = document.getElementById("SendTweet");
    if (element != null) {
    element.parentNode.removeChild(element);
    }
  // Show compose view and hide other views
  document.querySelector('#all-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-body').value = '';
  const mail =document.createElement('div');
  mail.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"send\">Send </button>"
  mail.setAttribute("id","SendEmail");
  document.querySelector('#compose-view').append(mail);
}


function load_tweets(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#all-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
    clearBox("all-view");

  // Show the mailbox name
  document.querySelector('#all-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  
}

function load_tweet(who) {
    const post =document.createElement('div');
    post.className = 'post';
    
    post.innerHTML = "<h2>" + tweet.body + "</h2>";
    post.innerHTML += "<h4> <i>" + email.timestamp + "</i> </h4>";
    post.addEventListener('click', function() {
        open_email(email)
    });
    
    document.querySelector('#emails-view').append(post);
    mail.innerHTML += "<button class=\"btn btn-sm btn-outline-primary\" id=\"reply\">Favorite </button>"

}


function archive(email_id) {
fetch('/emails/' + email_id, {
  method: 'PUT',
  body: JSON.stringify({
      archived: true
  })
});

}

function unarchive(email_id) {
fetch('/emails/' + email_id, {
  method: 'PUT',
  body: JSON.stringify({
      archived: false
  })
});
}


function postTweet(bod) {
fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recips,
      subject: sub,
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

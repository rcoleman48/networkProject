import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import User, Tweet


def index(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "network/index.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
        
def user(request, name):
    return render(request, "network/user.html", {
        "user": name
    })
    
@csrf_exempt 
@login_required   
def tweet(request, tweet_id):
    # Query for requested email
    try:
        tweet = Tweet.objects.get(pk=tweet_id)
    except Email.DoesNotExist:
        return JsonResponse({"error": "Tweet not found."}, status=404)

    # Return email contents
    if request.method == "GET":
        return JsonResponse(tweet.serialize())

    # Update whether email is read or should be archived
    elif request.method == "PUT":
        print(tweet.likes)
        if tweet.likes.filter(id=request.user.id).exists():
            tweet.likes.remove(request.user)
        else:
            print("Adding?")
            tweet.likes.add(request.user)
        tweet.save()
        return HttpResponse(status=204)
        
    elif request.method == "POST":
        data = json.loads(request.body)
        # Get contents of email
        body = data.get("body", "")
        tweet.body = body
        print(body)
        tweet.save()
        return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
        
        
@login_required
def feed(request, feed):
    # Filter emails returned based on mailbox
    print("trying")
    if feed == "all":
        tweets = Tweet.objects.all()
    elif feed == "following":
        followers = request.user.following.all()
        tweets = Tweet.objects.filter(poster__in=followers)
    else:
        tweets = Tweet.objects.filter(poster__username=feed)

    # Return emails in reverse chronologial order
    tweets = tweets.order_by("-timestamp").all()
    paginator = Paginator(tweets, 20)
    page = request.GET.get('page', 1)
    try:
        tws = paginator.page(page)
    except PageNotAnInteger:
        tws = paginator.page(1)
    except EmptyPage:
        tws = paginator.page(paginator.num_pages)
    for tweet in tws:
        print(tweet.body)
        
    if feed == "all":
        return render(request, "network/all.html", {"tweets":tws})
    elif feed == "following":
        return render(request, "network/following.html", {"tweets":tws})
    else:
        return render(request, "network/user.html", {"tweets":tws, "user":feed})
    
@csrf_exempt
@login_required    
def user(request, name):
    tweets = Tweet.objects.filter(poster__username=name)
    tweets = tweets.order_by("-timestamp").all()
    paginator = Paginator(tweets, 20)
    page = request.GET.get('page', 1)
    try:
        tws = paginator.page(page)
    except PageNotAnInteger:
        tws = paginator.page(1)
    except EmptyPage:
        tws = paginator.page(paginator.num_pages)
    return render(request, "network/user.html", {"tweets":tws, "name":name})
    
@csrf_exempt
@login_required
def post(request):

    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Check recipient emails
    data = json.loads(request.body)
    # Get contents of email
    body = data.get("body", "")
    print(body)

    # Create one email for each recipient, plus sender
    tweet = Tweet( poster = request.user, body = body)
    tweet.save()

    return JsonResponse({"message": "Tweet posted successfully."}, status=201)


@csrf_exempt
@login_required    
def follower(request, name):
    user = User.objects.get(username=name)
    if request.method == "PUT":
        if user.followers.filter(id=request.user.id).exists():
            user.followers.remove(request.user)
        else:
            print("Adding?")
            user.followers.add(request.user)
        user.save()
        return HttpResponse(status=204)
    elif request.method == "GET":
        print(user)
        return JsonResponse(user.serialize())


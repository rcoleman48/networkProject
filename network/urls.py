
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("network/user/followers/<str:name>", views.follower, name="follower"),
    path("network/<int:tweet_id>", views.tweet, name="tweet"),
    path("network/<str:feed>", views.feed, name="feed"),
    path("network", views.post, name="post")
]

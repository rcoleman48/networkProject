from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", blank=True, related_name="followers", symmetrical=False)
    def serialize(self):
        return {
            "id": self.id,
            "following": [user.id for user in self.following.all()],
            "followers": [user.id for user in self.followers.all()],
        }
    
class Tweet(models.Model):
    poster = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tweets")
    body = models.TextField(blank=True)
    likes = models.ManyToManyField("User", related_name="liked_tweets")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster.username,
            "likes": [user.id for user in self.likes.all()],
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p")
        }


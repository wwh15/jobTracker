from django.db import models

# Create your models here.
from django.db import models

class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        SCREEN = "SCREEN", "Screen"
        ONSITE = "ONSITE", "Onsite"
        OFFER = "OFFER", "Offer"
        REJECTED = "REJECTED", "Rejected"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"

    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)

    applied_date = models.DateField(null=True, blank=True)
    next_follow_up = models.DateField(null=True, blank=True)

    link = models.URLField(blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

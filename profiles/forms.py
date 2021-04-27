from django import forms
from .models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class CreateUserForm(UserCreationForm):
    username = forms.CharField(error_messages={'required':'Enter your Username'},label='', 
               widget=forms.TextInput(attrs={'placeholder': "username", "class": "comment-box reg-box"}))
    email = forms.CharField(label='', 
               widget=forms.EmailInput(attrs={'placeholder': "email", "class": "comment-box reg-box"}))
    password1 = forms.CharField(label='', 
               widget=forms.PasswordInput(attrs={'placeholder': "password", "class": "comment-box reg-box key" }))
    password2 = forms.CharField(label='', 
               widget=forms.PasswordInput(attrs={'placeholder': "re-enter password", "class": "comment-box reg-box key"}))
    class Meta:
        model = User
        fields= ['username','email','password1','password2']


class ProfileForm(forms.ModelForm):
    first_name = forms.CharField(label='', 
               widget=forms.TextInput(
                        attrs={'placeholder': "First Name ...", 
                            "class": "comment-box"}
                    ))
    last_name = forms.CharField(label='', 
               widget=forms.TextInput(
                        attrs={'placeholder': "First Name ...", 
                            "class": "comment-box"}
                    ))
    bio = forms.CharField(label='', 
               widget=forms.Textarea(
                        attrs={'placeholder': "First Name ...", 
                            "class": "comment-box","rows":'3'}
                    ))
    class Meta:
        model = Profile
        fields = ("first_name","last_name", "bio" , "avatar")
    

from django import forms
from .models import Post,Comment

class PostForm(forms.ModelForm):
    title = forms.CharField(label='', 
               widget=forms.TextInput(
                        attrs={'placeholder': "Title ...", 
                            "class": "comment-box"}
                    ))
    body = forms.CharField(label='', 
               widget=forms.Textarea(
                        attrs={'placeholder': "Body ...", 
                            "class": "comment-box","rows":"4"}
                    ))
    class Meta:
        model = Post
        fields = ('title', 'body',)

class CommentForm(forms.ModelForm):
    body = forms.CharField(label='', 
               widget=forms.TextInput(
                        attrs={'placeholder': "Your comment ...", 
                            "class": "comment-box","id": "comment-box"}
                    ))
    class Meta:
        model = Comment
        fields = ('body',)
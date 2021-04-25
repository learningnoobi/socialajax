from django import forms
from .models import Post,Comment

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('title', 'body',)

class CommentForm(forms.ModelForm):
    body = forms.CharField(label='', 
               widget=forms.TextInput(
                        attrs={'placeholder': "Your comment ...", 
                            "id": "comment-box"}
                    ))
    class Meta:
        model = Comment
        fields = ('body',)
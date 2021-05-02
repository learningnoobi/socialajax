from posts.models import Notification
def show_notifications(request):
	request_user = request.user
	if request_user.is_authenticated:
		notifications = Notification.objects.filter(to_user=request_user).exclude(user_has_seen=True).order_by('-date')
		return {'notifications': notifications}
	else:
		return {'nice':'to meet you'}
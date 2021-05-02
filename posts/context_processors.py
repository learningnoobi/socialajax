from posts.models import Notification
def show_notifications(request):
	request_user = request.user
	if request_user.is_authenticated:
		notifications_one = Notification.objects.filter(to_user=request_user).exclude(user_has_seen=True).order_by('-date')
		notifications_two = notifications_one.filter(to_user=request_user).exclude(from_user = request_user).order_by('-date')
		return {'notifications': notifications_two}
	else:
		return {'nice':'to meet you'}
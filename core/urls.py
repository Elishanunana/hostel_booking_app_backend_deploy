# core/urls.py
from django.urls import path
from core.views.auth_views import RegisterStudentView, RegisterProviderView, LoginView
from core.views.room_view import RoomCreateView, MyRoomsView, RoomListView, ToggleRoomAvailabilityView
from core.views.booking_view import BookingCreateView, MyBookingsView, BookingRequestsView, UpdateBookingStatusView, CancelBookingView
from core.views.payment_view import InitializePaystackPayment
from core.views.payment_webhook import paystack_webhook
from core.views.revenue_view import ProviderRevenueView
from core.views.facility_view import FacilityListView
from core.views.provider_dashboard_view import ProviderDashboardSummaryView
from core.views.room_view import RoomDetailView
from core.views.password_reset_view import request_password_reset, confirm_password_reset, verify_reset_token
from rest_framework.views import APIView
from rest_framework.response import Response


# Homepage view
class HomeView(APIView):
    def get(self, request):
        return Response({"message": "Welcome to the Hostel Booking System!"})

urlpatterns = [
    path('', HomeView.as_view(), name='home'),  # Root URL
    path("register/student/", RegisterStudentView.as_view(), name="register-student"),
    path("register/provider/", RegisterProviderView.as_view(), name="register-provider"),
    path("login/", LoginView.as_view(), name="login"),
    path("rooms/create/", RoomCreateView.as_view(), name="create-room"),
    path("rooms/mine/", MyRoomsView.as_view(), name="my-rooms"),
    path("rooms/", RoomListView.as_view(), name="room-list"),
    path("facilities/", FacilityListView.as_view(), name="facility-list"),
    path("bookings/", BookingCreateView.as_view(), name="create-booking"),
    path('bookings/my/', MyBookingsView.as_view(), name='my-bookings'),
    path("bookings/requests/", BookingRequestsView.as_view(), name="booking-requests"),
    path("bookings/<int:booking_id>/status/", UpdateBookingStatusView.as_view(), name="update-booking-status"),
    path("bookings/<int:booking_id>/cancel/", CancelBookingView.as_view(), name="cancel-booking"),
    path("rooms/<int:room_id>/toggle-availability/", ToggleRoomAvailabilityView.as_view(), name="toggle-room-availability"),
    path('payments/initiate/', InitializePaystackPayment.as_view(), name='initiate-payment'),
    path('webhooks/paystack/', paystack_webhook, name='paystack-webhook'),
    path("revenue/", ProviderRevenueView.as_view(), name="provider-revenue"),
    path("dashboard/provider/summary/", ProviderDashboardSummaryView.as_view(), name="provider-dashboard-summary"),
    path('password-reset/request/', request_password_reset, name='request_password_reset'),
    path('password-reset/confirm/', confirm_password_reset, name='confirm_password_reset'),
    path('password-reset/verify/', verify_reset_token, name='verify_reset_token'),
    path('rooms/<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
]
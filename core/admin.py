from django.contrib import admin
from .models import StudentProfile, ProviderProfile, Room, Booking, Payment, Facility

@admin.register(StudentProfile)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'get_email', 'program', 'phone_number')
    search_fields = ('user__username', 'user__email')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'


@admin.register(ProviderProfile)
class RoomProviderAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'get_email', 'phone_number')
    search_fields = ('business_name', 'user__email')

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('hostel_name', 'room_number', 'price_per_night', 'max_occupancy', 'is_available')
    list_filter = ('is_available',)



@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('student', 'room', 'check_in_date', 'check_out_date', 'booking_status')
    list_filter = ('booking_status',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'amount', 'payment_method', 'status', 'payment_date')
    list_filter = ('status', 'payment_method')

@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('name',)
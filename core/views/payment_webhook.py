import json
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.utils.timezone import now
from core.models import Booking, Payment
import hmac
import hashlib
from django.conf import settings
import logging
from django_ratelimit.decorators import ratelimit

logger = logging.getLogger(__name__)

@csrf_exempt
@ratelimit(key='ip', rate='10/m', method='POST', block=True)
def paystack_webhook(request):
    was_limited = getattr(request, 'limited', False)
    if was_limited:
        logger.warning(f"Rate limit exceeded for IP {request.META.get('REMOTE_ADDR')}")
        return HttpResponse(status=429)

    if request.method != 'POST':
        logger.warning(f"Invalid method {request.method} for webhook")
        return HttpResponse(status=405)

    paystack_signature = request.headers.get('X-Paystack-Signature')
    secret_key = settings.PAYSTACK_SECRET_KEY
    computed_signature = hmac.new(
        secret_key.encode('utf-8'),
        request.body,
        hashlib.sha512
    ).hexdigest()
    if not hmac.compare_digest(paystack_signature, computed_signature):
        logger.warning("Invalid Paystack signature")
        return HttpResponse(status=400)

    payload = json.loads(request.body)
    logger.info("Webhook hit: %s", json.dumps(payload, indent=2))

    event = payload.get('event')

    if event == 'charge.success':
        data = payload['data']
        reference = data['reference']
        amount = data['amount'] / 100
        booking_id = data['metadata'].get('booking_id')

        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(id=booking_id)
                logger.info(f"Processing payment for booking {booking_id}, status: {booking.booking_status}")

                if booking.booking_status != 'approved':
                    logger.warning(f"Booking {booking_id} is not approved, status: {booking.booking_status}")
                    return HttpResponse(status=200)

                if hasattr(booking, 'payment') and booking.payment.status != 'refunded':
                    payment = booking.payment
                    logger.warning(f"Duplicate payment attempt for booking {booking_id}. Existing payment: id={payment.id}, status={payment.status}")
                    return HttpResponse(status=200)

                if abs(float(amount) - float(booking.total_amount)) > 0.01:
                    logger.warning(f"Payment amount {amount} does not match booking total {booking.total_amount}")
                    return HttpResponse(status=400)

                if hasattr(booking, 'payment') and booking.payment.status == 'refunded':
                    payment = booking.payment
                    payment_id = payment.id
                    payment.delete()
                    logger.info(f"Deleted refunded payment {payment_id} for booking {booking_id}")

                Payment.objects.create(
                    booking=booking,
                    amount=amount,
                    payment_method='card' if data['channel'] == 'card' else 'momo',
                    transaction_id=reference,
                    status='success',
                    payment_date=now()
                )

                booking.booking_status = 'confirmed'
                booking.save()

                paid_bookings = Booking.objects.filter(
                    room=booking.room,
                    check_in_date__lt=booking.check_out_date,
                    check_out_date__gt=booking.check_in_date,
                    payment__status='success',
                    booking_status__in=['approved', 'confirmed']
                ).count()
                logger.info(f"Checking capacity for room {booking.room.id}: {paid_bookings}/{booking.room.max_occupancy}")

                if paid_bookings >= booking.room.max_occupancy:
                    booking.room.is_available = False
                    booking.room.save()
                    logger.info(f"Room {booking.room.id} set to unavailable after confirming booking {booking_id}")
                else:
                    booking.room.is_available = True
                    booking.room.save()
                    logger.info(f"Room {booking.room.id} remains available after confirming booking {booking_id}")

                logger.info(f"Booking {booking_id} confirmed with payment")

            except Booking.DoesNotExist:
                logger.error(f"Booking {booking_id} not found")
                return HttpResponse(status=404)

    return HttpResponse(status=200)
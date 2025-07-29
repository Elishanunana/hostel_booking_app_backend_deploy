from rest_framework import serializers
from core.models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'booking', 'amount', 'payment_method', 'transaction_id', 'payment_date', 'status']
        read_only_fields = ['transaction_id', 'payment_date', 'status']
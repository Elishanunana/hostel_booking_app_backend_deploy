from rest_framework.generics import ListAPIView
from core.models import Facility
from core.serializers.facility_serializer import FacilitySerializer

class FacilityListView(ListAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

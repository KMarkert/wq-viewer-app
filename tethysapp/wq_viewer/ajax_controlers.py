import json
from django.http import JsonResponse


def get_map(request):
    return_obj = {}

    if request.method == "POST":
        try:
            info = request.POST
            time_start = info.get('time_start')
            time_end = info.get('time_end')
            product = info.get('product')

            result = myProcess(time_start,time_end).getChlMap()

            mapid,token = str(result['mapid']),str(result['token'])

            return_obj["mapid"] = mapid
            return_obj["token"] = token

            return_obj["success"] = "success"

        except Exception as e:
            return_obj["error"] = "Error Processing Request. Error: "+ str(e)

    return JsonResponse(return_obj)

def get_timeseries(request):
    return_obj = {}

    if request.method == "POST":
        try:
            info = request.POST
            time_start = info.get('time_start')
            time_end = info.get('time_end')
            product = info.get('product')

            result = myProcess(time_start,time_end).getChlMap()

            mapid,token = str(result['mapid']),str(result['token'])

            return_obj["mapid"] = mapid
            return_obj["token"] = token

            return_obj["success"] = "success"

        except Exception as e:
            return_obj["error"] = "Error Processing Request. Error: "+ str(e)

    return JsonResponse(return_obj)

from __future__ import absolute_import
import json
from django.http import JsonResponse

from . import wqmapping as wq


def get_map(request):
    return_obj = {}

    if request.method == "POST":
        try:
            info = request.POST
            time_start = info.get('start_time')
            time_end = info.get('end_time')
            product = info.get('product')
            sensor = info.get('sensor')

            process = wq.waterquality(sensor,time_start,time_end)
            result = process.getMap(product)

            return_obj["url"] = result
            return_obj["success"] = "success"

        except Exception as e:
            return_obj["error"] = "Error Processing Request. Error: "+ str(e)

    return JsonResponse(return_obj)

def get_timeseries(request):
    return_obj = {}

    if request.method == "POST":
        try:
            info = request.POST
            sensor = info.get('sensor')
            time_start = info.get('start_time')
            time_end = info.get('end_time')
            product = info.get('product')
            scale = int(info.get('scale'))
            coords = list(info.get('coords').strip(' ').strip('[').strip(']').split(','))
            coords = [float(x.strip('[').strip(']')) for x in coords]

            inCoords = [[coords[i],coords[i+1]] for i in range(0,len(coords),2)]

            process = wq.waterquality(sensor,time_start,time_end)
            result = process.getTimeseries(product,inCoords,scale=scale)

            return_obj.update(result)
            return_obj["success"] = "success"

        except Exception as e:
            return_obj["error"] = "Error Processing Request. Error: "+ str(e)

    return JsonResponse(return_obj)

def get_download(request):
    return_obj = {}

    if request.method == "POST":
        try:
            info = request.POST
            sensor = info.get('sensor')
            time_start = info.get('start_time')
            time_end = info.get('end_time')
            product = info.get('product')
            scale = int(info.get('scale'))
            coords = list(info.get('coords').strip(' ').strip('[').strip(']').split(','))
            coords = [float(x.strip('[').strip(']')) for x in coords]

            inCoords = [[coords[i],coords[i+1]] for i in range(0,len(coords),2)]

            process = wq.waterquality(sensor,time_start,time_end)
            result = process.getDownload(product,inCoords,scale=scale)

            return_obj["url"] = result
            return_obj["success"] = "success"

        except Exception as e:
            return_obj["error"] = "Error Processing Request. Error: "+ str(e)

    return JsonResponse(return_obj)

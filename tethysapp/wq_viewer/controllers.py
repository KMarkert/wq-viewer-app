from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import Button, DatePicker, SelectInput

import json

# @login_required()
def home(request):
    """
    Controller for the app home page.
    """

    sensor_selection = SelectInput(
        # display_text='Select precipitation product:',
        name='sensor_selection',
        multiple=False,
        options=[('Landsat 8', 'lc8'),
                 ('Sentinel-2', 's2')],
        initial=['Landsat 8'],
        select2_options={'placeholder': 'Select a sensor',
                         'allowClear': False}
    )

    product_selection = SelectInput(
        # display_text='Select precipitation product:',
        name='product_selection',
        multiple=False,
        options=[('Rrs', 'rrs'),
                 ('Secchi Depth', 'sd'),
                 ('Trophic State Index', 'tsi'),
                 ('Chlorophyll-a', 'chla')],
        initial=['Rrs'],
        select2_options={'placeholder': 'Select a product',
                         'allowClear': False}
    )

    download_button = Button(
        display_text='Download Region',
        name='download-button',
        icon='glyphicon glyphicon-cloud-download',
        style='primary',
    )

    timeseries_button = Button(
        display_text='Get Time Series',
        name='timeseries-button',
        icon='glyphicon glyphicon-signal',
        style='success',
    )

    time_start = DatePicker(
        name='time_start',
        # display_text='Start Date',
        autoclose=True,
        format='yyyy-mm-dd',
        start_view='decade',
        today_button=True,
        initial='2015-08-01'
    )

    time_end = DatePicker(
        name='time_end',
        # display_text='End Date',
        autoclose=True,
        format='yyyy-mm-dd',
        start_view='decade',
        today_button=True,
        initial='2015-09-01'
    )

    # result = myProcess(time_start['initial'],time_end['initial']).getChlMap()
    #
    # mapid,token = str(result['mapid']),str(result['token'])
    # print(mapid,token)

    # chla_layer = tile_url_template.format(**map_id)

    context = {
        # 'chla_mapid': mapid,
        # 'chla_token': token,
        'sensor_selection':sensor_selection,
        'product_selection': product_selection,
        'download_button': download_button,
        'timeseries_button': timeseries_button,
        'time_start': time_start,
        'time_end': time_end,
    }

    return render(request, 'wq_viewer/home.html', context)

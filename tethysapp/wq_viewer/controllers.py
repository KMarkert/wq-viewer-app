from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import Button, DatePicker, SelectInput

import json

# @login_required()
def home(request):
    """
    Controller for the app home page.
    """

    product_selection = SelectInput(
        # display_text='Select precipitation product:',
        name='product_selection',
        multiple=False,
        options=[('Trophic State Index', 'tsi'),
                 ('Chlorophyll-a', 'chla'),
                 ('Secchi Depth', 'sd')],
        initial=['Trophic State Index'],
        select2_options={'placeholder': 'Select a product',
                         'allowClear': False}
    )

    update_button = Button(
        display_text='Update Map',
        name='update-button',
        icon='glyphicon glyphicon-refresh',
        style='success',
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
        initial='2015-08-03'
    )

    time_end = DatePicker(
        name='time_end',
        # display_text='End Date',
        autoclose=True,
        format='yyyy-mm-dd',
        start_view='decade',
        today_button=True,
        initial='2015-08-05'
    )

    # result = myProcess(time_start['initial'],time_end['initial']).getChlMap()
    #
    # mapid,token = str(result['mapid']),str(result['token'])
    # print(mapid,token)

    # chla_layer = tile_url_template.format(**map_id)

    context = {
        # 'chla_mapid': mapid,
        # 'chla_token': token,
        'product_selection': product_selection,
        'update_button': update_button,
        'timeseries_button': timeseries_button,
        'time_start': time_start,
        'time_end': time_end,
    }

    return render(request, 'wq_viewer/home.html', context)

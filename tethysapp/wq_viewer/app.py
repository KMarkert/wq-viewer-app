from tethys_sdk.base import TethysAppBase, url_map_maker


class WqViewer(TethysAppBase):
    """
    Tethys app class for WQ Viewer.
    """

    name = 'WQ Viewer'
    index = 'wq_viewer:home'
    icon = 'wq_viewer/images/wq-icon.png'
    package = 'wq_viewer'
    root_url = 'wq-viewer'
    color = '#2c3e50'
    description = 'Place a brief description of your app here.'
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='wq-viewer',
                controller='wq_viewer.controllers.home'
            ),
            UrlMap(
                name='get_map',
                url='wq-viewer/get_map',
                controller='wq_viewer.ajax_controllers.get_map'
            ),
            UrlMap(
                name='get_timeseries',
                url='wq-viewer/get_timeseries',
                controller='wq_viewer.ajax_controllers.get_timeseries'
            ),
            UrlMap(
                name='get_download',
                url='wq-viewer/get_download',
                controller='wq_viewer.ajax_controllers.get_download'
            ),
        )

        return url_maps

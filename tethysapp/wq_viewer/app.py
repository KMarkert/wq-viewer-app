from tethys_sdk.base import TethysAppBase, url_map_maker


class WqViewer(TethysAppBase):
    """
    Tethys app class for WQ Viewer.
    """

    name = 'WQ Viewer'
    index = 'wq_viewer:home'
    icon = 'wq_viewer/images/icon.gif'
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
        )

        return url_maps

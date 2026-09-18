from django.conf import settings
from whitenoise.middleware import WhiteNoiseMiddleware


class SiteWhiteNoiseMiddleware(WhiteNoiseMiddleware):
    """
    WhiteNoiseMiddleware, plus the Godot web export served at a fixed
    /godot-export/ prefix with unhashed filenames -- Godot's loader builds
    its .wasm/.pck URLs by string concatenation in the browser, so a
    content-hashed filename (like the rest of STATIC_ROOT gets) would
    break it. Serving it through WhiteNoise like this still gets it
    gzip/brotli compression and Cache-Control headers, unlike
    django.views.static.serve.
    """

    def __init__(self, get_response=None):
        super().__init__(get_response)
        self.add_files(settings.BASE_DIR / "godot-export", prefix="godot-export/")

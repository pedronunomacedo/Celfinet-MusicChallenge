from django.core.management.base import BaseCommand
from django.urls import get_resolver, URLPattern, URLResolver

class Command(BaseCommand):
    help = 'Lists all URLs in the project'

    def handle(self, *args, **kwargs):
        url_patterns = get_resolver().url_patterns
        self.print_urls(url_patterns)

    def print_urls(self, url_patterns, prefix=''):
        for pattern in url_patterns:
            if isinstance(pattern, URLResolver):
                self.print_urls(pattern.url_patterns, prefix + str(pattern.pattern))
            elif isinstance(pattern, URLPattern):
                self.stdout.write(prefix + str(pattern.pattern))
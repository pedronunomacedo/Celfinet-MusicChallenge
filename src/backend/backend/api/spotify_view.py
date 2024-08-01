
import logging
import random
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from backend.settings import client_id
from backend.settings import client_secret

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class SpotifyViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]  # Allow access to all users (comment this to add authentication security privacy)

    @csrf_exempt  # Uncomment this for testing (if comment, it should give the error CSRF verification failed)
    @action(detail=False, methods=['post'], url_path='search')
    def searchSpotify(self, request, *args, **kwargs):
        searchQuery = request.data.get('search-query')
        
        if not searchQuery:
            return Response({"error": "search-query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Set up the Spotify client credentials
        client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
        sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
        
        # Perform the search
        results = sp.search(q=searchQuery, type='track', limit=10)
        
        # Extract and print the URIs
        uris = [track['uri'] for track in results['tracks']['items'] if track['preview_url'] is not None]
        preview_urls = [track['preview_url'] for track in results['tracks']['items'] if track['preview_url'] is not None]
        musics_info = [{
            "music_name": track['name'],
            "music_link": track.get('external_urls', {}).get('spotify', {})
        } for track in results['tracks']['items'] if track['preview_url'] is not None]
        
        musics_artists = []
        for track in results['tracks']['items']:
            track_artists = []
            for artist in track['artists']:
                if track['preview_url'] is not None:
                    track_artists.append({
                        "artist_name": artist['name'],
                        "artist_link": artist.get('external_urls', {}).get('spotify', '')
                    })
            if len(track_artists) > 0:
                musics_artists.append(track_artists)
        
        randomn = random.randint(0, len(uris) - 1)
        
        return Response({"uri": uris[randomn], "preview_url": preview_urls[randomn], "music_info": musics_info[randomn], "music_artists": musics_artists[randomn]}, status=status.HTTP_200_OK)
    
    @csrf_exempt  # Uncomment this for testing (if comment, it should give the error CSRF verification failed)
    @action(detail=False, methods=['get'], url_path='get_token')
    def getAccessToken(self, request, *args, **kwargs):
        # Set up the Spotify client credentials
        client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
        sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
        
        # Get the user's access token
        token = sp.oauth2.get_access_token()
        
        return Response({"access_token": token}, status=status.HTTP_200_OK)
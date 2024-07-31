import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from backend.backend.settings import client_id
from backend.backend.settings import client_secret
import random


def search_spotify(string):
    # Set up the Spotify client credentials
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    
    # Perform the search
    results = sp.search(q=string, type='track', limit=10)
    
    # Extract and print the URIs
    uris = [track['uri'] for track in results['tracks']['items']]
     

    return uris[randomn]




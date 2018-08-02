let accessToken;
const clientId = '01867db7ad384e77909a5eb83ff6260f';
const redirectUri = 'http://localhost:3000/';

const Spotify = {
  startAuthorization() {
    console.log('authorization');
    let url =
      'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + clientId +
      '&redirect_uri=' + redirectUri;
      window.location = url;
    },

  getAccessToken(){
    if(accessToken){
      console.log('Token is ' + accessToken)
      return accessToken;
    }
    const matchToken = window.location.href.match(/access_token=([^&]*)/);
    const expireIn = window.location.href.match(/expires_in=([^&]*)/);

      if(matchToken && expireIn){
        const expiration = Number(expireIn[1]);
        accessToken = matchToken[1];

        window.setTimeout(() => accessToken = '', expiration * 1000);
        window.history.pushState('Access Token', null, '/');

        return accessToken;
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
      }
    },

    search(searchTerm){
      const accessToken = Spotify.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=TRACK&q=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json()
    }
    ).then(jsonResponse => {
        if(!jsonResponse.tracks){
          return [];
        }
        console.log(jsonResponse.tracks);
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }))
        }
      );
    },

    savePlaylist(playlistName, trackURIs){
      if(!playlistName|| !trackURIs){
        return;
      }
      const accessToken = Spotify.getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json'
    };
      let userId;

      return fetch('https://api.spotify.com/v1/users/me', {
        headers: headers
      }).then(jsonResponse => {
        return jsonResponse.json();
      }).then(jsonResponse => {

        userId = jsonResponse.id;

      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(jsonResponse => {
        return jsonResponse.json();

      }).then(jsonResponse => {
        const playlistID = jsonResponse.id;

        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackURIs})
        })
      });
    });
    }

};

export default Spotify;

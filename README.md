# Corona Game

An online card game based on the Corona Virus.

![Screenshot of the Game](https://floatymonkey.com/corona/banner.png)

# About

This game was made to keep myself busy during the COVID-19 lockdown and to have something to do during Skype calls with my friends.

Special thanks to [Thomas Van de Vliet](https://instagram.com/thomasvandevliet) for his amazing drawings and [Jonathan Swinnen](https://soundcloud.com/jsm_music) for the soundtrack.

Fun Facts: The *Lockdown* card depicts [Maggie De Block](https://en.wikipedia.org/wiki/Maggie_De_Block), our Belgian Minister of Health at the time of the outbreak. The *Future* card depicts [Marc Van Ranst](https://en.wikipedia.org/wiki/Marc_Van_Ranst), a well-known virologist and epidemiologist in Belgium. The man on the *Fake News* card requires no introduction I guess.

# Usage

## Installing

```bash
# Install npm dependencies
npm i

# Download game assets (music, images, ...)
npm run download-assets
```

## Development

```bash
# Run Node.js server
# Auto restarts on code changes
npm run server

# Run webpack-dev-server (in a separate console)
# Launches a web browser and hot reloads client code
npm run dev
```

## Production

In production we rely on NGINX to perform SSL termination, serve static files and redirect http and https traffic to the Node.js server. All static files can be easily bundled using Webpack. Before you do so, make sure to configure the `GAME_SERVER` URL in `webpack.prod.js`.

```bash
# Bundle all client code and place output in 'dist' folder
npm run build
```

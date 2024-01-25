# firebase-deeplink

Easily create an endpoint in firebase cloud function that redirects deep links to mobile apps

Takes away the pain of forwarding users to the right app store / mobile app firebase cloud functions and nodejs platform.

## Use case

Suppose you have a custom url scheme `app://` handled by your mobile apps. You want to create a universal "smart" link that will know where to send the user:

- If the user has the app installed, open the app with the deeplink.
- If the user doesn't have the app installed, send to the app store to download the app (google play / itunes).
- If the user doesn't have a supported phone, send to a fallback url.

## Usage

### Example:

```js
var express = require('express');
var deeplink = require('node-deeplink');

var app = express();

app.get(
  '/deeplink',
  deeplink({
    fallback: 'https://orbixtartechnologies.com',
    android_package_name: 'com.orbixtartechnologies.deeplink',
    ios_store_link:
      'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4',
  })
);
```

This example creates an endpoint `GET /deeplink` in your web server.

Assuming your server address is `https://acme.org`, you can use the link `https://acme.org/deeplink?url=app://account` so when users will open it the app will open with `app://account` deeplink or the users will be redirected to download the app in case they don't have it.

### Available options

_node-deeplink_ currently only supports Android and ios.

Options to pass on to _node-deeplink_ are:

- `url`: **mandatory**. The deeplink url you want the user to be directed to e.g. `app://account`.
- `fallback`: **mandatory**. A fallback url in case the user is opening the link via an unsupported platform like desktop / windows phone etc. In such case, the fallback url will be opened in the user's browser like a normal link.
- `android_package_name`: **optional**. In case you want to support Android deep links, pass your app's package name.
- `ios_store_link`: **optional**. In case you want to support ios deep links, pass your app's itunes url. You can get it [here](https://linkmaker.itunes.apple.com/us/).
- `title`: **optional**. Title for the intermediate html page. Defaults to an empty string.

### Query params

When a request comes in, the following query params are checked:

- `url`: **optional**. If available, will prefer this deeplink url over the one from the options.
- `fallback`: **optional**. If available, will prefer this fallback address over the one from the options.

### Behaviour

_node-deeplink_ works by first sending the user to an html page with a user-agent sniffing script. After figuring out the user's device, it redirects them to the predefined deeplink. In practice, after clicking the link, the browser will be opened for a very short moment and then the redirect will happen.

### TODO

- Better user-agent discovery.
- Enable non-express use.

# Media Archive Bot — build a HTML-archive of media files

This Delta Chat bot archives all media files that it receives, and builds a HTML-page to view them all.

Use it e.g. to create a (semi-)public log of pictures from the chats at a meeting.

To serve the HTML, make the HTTP-server of your choice serve static files from `./web/public/`.



## Requirements

* NPM and NodeJS >= 7.6.
* An email account for the bot.

## Setup

1. Install the dependencies by running `npm install`.
2. Configure the bot by writing its email-address and password into `config/local.json` like this:
```json
{
  "email_address": "bot@example.net",
  "email_password": "secretandsecure"
}
```

## Run

Run the bot with `npm start`.


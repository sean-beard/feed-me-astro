# FeedMe

https://feedme.digital

RSS feed reader allowing users to curate a truly personalized newsfeed.

Users authenticate via GitHub and can subscribe to RSS feeds.

## Development

The [FeedMe API](https://github.com/sean-beard/feed-me-api) is used in this application to manage users, feed content and subscriptions.

### Getting started

Get the dependencies

```bash
$ yarn install
```

Compile and hot-reload for development

```bash
$ yarn dev
```

Compile and minify for production

```bash
$ yarn build
```

Run the unit tests

```bash
$ yarn test
```

### Deployment

This project uses [Netlify](https://www.netlify.com/) for deployment. The frontend is deployed when code gets merged.

## Cypress

This project uses Cypress for end-to-end testing.

| Env Variable              | Description                               |
| :------------------------ | :---------------------------------------- |
| `CYPRESS_GITHUB_USERNAME` | Username Cypress will use to authenticate |
| `CYPRESS_GITHUB_PASSWORD` | Password Cypress will use to authenticate |

Set the environment variables above then open Cypress

```bash
$ yarn cypress:open
```

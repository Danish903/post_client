<div align="center"><strong>N</strong>ode <strong>A</strong>pollo <strong>P</strong>risma <strong>E</strong>xpress <strong>R</strong>eact <strong>G</strong>raphQL <strong>P</strong>ostgresql
</div>
  
<h1 align="center"><strong>Fullstack GraphQL App with React & Prisma</strong></h1>
<h3 align="center">Authentication with roles & permissions. Backend & Frontend</h3>
<h3 align="center">Upload image with expressJs</h3>
<h3 align="center">Messages with GraphQL Subscriptions</h3>
<br />

![image](https://user-images.githubusercontent.com/15246526/38530809-7a9cc69e-3c21-11e8-8eb9-6f143eb7d64d.png)

<div align="center"><strong>🚀 fullstack GraphQL app</strong></div>

### [Online Demo](https://photoups.netlify.com/)

As the Demo Server is hosted on a free Heroku account, the servers its hosted on enter `sleep mode` when not in use. If you notice a delay, please allow a few seconds for the servers to wake and try refreshing a browser.

## Installation

1. Clone project

```
git clone git@github.com:Danish903/post_client.git
```

2. cd into post_client

```
cd web
```

3. Download dependencies

```
npm i
```

4. In `web` create a file called `.env` and add the following line inside: `REACT_APP_SERVER_URL=https://insta-app-server.herokuapp.com` and
   `REACT_APP_WS_URL=wss://insta-app-server.herokuapp.com`

5. Start app

```
npm start
```

## Features

-  Web login/Signup
-  User can post their beautiful pictures
-  User can like/comments in real time on their or other user's post
-  User can make their post private and can disable comments for their post
-  Post owner can delete other user's comments
-  Infinite scroller on fetchings pictures and comments

## Made with..

Frontend:

-  User interfaces: React https://reactjs.org/
-  Design: semantic-ui-react https://react.semantic-ui.com/
-  GraphQL tool: Apollo Client https://www.apollographql.com/

Backend:

-  Server GraphQL: GraphQL yoga https://github.com/prismagraphql/graphql-yoga
-  ORM (object-relational mapping): Prisma https://www.prisma.io/
-  Database Postgresql: https://www.postgresql.org/

## App graphql api source

[Server Code](https://github.com/Danish903/post_server)

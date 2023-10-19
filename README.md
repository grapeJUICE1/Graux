<h1 align="center"> Graux </h1>

> Aux Battles For The Web

### Introduction

An Aux battle is a music competition between 2 or more people. Typically a 1v1 or 1v1 bracket.
Graux is a web application which let's you create aux battles with your friends.

Main features:

- Create Battles specifying how long the battle should run
- Query Battles created in the platform with sort,search and pagination
- Query Users of the platform with sort , search and pagination
- Login/Register with jwt
- Send request to people to join your battle
- Choose song for your battle
- Liking/Disliking Battle
- Vote for a user in a battle
- Comment in a Battle
- Determine Winner of the battle
- Check Profile of a user
- Manage your Battles

### Technologies Used

The server is a [Graphql](https://graphql.org/) server made with [Nodejs](https://nodejs.org/en) and [Apollo Server](https://www.apollographql.com/docs/apollo-server/) .<br>
It uses [Postgresql](https://www.postgresql.org/) as database with [Typeorm](https://typeorm.io/) as orm .<br>
The code for the Server is located at src directory in the root folder.

The Frontend is based on [Next.js](https://nextjs.org/) <br>
Communication with the graphql server is done with [Apollo Client](https://www.apollographql.com/docs/react/)<br>
It uses [Chakra UI](https://chakra-ui.com/) for styling<br>
The code for the Frontend is located at client directory in the root folder.

### Running The Project Locally

First you have to clone this directory .
Now to run the backend , on the root directory run

```shell
npm install
```

Next , create a src/config/config.env file <br>
The file should look like this .

```env
NODE_ENV="development"
PORT="3000"

DATABASE_PORT="5432"
DATABASE_TYPE="postgres"

DATABASE_HOST=""
DATABASE_USERNAME=""
DATABASE_PASSWORD=""
DATABASE_NAME=""

LOCAL_DATABASE_HOST=""
LOCAL_DATABASE_USERNAME=""
LOCAL_DATABASE_PASSWORD=""
LOCAL_DATABASE_NAME=""

ACCESS_TOKEN_SECRET=""
REFRESH_TOKEN_SECRET=""
LAST_FM_API_KEY=""
```

Fill the blank strings with the necessary value. If you wanna run this project locally then fill the local database fields and if u have a postgres instance running somewhere then fill the database fields.

Now on the root folder , run

```shell
npm run dev
```

The server should start at http://localhost:3000/

Now to run the frontend go to the client folder in the root directory
There , u have to run

```shell
npm install
```

Next Create a .env.local file at client/.env.local <br>
File should look like this

```env
NEXT_PUBLIC_LAST_FM_API_KEY=
```

Add a last fm api key here . This will be used for music metadata . More info at [here](https://www.last.fm/api)

Now on the client folder , run

```shell
npm run dev
```

The web app should start at http://localhost:5000/

### Seeding the database

To fill the database with dummy data , Just go to the root directory . <br>
Then run

```shell
npm run seed
```

### Screenshots

###### Battles page

![Battles Page](https://raw.githubusercontent.com/grapeJUICE1/Graux/master/Screenshots/battles.png "Battles Page")

###### Individual Battle page

![Individual Battle](https://raw.githubusercontent.com/grapeJUICE1/Graux/master/Screenshots/individual_battle.png "Individual Battle Page")

###### Comments

![Comments](https://raw.githubusercontent.com/grapeJUICE1/Graux/master/Screenshots/comments.png "Comments")

###### Choose song

![Choose song](https://raw.githubusercontent.com/grapeJUICE1/Graux/master/Screenshots/choose_song.png "Choose song")

###### Manage Battle Page

![Manage Battle Page](https://raw.githubusercontent.com/grapeJUICE1/Graux/master/Screenshots/manage_battle.png "Manage Battle Page")

###### User Profile Page

![User Profile Page](https://raw.githubusercontent.com/grapeJUICE1/Graux/master/Screenshots/user_profile.png "User Profile Page")

###### Users Page

![Users Page](https://raw.githubusercontent.com/grapeJUICE1/Graux/master/Screenshots/users.png "Users Page")

###### Login Page

![Login Page](https://raw.githubusercontent.com/grapeJUICE1/Graux/master/Screenshots/login.png "Login Page")

### Todos

- [ ] User Image Upload
- [ ] Password Change
- [ ] Edit User
- [ ] Daily/Weekly/Monthly leaderboards
- [ ] removing @ts-ignores and using es-lint

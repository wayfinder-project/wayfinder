# Wayfinder

Wayfinder is an innovative trip planning app, aiming to make it easy for
users to plan and take a trip from start to finish. Wayfinder allows users to
plan routes with multiple waypoints, search for lodging and attractions at
each waypoint and keep a checklist of trip essentials. Wayfinder allows users
full access to all the trips they have created in the app, where they can
track their progress and update details as they go.

## Table of contents

- [Objectives](#objectives)
- [Current state](#current-state)
- [Project roles](#project-roles)
- [Key concepts and definitions](#key-concepts-and-definitions)
- [Information for developers](#information-for-developers)
  - [Git directions](#git-directions)
  - [Server API](#server-api)
  - [Project layout](#project-layout)
  - [Environment variables](#environment-variables)
  - [Deployment](#deployment)

## Objectives

- Provide an intuitive and attractive user interface for planning a trip from
  start to finish
- Allow users to update and monitor trip status on-the-go by tracking their
  position alongside the route
- Assist users in managing trip essentials through a checklist
- Integrate with Airbnb and Google's Places API to display lodging locations
  and points of interest near each waypoint

## Current state

Wayfinder is currently under heavy preliminary development.

## Project roles

- **Project lead**: Ian

## Key concepts and definitions

To keep the project uniform and understandable to users, Wayfinder uses a set
of consistent vocabulary to describe its central concepts and components. The
following list is intended to be a comprehensive reference for developers and
users alike.

- **route**: the path that the user takes from their starting point to their
  destination
- **waypoint**: a single stop along a route. The starting point and
  destination are considered waypoints as well.
- **leg**: a portion of the route between two adjacent waypoints

## Information for developers

### Git directions

Here is an overview of the steps you need to take in order to make a
successful change to the repo. If you do not follow all these steps, there
may be problems!

```sh
git checkout -b your-branch # Omit the '-b' if the branch already exists.
# Make changes to branch...
git add .  # Assuming you are in the root directory.
git commit -m 'Descriptive commit message'
git push -u origin your-branch # You can use just 'git push' if you've already pushed.
```

Before you make a pull request, it's a good idea to merge any new changes
from the dev branch, especially if you've spent a decent amount of time on
your changes (making it more likely that the dev branch has changed). This is
the best way to detect merge conflicts early.

```sh
# To merge any new changes from the dev branch:
git checkout dev
git pull
git checkout your-branch
git merge dev
```

If you get any merge conflicts, resolve them and then make a new commit (`git add . && git commit -m 'Descriptive commit message`).
Once you've pushed your branch, make a pull request on GitHub and make sure
that your PR is based off the dev branch and not master!

### Server API

The following is an (evolving) specification for the back-end API, organized
by endpoint and method (and any parameters).

The Content-Type for all requests and responses is
`"application/json; charset=UTF-8"`.

Note that, in addition to any status codes listed on the endpoints, a status
code of 403 (forbidden) may be returned from any endpoint except `/login` and
`POST /users` to indicate that the user is not logged in or does not have
sufficient permissions to access the resource.

#### Type reference

Type definitions are given here in TypeScript notation. The definitions
should be interpreted as if written using TypeScripts `strict` option; that
is, properties not explicitly marked as optional may not be null.

##### `ApiError`

```ts
{
  /**
   * The primary message describing the error.
   */
  message: string;
  /**
   * Any additional details that may be present.
   */
  details: string[];
}
```

##### `User`

```ts
{
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  trips: Trip[];
}
```

##### `Trip`

```ts
{
  id: number;
  /**
   * As a UTC timestamp in the format "yyyy-MM-dd'T'HH:mm:ss'Z'"; e.g.
   * "2018-09-06T21:45:45Z".
   */
  creationDate: string;
  route: Route;
}
```

##### `Route`

```ts
{
  id: number;
  /**
   * Always ordered from start to finish.
   */
  legs: Leg[];
}
```

##### `Leg`

```ts
{
  id: number;
  start: Waypoint;
  end: Waypoint;
  /**
   * In seconds.
   */
  travelTime: number;
  /**
   * In meters.
   */
  distance: number;
  /**
   * The zero-based index of this leg, to order it among other legs.
   */
  index: number;
}
```

##### `Waypoint`

```ts
{
  id: number;
  latitude: number;
  longitude: number;
  /**
   * A user-readable address string.
   */
  address: string;
}
```

#### `/users`

##### GET

**Response status**: 200 (OK)

**Response type**: `User[]`

**Response body**: An array of all users in the database (empty if no users;
the status is successful either way).

##### GET `/{id}`

**Response status**: 200 (OK) or 404 (not found)

**Response type**: `User[] | ''`

**Response body**: The user with the given ID.

##### GET `?username={username}`

**Response status**: 200 (OK) or 404 (not found)

**Response type**: `User[] | ''`

**Response body**: The user with the given username.

##### POST

**Response status**: 201 (created) or 409 (conflict)

**Request body**: `{ user: User; password: string; }`

**Response type**: `User | ApiError`

**Response body**: The newly created user, or an error message describing the
reason for failure.

##### PATCH

**Response status**: 200 (OK), 404 (not found) or 409 (conflict)

**Request body**: `User`

**Response type**: `User | ApiError`

**Response body**: The updated user, or an error message describing the
reason for failure (e.g. if no user exists with the same ID to be updated, or
the user attempts to change their username to one that is already taken).

#### `/login`

##### POST

**Response status**: 200 (OK) or 403 (forbidden)

**Request body**: `{ username: string, password: string }`

**Response type**: `string | ApiError`

**Response body**: A JSON Web Token which can be used for authenticating the
logged-in user, or an error if the login failed.

### Project layout

The project is split into two primary components: the server and the client.
The server project is stored in the `server` subdirectory of the project
root, and the client project is stored in the `client` subdirectory.

### Environment variables

There are several environment variables that are recognized by various parts
of the project, and the project may not function correctly if they are not
set. The following is a comprehensive list of all such environment variables:

- `JDBC_URL`: the URL of the database
- `JDBC_USER`: the database user
- `JDBC_PASSWORD`: the database password
- `JWT_SECRET`: the secret used in signing JSON Web Tokens

### Deployment

The project is automatically deployed by Jenkins whenever changes are made on
the master branch. The deployment is naturally split into two distinct parts,
the client and the server.

The server code is packaged by Jenkins and installed on the Tomcat server
running on project's EC2 instance. You can package the code locally by
navigating to the `server` directory and running `mvn clean package`. This
will generate a `war` package which can then be deployed to the server of
your choosing (e.g. a local Tomcat server).

The client code is built and deployed using NPM. To insure that all
dependencies are properly set up, navigate to the `client` directory and run
`npm install`. To test the project locally, run `ng serve`, which will start
a local server on port 4200 to run the app. To manually deploy the front-end
to GitHub pages, run `npm deploy` and enter your GitHub credentials if
prompted. Alternatively, run `ng build` or `ng build --prod` to simply build
the project without deploying it.

If you run the code locally, be aware that certain environment variables may
need to be set for the project to function properly (see the section on
environment variables above). Additionally, running Angular CLI commands with
the `--prod` argument will use the production environment defined in
`src/environments/environment.prod.ts`, which may be different than the
development environment defined in `src/environments/environment.ts`.

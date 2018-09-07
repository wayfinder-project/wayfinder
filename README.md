# Wayfinder

Wayfinder is an innovative trip planning app, aiming to make it easy for
users to plan and take a trip from start to finish. Wayfinder allows users to
plan routes with multiple waypoints, search for lodging and attractions at
each waypoint and keep a checklist of trip essentials. Wayfinder allows users
full access to all the trips they have created in the app, where they can
track their progress and update details as they go.

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

## Git Process Directions

- IN YOUR BRANCH (make changes to files)
- Git add .
- Git commit -m “ ”
- Git push
- Git checkout dev
- Git pull
- Git checkout (YOUR BRANCH)
- Git merge dev -m “ “
- If you get merge conflicts
  - RESOLVE merge conflicts
  - REPEAT all steps
- MERGE REQUEST SHOULD BE SENT IN GITHUB GUI

## Information for developers

### Server API

The following is an (evolving) specification for the back-end API, organized
by endpoint and method (and any parameters).

#### Type reference

Type definitions are given here in TypeScript notation. The definitions
should be interpreted as if written using TypeScripts `strict` option; that
is, properties not explicitly marked as optional may not be null.

##### `ErrorMessage`

```ts
{
  message: string;
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
  trips?: Trip[];
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

**Response type**: `User | ErrorMessage`

**Response body**: The newly created user, or an error message describing the
reason for failure.

##### PATCH

**Response status**: 200 (OK), 404 (not found) or 409 (conflict)

**Request body**: `User`

**Response type**: `User | ErrorMessage`

**Response body**: The updated user, or an error message describing the
reason for failure (e.g. if no user exists with the same ID to be updated, or
the user attempts to change their username to one that is already taken).

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

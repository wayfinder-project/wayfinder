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

### Project layout

The project is split into two primary components: the server and the client.
The server project is stored in the `server` subdirectory of the project
root, and the client project is stored in the `client` subdirectory.

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
need to be set for the project to function properly (TODO: document these
when they are added). Additionally, running Angular CLI commands with the
`--prod` argument will use the production environment defined in
`src/environments/environment.prod.ts`, which may be different than the
development environment defined in `src/environments/environment.ts`.

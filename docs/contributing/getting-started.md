# Getting Started

## System Requirements

- [Node.js](https://nodejs.org/en/) >= 14.xx

## Starting the Project

### Install NPM Dependencies

To set up and install all project level dependencies run: `npm install`

### Mongo Access

To run this project you need a mongodb env setup. Currently this project accesses the [DEGEN](https://github.com/BanklessDAO/DEGEN) bot DB. Either run that project locally or acquire a connection string to its dev db for testing.

### Environment Variables

You will not be able to run the project without the required variables. If you run the project as described below it will log which required env variables are missing. Be sure to acquire these values from the team and add them to a `.env.local` file at the root of the project and next.js will pick the up for local development.

### Run the project

To start the project run: `npm run start`

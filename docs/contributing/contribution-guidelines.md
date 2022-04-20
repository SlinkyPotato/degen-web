# Contribution Guidelines

Contribution Guidelines

To get setup, please follow these guidelines:

If you have not created a discord bot for degen

Create your own bot to use in your local dev environment

Visit the Discord Developer Portal
Sign in with your Discord credentials
Create a new application, call it whatever you want
On the left, select "Bot" and create a bot user
Switch on "Presence Intent" and "Server Members Intent"
Save your changes
On the left, select "OAuth2"
Under "Scopes", select "bot"
Permissions. Enable only these permissions:
Manage Roles
Manage Channels
Kick Members
Ban Members
Manage Emojis & Stickers
Manage Webhooks
View Channels
All of the permissions under "Text Permissions"
No permissions under "Voice Permissions"
Select and copy the generated URL under "Scopes." Make sure the you have these permissions selected.
Send the URL via Discord DM to JonValJonathan to have it added to the test Discord server

Create a mongoDB Instance.
A mongoDB solution can be hosted at https://www.mongodb.com/cloud. Alternatively, you can host one on your local machine. Instructions on creating an instance can be found here https://www.mongodb.com/docs/atlas/getting-started/?_ga=2.264132744.523485467.1650467546-1291180723.1650467546py
Once created, copy your mongoDB cluster's URI and store it somewhere. You will need this later

Clone the repo to local

Create a new feature branch from the dev branch (docs/<name>, feature/<name>, release/<name>, hotfix/<name>).
Copy the .env.template file and name it .env;

Copy your mongoDB URI and replace the relevant values in your copied .env file
Copy your bot's token (found under the bot tab in the developer's portal) and replace the relevant values in your copied .env file, making sure to update the file name where it is required in app.js
'yarn start' or 'npm start' will run the prestart script to get everything installed and running.
Run the website and test your connections.
Whenever you're ready for a pull request, open a pr with dev branch.
Develop!

Work on your features/assignments. Tests should be written for new features that are added. We are using Jest as the test library, so please familiarize yourself with Jest if you are not already familiar with it. If you need help with writing tests, please ask, as we have a couple devs on board who have experience in this area.

When you feel the feature is ready to be battle tested, lint and test your code and run it through Prettier prior to pushing it. Submitting a PR will trigger this workflow anyway. However, the less we have to do to fix merge conflicts and failed workflows, the better.

Once the branch is ready to be merged, push it to the repo and create a PR to the dev branch. From this point, it will follow the details set out in WORKFLOW.md.

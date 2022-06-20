# SowardsSuites
Sowards' Suites is a website used to manage time shares and who is booking what on what day in the time share.
Currently this website is only for those wanting to book rooms at the Sowards home, but in the future this will be expanded to include any person's time share.
You can also post events that will be happening.

Visit [sowardssuites.com](https://sowardssuites.com) to see the website in action!

### Working on issues
If you want to help with an issue, feel free! There are some things you should note:
- The front end of this website is written in Vue.js. So an understanding of this framework will be helpful
- The back end uses an api key to a mongo database that is loaded in from a config file that is not on github, so you will not be able to access the database and see any bookings or events on your local environment. Because of this, don't work on any issues that either have to deal with the back end or have to deal with any rooms, bookings, or events.

#### To Start
- Find an issue you want to work on, and if there isn't anyone already assigned, assign yourself
- Either fork or clone this repository
- run these commands:

`cd front-end`

`npm install`

`npm run serve`

- Then go to [http://localhost:8080](http://localhost:8080)
- There you should see the webiste. Any changes to the code will reflect on this website

#### Submitting a pull request
When you are done with the issue, submit a pull request. Click [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) or [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request#changing-the-branch-range-and-destination-repository) for more info.

Then assign _bradofrado_ to be a code reviewer. 

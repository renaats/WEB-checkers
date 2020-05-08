# WEB checkers
A WEB based game of Russian checkers.

# Group members
* [Renāts Jurševskis](mailto:r.jursevskis@student.tudelft.nl)
* [Kerem Cakici](mailto:k.cakici@student.tudelft.nl)

# How to run it
You can run the server via the terminal.
First you need to run `npm install` to install all necessary dependencies.
After that, the server should start when `npm start` is executed. Make sure to be in the correct terminal folder!

To see the game, connect to localhost:3000 using a browser.
Chrome is recommended, as we do not guarantee it working on other browsers.
The recommended desktop scaling is 100% for 1080p, otherwise it might run into scaling issues.

# Deployment
To play the game online, the server needs to be deployed.
To do so, the URL variable on the first line of interactions.js needs to be changed to the server URL.
* As a short-term solution we recommend [ngrok](https://ngrok.com/)
* For production deployment we suggest [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)


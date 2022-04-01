## FYSM
FYSM is an open source application that allows you to run your own social media application. The application focuses on detecting fake news, hate messages and preventing the spread of such information. For this purpose, all messages sent in the application are checked by algorithms for their content and, if necessary, blocked when they are sent and saved. However, there are also classic functionalities such as writing messages in groups, sending direct messages to friends or creating posts.

## Download & Install
### Download
In order to download and install this application, you must first install [Git](https://git-scm.com) and [Node.js](https://nodejs.org) (which includes [npm](https://www.npmjs.com)).
If both are installed the project can be downloaded using the following command:

    git clone https://github.com/RealNiiclas/fysm.git
    
### Install
Once the entire project has been downloaded, all required dependencies can be installed using the Node Package Manager (npm for short).
For this, you can use the following command:

    npm install

## Start & Run
### Debug mode
Now, to run this application in debug mode, you need to make sure that the debug option in the configuration file is set to true.
If this is the case, the application can be started with the following command:

    npm start

> (While this project is still under development, the testing page can be used to test all the features available in this project. However, this page is only available when debug mode is enabled. You can find it by default at [http://localhost:3000/testing](http://localhost:3000/testing))

### Production mode
If, on the other hand, you want to start the application in production mode, you must make sure that the debug option in the configuration file is set to false.
If this is the case, the application can be started with the following commands:

    npm run build
    npm start

## Configuration
The following options are all configations for the application that can be set in the configuration file (config.json).

Option | Description | Type | Default
--- | --- | --- | ---
debug | Used to specify whether the application should run in debug or production mode | boolean | true
serverPort | Setting the port on which the server should run | number | 3000
serverIncludePort | Can be used to disable the port in the server address | boolean | true
serverAddress | Setting the server address | string | http[]()://localhost
sessionCookieName | Setting the name of the cookie that will be stored in the browser | string | sid
sessionCookieSecure | Can be used to send cookies only when HTTPS is used | boolean | false
sessionCookieTime | Time in milliseconds that indicates how long a session is valid | number |86400000
sessionSecret | Secret used to create the session identifiers | string | Cfg4MBM7Uv6!p!QUHACpahP5de%m*$Zs
databaseOutputPath | Path under which the database will be loaded and created if it does not exist | string | /output/database.db
filterSwearWords | Used to enable and disable filtering of swear words | boolean | false
filterFakeNews | Used to enable and disable filtering of fake news | boolean | false
userPasswordMax | Maximum length for user passwords | number | 64
userPasswordMin | Minimum length for user passwords | number | 8
userNameMax | Maximum length for user names | number | 20
userNameMin | Minimum length for user names | number | 3
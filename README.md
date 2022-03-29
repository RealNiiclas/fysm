## FYSM
---
<br>
FYSM is an open source application that allows you to run your own social media application. The application focuses on detecting fake news and hate messages and preventing the spread of such information. For this purpose, all messages sent in the application are checked by algorithms for their content and, if necessary, blocked when they are sent and saved. However, there are also classic functionalities such as writing messages in groups, sending direct messages to friends or creating posts.

<br>

## Download & Install
---
<br>

### Download
In order to download and install this application, you must first install [Git](https://git-scm.com) and [Node.js](https://nodejs.org) (which includes [npm](https://www.npmjs.com)).\
If both are installed the project can be downloaded using the following command:

    git clone https://github.com/RealNiiclas/fysm.git
    
<br>

### Install
Once the entire project has been downloaded, all required dependencies can be installed using the Node Package Manager (npm for short).\
For this, you can use the following command:

    npm install

<br>

## Start & Run
---
<br>

### Debug mode
Now, to run this application in production mode, you need to make sure that the debug option in the configuration file is set to true.\
If this is the case, the application can be started with the following command:

    npm start

<br>

### Production mode
If, on the other hand, you want to start the application in production mode, you must make sure that the debug option in the configuration file is set to false.\
If this is the case, the application can be started with the following commands:

    npm build
    npm start

<br>

## Configuration
---
<br>
The following options are all configations for the application that can be set in the configuration file (config.json).

<br>

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
userPasswordMax | Maximum length for user passwords | number | 64
userPasswordMin | Minimum length for user passwords | number | 8
userNameMax | Maximum length for user names | number | 20
userNameMin | Minimum length for user names | number | 3
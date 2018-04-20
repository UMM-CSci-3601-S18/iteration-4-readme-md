# CSCI 3601 Production Template -- Spring 2018
[![Build Status](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-readme-md.svg?branch=master)](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-readme-md)
<!-- TOC depthFrom:1 depthTo:5 withLinks:1 updateOnSave:1 orderedList:0 -->
## Table of Contents
- [Setup](#setup)
- [Running your project](#running-your-project)
- [Deploying Project for Production](#deploying-project-for-production)
- [Testing and Continuous Integration](#testing-and-continuous-integration)
- [Resources](#resources)
	- [Angular 4](#angular-4)
	- [SparkJava](#sparkjava)
	- [MongoDB](#mongodb)

<!-- /TOC -->

## Setup

As in the labs, you'll be using IntelliJ. Once you've all joined your
group using GitHub classroom, you can clone your repository using IntelliJ:

- When prompted to create a new IntelliJ project, select **yes**.
- Select **import project from existing model** and select **Gradle.**
  - Make sure **Use default Gradle wrapper** is selected.
- Click **Finish.**
- If IDEA asks you if you want to compile JavaScript to TypeScript :fire: DO NOT :fire: – if you do it will break your project.

:warning: IDEA will sometimes decide to "help" you by offering
"Compile TypeScript to JavaScript?" :bangbang: *Never* say "OK" to this
offer -- if you do it will make a complete mess of your project. We're
using other tools (`gradle`, `yarn`, and `ng`) to do that compilation. 
If you let IDEA do it, you'll
have a ton of JavaScript files cluttering up your project and confusing other
tools.

## Running your project

- The **build** task will _build_ the entire project (but not run it)
- The familiar **run** Gradle task will still run your SparkJava server.
(which is available at ``localhost:4567``)
- The **runClient** task will build and run the client side of your project (available at ``localhost:9000``)
- The **runAllTests** task will run both the Java (server) tests and the `karma` (client-side, Angular) tests
- The **runServerTests** task will run the Java (server) tests
- The **runClientTests** task will run the `karma` (client-side, Angular) tests. 
   * The **runClientTestWithCoverage** task will run the `karma` tests and generate test coverage data which will be placed in `client/coverage`; open the `index.html` in that directory in a browser and you'll get a web interface to that coverage data.
   * The **runClientTestsAndWatch** task will run the `karma` tests, but leave the testing browser open and the tests in "watch" mode. This means that any changes you make will cause the code to recompile and the tests to be re-run in the background. This can give you continuous feedback on the health of your tests.
- The **runE2ETest** task runs the E2E (end-to-end, Protractor) tests. For this to work you _must_ make sure you have your server running, and you may need to re-seed the database to make sure it's in a predictable state.
- The **seedMongoDB** task will load the "demo" data into the Mongo database. If you want/need to change what gets loaded, the `seedMongoDB` command is defined in the top level `build.gradle` and current loads two files, `todos.seed.json` and `users.seed.json`, both of which are also in the top level of the project. (They probably should be in a `data` directory to reduce clutter, so you might want to move them.) To load new/different data you should create the necessary JSON data files, and then update `build.gradle` to load those files.

**build.sh** is a script that calls upon gradle build to build the entire project which creates an executable to be able to launch the
project in production mode. To run **build.sh**, go to your project directory in a terminal and enter:``./build.sh``

When **build.sh** is run, the script **.3601_run.sh** is copied to ~/**3601.sh**. When this is launched, for example, ``./3601.sh``, will run your project in production mode. The API_URL in _environment.prod.ts_ needs to be
the actual URL of your server. If your server is deployed on a droplet or virtual machine, for example, then you want something like 
`http://192.168.0.1:4567` where you replace that IP with the IP of your droplet. If you've set up a domain name for your system, you can use that instead, like `http://acooldomainname.com`.

:exclamation: Pro-tip: IntelliJ comes with a nice view to see the mongo databases setup.
To access this click on File -> Settings -> Plugins, type Mongo and make sure the Mongo Plugin is installed.
Now head to View -> Tool Windows -> Mongo Explorer. Then use the tool icon to add configuration.
Once prompted type for Path to Mongo Shell: _"/usr/bin/mongo"_
and hit the <span style="color:green">green :heavy_plus_sign:</span>, to add your label and, huzzah!, Mongo Explorer is on your side bar.

## Deploying Project for Production 
Instructions on setting up the project for production can be found here: 
[UMM CSCI 3601 Droplet Setup Instructions](https://gist.github.com/pluck011/d968c2280cc9dc190a294eaf149b1c6e)

## Testing and Continuous Integration

Testing options are still integrated in this lab so you can test the client, or the server or both.
Testing client:
* `runAllTests` runs both the server tests and the clients tests once.
* `runClientTests` runs the client tests once.
* `runClientTestsAndWatch` runs the client tests every time that the code changes after a save.
* `runClientTestsWithCoverage` runs the client tests and deposits code coverage statistics into a new directory within `client` called `coverage`. In there you will find an `index.html`. Right click on `index.html` and select `Open in Browser` with your browser of choice. For Chrome users, you can drag and drop index.html onto chrome and it will open it.  
* `runE2ETest` runs end to end test for the client side. NOTE: Two Gradle tasks _must_ be run before you can run the e2e tests. 
The server (`run`) needs to be on for this test to work, and you have to
need to have data in the `dev` database before running the e2e tests!
* runServerTests runs the server tests.

Turn on your repo in [Travis CI][travis], replace the build status image in this README, and push your changes. That will trigger a build with Travis.

## Resources

### Angular 5

- [What are environments in Angular CLI?][environments]
- [Testing Angular with Karma/Jasmine][angular-karma-jasmine]
- [End to end testing (e2e) with protactor and Angular CLI][e2e-testing]
- [Angular CLI commands](https://github.com/angular/angular-cli/wiki)

### SparkJava
- [Spark documentation][spark-documentation]
- [HTTP Status Codes][status-codes]
- [Other Resources][lab2]

### MongoDB
- [Mongo's Java Drivers (Mongo JDBC)][mongo-jdbc]


[angular-karma-jasmine]: https://codecraft.tv/courses/angular/unit-testing/jasmine-and-karma/
[e2e-testing]: https://coryrylan.com/blog/introduction-to-e2e-testing-with-the-angular-cli-and-protractor
[environments]: http://tattoocoder.com/angular-cli-using-the-environment-option/
[spark-documentation]: http://sparkjava.com/documentation.html
[status-codes]: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[lab2]: https://github.com/UMM-CSci-3601/3601-lab2_client-server/blob/master/README.md#resources
[mongo-jdbc]: https://docs.mongodb.com/ecosystem/drivers/java/
[labtasks]: LABTASKS.md
[travis]: https://travis-ci.org/

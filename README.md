# Sunshine Journal by Team README.md
[![Build Status](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-readme-md.svg?branch=master)](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-readme-md)
# Team Members:
- Matt Munns
- Jacob Grinstead
- Blake Bellamy
- Kyle Foss
- Yukai Zang
- Isaac Yoakum
- John Schonebaum
- Yutaro Miyata

## Introduction
Our team's main goal was to develope a web application that provides clients of mental health practitioners a service 
to use when physical appointments are not available. This web app will assist in handling crisis situations as well as 
the ability for mental health practitioners to review their clients emotions since the last time they met. It is designed in a way
to be both easy for the clients to use, and the mental health practitioners to analyze. 

##Key Features
- Log in with google account
    - Securely displays your data, and no one else's.
- Log an emotion using a swiping system
    - Swipe left or right to change mood
    - Swipe up and down to change intensity of mood
- Ability to create journals
    - Journals include a prompt
    - Can edit the journals
    - Can be searched
- A Resource page
    - Has contacts
    - Has resources to handle different emotional situations
- A reports & graphs page
    - Ability to see past emotion entries both in a graph format and in text
- Ability to create goals
    - Goals can be catgorized
    - Goals can be completed
- Crisis button for emergency crisis situations

## Deploying Project for Production 
Instructions on setting up the project using a DigitalOcean droplet can be found here: 
[Droplet Setup Instructions](/DROPLETINSTRUCTIONS.MD)

## Languages Used
* **Typescript**
* **Javascript**
* **Java**

##Libraries Used
###Client
* **Angular 5**
* **Jasmine** and **Karma**
* **Gradle**
* **Angularx Social Login**
* **HammerJS**
* **Google SIgn in API**
###Server
* **Spark**
* **JUnit**
* **MongoDB**
* **Gradle**
* **Google API Client Library** for authenticating users on the server

## Resources

### Google Sign In
- [Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)

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

This project was developed as a part of a Software Design class at the University of Minnesota, Morris.

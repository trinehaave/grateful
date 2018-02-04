# Gratitude Journal App  [![Build Status](https://travis-ci.org/trinehaave/grateful.svg?branch=master)](https://travis-ci.org/trinehaave/grateful)

A [journalling app](https://stormy-scrubland-44609.herokuapp.com/landing.html) where you can register an account, log in and post journal entries about the things - large and small - that you are grateful for.  The app is ideally used at night focusing on the day that just passed - on the people you encountered and  events and things that happened that you appreciated. By consistently journalling in this way you are training your brain to have a more gratitude-focused mindset  and this is proven to make people happier and healthier.  You can decide entirely if you want to post a short list of things or go into more depth with a longer entry - the important part is to think about and write down some of the things you are grateful for.

## Screenshots
![landing page screenshot](./public/image/landing-page.png)


![journal screenshot](./public/image/screenshot.png)

## Setup


## Technologies and Libraries
### Front-End

* jQuery
* JavaScript
* HTML
* Sass/SCSS

### Back-End

* Node.js
* Express.js
* MongoDB
* Mongoose
* Mocha & Chai
* Gulp

### Version Control, Deployment and Continuous Integration

* GithHub
* Heroku
* mLab
* Travis CI

### Others

* Moment.js
* SweetAlert
* FontAwesome
* Flaticon



## RESTful API


### `/entries`  endpoint

#### GET
##### `/searchByUser/:userId`
returns all journal entries for a user

#### GET
##### `/:entryId`
returns the requested journal entry

#### POST
creates a new journal entry

#### DELETE
##### `/delete/:entryId`
deletes the requested journal entry for a user

#### DELETE
##### `/deleteAll`
deletes entries from all users/entire entry collection

#### PUT
##### `/:entryId`
updates requested entry



### `/user`  endpoint

#### GET
returns all registered users

#### GET
##### `/:username`
returns requested user

#### DELETE
##### `/:username`
deletes requested user

#### DELETE
##### `/deleteAll`
deletes all users/entire collection

#### PUT
##### `/:username`
updates requested user data



### `/auth`  endpoint

#### POST
##### `/register`
creates new user account

#### POST
##### `/login`
user authentication on login

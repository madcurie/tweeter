# Tweeter

#### Backend of Chat Room

## Developer Documentation
### Tools Used:

* [Node](https://nodejs.org/en/)
* [Express](http://expressjs.com/)
* [Mongoose](http://mongoosejs.com/)
* [MongoDB](https://www.mongodb.org/)
* [Mocha](https://mochajs.org/)
* [Chai](chaijs.com/)

### How to Install Application:
* Fork the repo
* Clone your fork locally
```
git clone https://github.com/[your github name]/tweeter.git
```
* Ensure Node is installed. If not, visit [NodeJS](https://nodejs.org/en).
* Ensure MongoDB is installed. If not, install MongoDB globally
```
brew install mongod
```
* Start a MongoDB instance 
```
mongod || sudo mongod
```
* Install server dependencies
```
npm install
```
* Run the app on a local server
```
node server/server.js
```

### How to Run the Test Suite:
* Ensure Mocha is installed. If not, install Mocha globally
```
npm install -g mocha
```
* Start mocha 
```
mocha server/spec/server-spec.js
```


### Database
The MongoDB/Mongoose database, which stores basic information about the events, was used to ensure that the application persists data across restarts. The event schema is as shown below:
```
db.eventSchema = new db.Schema ({
  date: { type: String, required: true },
  user: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String },
  otheruser: { type: String }
});

```

###File Structure
```
server
├── server.js
├── db.js
├── events.js
└── spec
     └── server-spec.js
```
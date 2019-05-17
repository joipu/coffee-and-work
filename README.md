# Coffee and Work
## Purpose
Coffee & Work is a Node.js web app project that allows users to post work-friendly coffee shops and make comments.


## D

## Features
* A landing page
* Sign-up and Login page (_Authentication with Passport_)
* A coffee shop page that lists all the spots posted by users
* Each shop has a More Info page that contains name, image, desc, and comments
* Each shop can have multiple comments added by different users


**CRUD Functions** 
(_Authorization Used_)
1. Users can create, read, update and delete shops
2. Users can create, read, update and delete comments for shops
3. There is authorization and authentication in CRUD
    - Users cannot edit or delete items if not logged in or if items do not belong to the users
    - Users cannot create items if not logged in 
    - Users can read items no matter if logged in

## Built With
### Platforms
* WebStorm 2019.1.2
* Heroku

### Front-end
* Bootstrap 3.3.5
* jQuery 3.4.1
* EJS
* Google Maps APIs

### Backend-end
* Express.js
* MongoDB, MongoDB Atlas
* Mongoose
* Passport, passport-local
* Connect-flash
* dotenv



## License
[The MIT License](LICENSE.txt)
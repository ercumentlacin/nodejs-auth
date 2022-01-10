# Node App

## Authencation

* [x] Create a todo list
* [x] Create a server
* [x] Add authentication router
* [x] Create user with POST /api/v1/auth/signup
  * [x] Validate required fields
  * [x] Validate username is unique
  * [x] Hash password with bcrypt
  * [x] Insert user into database
* [ ] Login user with POST /api/v1/auth/login
  * [x] Validate required fields
  * [x] Check if user exists
    * [x] Compare password with hashed password in database
      * [ ] Rate limit login attempts
    * [x] Create and sign JWT
      * [x] Set cookie with JWT
* [ ] Create sign up form; show errors; redirect;
  * [ ] Validate required fields

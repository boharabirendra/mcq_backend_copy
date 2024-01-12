# Backend for multiple choice system

## Admin routes

- /admin/signup: Input
- /admin/signin


## User routes

- /user/signup
    - Input: Body {username, password, class, section, gender}

- /usersignin
    - Input: Body {username, password}
    - Returns jwt token 
    
# petflex api

A little pet "social media" app backend

frontend repo: https://github.com/ShimShon1/petflex

live here: https://petflex.vercel.app/

# installation
### 1. clone this repo 
```
git clone https://github.com/ShimShon1/petflex-api.git
```
### 2. install all dependencies
```
npm install
```
### 3. provide .env variables
provide the .env variables for the app.
those are: DB_LINK, JWT_SECRET, Coudinary api details (name,key,secret)
also some optional variables like: POST_LIMIT, USER_LIMIT, GENERAL_LIMIT (all numbers) and admins (string with ids seperated by a comma)

### 4. run it!
```
npm run dev
```

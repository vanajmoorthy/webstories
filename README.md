# Webstories

Notes on running the app

- Clone this repository
- Run React app
  - npm i
  - npm run dev
- Run pocketbase instance
  - Download the [pocketbase executable](https://pocketbase.io/docs/)
  - Unzup and put the pocketbase executable inside the directory pb
  - `cd pb` and run `./pocketbase serve --origins="http://localhost:5173`
  - Note: MacOS might block pocketbase at this point, open Privacy and Security in settings and allow it to run any way
  - Pocketbase will ask you to create a super user at this point, the collections should be imported automatically from pb_data
- Create a webstories account and start editing!

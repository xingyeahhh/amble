# README
## Explanation of Folder Structure
- backend contains all of the django files, most of these can be ignored but settings.py and urls.py are important
- settings.py points to the frontend folder for the static files, its responsible for the database connection, and it contains the secret key
- urls.py contains the urls for the backend api and routes the frontend urls to the relevant views (www.webapp.com/home -> frontend/index.html)
- dist contains build files and can be completely ignored (it might not appear if hidden files are not beign shown in vscode)
- django-env contains the virtual enviroment, vscode might autodetect this and ask to create the environment
    * if it does say yes
    * if not more details below
- the html folder contains the base html file for the frontend, the node_modules folder contains all of the frontend dependencies
- react allows us to change the contents of base.html with JavaScript meaning we do not need to add html elements to base.html manually
- the public folder contains statically served files, the scripts folder contains simple python files for grabbing data and testing
- the src folder is where the magic happens, these are all of the react files (.jsx files are just .js files with a different extension)
- main.jsx renders the react app to the user -> App.jsx is the main component that contains all of the other components
- think of this like a hierarchy, main.jsx is the parent of App.jsx which is the parent of all of the other components
- the css files are used to style the components, each new feature will have its own component (and probably its own css file)
- .eslintrc.cjs and .gitattributes are configuration files which can be ignored
- anything contained in the .gitignore file will not be pushed to github
- db.sqlite3 is a database file created by django which allows the frontend to interact with the database (unsure of the details)
- manage.py is a django file which allows us to run the server and perform other tasks
- package-lock.json and package.json contain the frontend dependencies, they should update automatically as new dependencies are added
- i am the readme.md file, if Finbar has done a good job I should explain everything you need to know
- requirements.txt contains the environment dependencies, this is used to create the virtual environment (hopefully vscode does this for you)
- vite.config.js is a configuration file for vite, it can be ignored

## How to Run the Project
- open the project in vscode, the folder structure should be as described above (20-04-2023)
- at the bottom right of the screen there might be a pop-up stating that vscode has detected a virtual environment
- if this is the case click yes and vscode should create the virtual environment for you
- need to find a way to automatically install the dependencies
- (https://nodejs.org/en/download/)[Node.js] needs to be installed for the following commands to work
- if not open the terminal and type `python -m venv django-env` (this will create the virtual environment)
- then type `source django-env/bin/activate` (this will activate the virtual environment)
- (if the above command does not work it may be necessary to hard code the path to the virtual environment)
- then type `pip install -r requirements.txt` (this will install the environment dependencies)
- then type `pip install vite` (this will install the frontend build tool)
- then type `python manage.py migrate` (this will create the database)
- then type `python manage.py runserver` (this will run the server)[Django]
- open a new terminal and type `npm i --legacy-peer-deps` then `npm run dev` (this will run the frontend)[React]
- if you get an error with google-map-react, try `npm install --save google-map-react --legacy-peer-deps` or `npm install google-map-react --legacy-peer-deps`
- another npm dependancy to be installed manually: npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
- need to check --save
- the project should now be running on the django localhost (probably http://127.0.0.1:8000/)

## Resources
- Django is a backend framework, React is a frontend framework, Vite is a frontend build tool for React
- If you do nothing else in this section watch the first three videos, it's 30 minutes well spent:
- This video does a very good job of explaining Django: https://www.youtube.com/watch?v=0sMtoedWaf0
- This video does a very good job of explaining React: https://www.youtube.com/watch?v=s2skans2dP4
- This video does a very good job of explaining Vite: https://www.youtube.com/watch?v=89NJdbYTgJ8
- The following stack overflow posts explains the steps taken to create our virtual environment and can be ignored: 
* https://stackoverflow.com/questions/41427500/creating-a-virtualenv-with-preinstalled-packages-as-in-requirements-txt
* https://stackoverflow.com/questions/36446599/zsh-command-not-found-django-admin-when-starting-a-django-project
- This explains how React has been integrated with Django and can also be ignored:
* https://www.youtube.com/watch?v=9Iq-0OYkoX0
* https://vitejs.dev/guide/backend-integration.html
- I'll add more info to this section as I remember/find it
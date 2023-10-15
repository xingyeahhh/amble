# amble

### abstract
Humans are not designed to live sedentary lives in overcrowded urban environments, which is reflected in the deteriorating mental state of the species. The objective of this project is to  build an application which supports Manhattan residents seeking to improve their mental health. Despite the widespread availability of wellness, mapping and exercise applications, no solutions combine these three aspects, allowing users to build journey’s through quiet, green and safe spaces. At its core, amble is a route-generating application featuring an algorithm capable of filling this void. The application includes complimentary features such as an AI-powered chatbot offering suggestions to improve routes, a rating system feedback loop designed to improve future performance, and mental health related resources specific to your amble's. The machine learning model which predicts busyness based on forecasted weather is trained using data from Yellow Taxi, Citi Bike, and OpenWeather, together with NYPD crime statistics. The mean average error of the Yellow Taxi and Citi Bike prediction models were 0.1258 and 0.2882, respectively; this ratio determines data set weighting when calculating the busyness score. The project employed a ‘fail fast’ methodology, seeking user feedback as early as possible ultimately resulting in additional features such as heatmaps to illustrate the algorithm's effectiveness.

### Application: https://csi6220-2-vm2.ucd.ie

### Methodology
#### A.Development Process
Three sub-teams -- data, frontend, and backend -- formed the initial structure, however, these boundaries soon blurred as members closely interacted to build amble’s functionalities. Development followed the Agile Scrum methodology, emphasising autonomy, democratic decision-making, and self-organisation.  The Scrum Master facilitated Scrum Ceremonies, maintained Scrum Artefacts, organised meetings, and tracked the goals of each Sprint on the project Trello Board, an invaluable tool which helped the team manage tasks and prevent overextension of resources.

The meeting schedule consisted of Daily Scrums, which involved updates from the previous day, current plans, challenges faced, and feedback rounds for team morale. Despite clear agendas however, Daily Scrums began to stretch, sometimes by up to an hour. This was improved by scheduling separate discussion sessions as in-person meetings on Wednesdays. At the beginning of each Sprint, the Sprint Planning meetings involved identifying achievable objectives, cross-referencing these with the Product Backlog, and translating the goals into actionable tasks on the Trello Board to be selected by available team members. Ending each Sprint, a Sprint Review focused on evalutating the technical progress while a Sprint Retrospective aimed to improve the team's non-technical performance. The Scrum framework provided the team with a clear structure, fostering professionalism and commitment which proved crucial for team engagement given the significant work effort required.

#### B.Backend
The system architecture of the application is displayed in the figure 1 above (with a detailed version in Appendix E), highlighting the technologies implemented and interaction between \textit{amble's} different systems.
![image](https://github.com/xingyeahhh/amble/assets/123461462/83ad81d4-5153-4228-8835-e617e94ec9fe)

##### Server
A server and Linux virtual machine were provided by the university to host the application. Apache and NGINX were evaluated as options to handle deployment, with Apache being selected as its simplicity, handling of static content, and wide array of technical troubleshooting resources outweighed any slight performance advantage offered by NGINX. The backend security features implemented included the creation of an .env file to protect API keys and database parameters, and the installation of an SSL certificate allowing amble's domain to comply with the HTTPS protocol. JMeter was used to carry out server load testing which validated the applications ability to handle 30 requests per second, the maximum expected traffic for an application serving Manhattan.

##### Backend Framework
The primary selection criterion for backend frameworks was to ensure the language on which the framework is built was familiar to all members of the team. This narrowed the selection down to JavaScript frameworks, e.g., Node.js, and Python frameworks, e.g., Django or Flask. While JavaScript was selected as the application's primary frontend language, the reputation of its backend frameworks suffering from incompatibility issues with imported modules, and API inconsistencies excluded Node.js and others from the selection process.

Flask and Django are well established frameworks which support the backend of large scale web applications such as Uber, Reddit, Dropbox and Spotify. While Flask has a shallower learning curve than Django, and the team was already familiar with the former framework, Django was selected for the following reasons:

1. Its built-in library features are not dependant on external packages.
2. Its model-view-template architecture is better suited to amble's database needs and handling of user data.
3. Its large and active community provides good troubleshooting support.


##### Database
The team evaluated three database options: PostgreSQL, MySQL and MongoDB. As the application employs a large number of JSON files, a non-relational database such as MongoDB was considered. Its flexibility would allow for the improved creation of records as the structure of tables would not need to be redefined as data was added. In addition, MongoDB would have streamlined the process of modification of documents on which amble’s algorithm operates, however, these benefits did not outweigh the advantages of a relational database:

1. Django does not officially support NoSQL databases and, despite workarounds being available, implementing this flexibility was not time effective.
2. All team members were experienced with relational databases allowing for collaborative contributions.
3. amble's machine learning models are built on data sets better suited for relational databases.

PostgreSQL was selected over MySQL for its superior integration with Django, and richer feature selection in the creation of geographic web applications. Redix was briefly considered towards the latter stages to handle caching, however, a solution for local storage of user data was found within the frontend framework, rendering this technology redundant.

#### C.Frontend
The frontend team’s objective was to design an application that improved the user's mental health. Spending time in greenspaces has been proven to have a positive impact on mental health so themes of nature were implemented throughout the application. The frontend team focused on making amble’s interactive components feel intuitive and ensure consistent design throughout, so maximising ease of use. 

With many new technologies being introduced, development of a basic web app that allowed user inputs to flow between the frontend, backend, database and machine learning model was prioritised in the early stages of the project.  This mitigated the risk of incompatibility between these different technologies when external dependencies were introduced.

##### Frontend Framework
With the vast number of available frontend frameworks, it was not feasible for the team to seriously consider even a fraction of the available options, hence, four frameworks were shortlisted based on popularity: React, Angular, Svelte, and Vue. React is the most popular of these by a significant margin followed by Angular, Vue and Svelte. React also provides greater development flexibility as does Svelte, while Angular and Vue sacrifice this characteristic in favour of reliability. Furthermore, Svelte offers greater browser efficiency while Vue offers a shallower learning curve, both combating Angular’s advantage in popularity.

Due to limited frontend framework experience, deciding between flexibility, reliability, popularity, and efficiencies was a daunting task. However, the introduction of Vite as a build tool allowed the team to select React as the frontend framework without making significant sacrifices. Vite is highly opinionated through default configurations for React that function reliably like Angular or Vue, however, these defaults can be overridden as required. Vite also brings greater efficiency to the development process with hot module replacement, preserving the state of the application while changes are made to the frontend code. This eliminates the need to recreate conditions which are causing issues when troubleshooting, e.g., manually entering the user input for a problematic route, as Vite reflects changes made to the code in the browser without needing to refresh the page.

##### Backend Interaction
Interaction between the frontend and backend was handled with Axios HTTP requests. This promise-based package allows user input to be taken from the frontend, to be posted to the backend for processing, and to be returned appropriately. One major example of this interaction are the user's route generation preferences, which are posted to the backend, allowing \textit{amble's} algorithm to generate waypoints. These are then returned as promised information to the frontend, where it is parsed and displayed to the user. Axios offers many advantages over JavaScript’s  built-in fetch functionality such as improved security with Cross Site Request Forgery (CSRF) protection, automatic transformation of JSON data allowing improving request-response time, and wider browser support.

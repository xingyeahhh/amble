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

#### D.Stack Effectiveness and Innovations
The effectiveness of the technology stack was measured by the following criteria:

Responsiveness - The initial load time of the application and performance of its features is fast. This results from conscious decision-making throughout the project to minimise slow processes, e.g., API calls, which would negatively impact amble’s performance.
Interoperability - Due to the development of a fully integrated basic web application early on, interaction between technologies functioned as expected. However, issues arose with the application being run on different operating systems, causing incompatibility in the project's configuration files. This was resolved by reserving the main branch for deployment on the server and adding OS-specific files to the .gitignore file, ensuring commits to the repository did not affect local deployments of team members.
Security - For initial deployment, SSL certification served as adequate security. However, as Django’s security libraries offer more sophisticated solutions, further improvements could be made as future work outlined below.
Scalability - The emphasis placed on the application's responsiveness throughout the development process also benefitted its scalability with a worst case performance of O(n) for the amble algorithm, where n is the number of nodes on the map. As the information for these nodes was found on OpenStreetMap, amble could easily be made available in other cities, provided similar data sets exist to calculate busyness and crime scores.

The principal innovation of this project is \textit{amble's} routing algorithm, which was developed to create a path through Manhattan by identifying locations in the quietest and safest areas. The algorithm begins by evaluating the distance between the user's start location and all nodes on the map -- an extremely fast operation where latitude and longitude of each node are read from JSON data sourced using OpenStreetMap. The nodes are split into three categories:

1. Park nodes: Representing greenspaces within Manhattan, these are always included in the algorithms selection to align with the core functionality goals of the application.
2. Walking nodes: Constructed from QGIS to cover every 200 m$^2$ zone in Manhattan, these nodes ensure the algorithm does not route users through busy areas between parks, or fails to operate correctly in areas with node scarcity.
3. Point-of-interest nodes: Representing libraries, museums, places of worship and community centres, they can be filtered based on user preferences.

After the distance to all available nodes has been determined, the algorithm sorts and filters the available locations based on their distance from the start location. When nodes exceed the total allowable distance or are too close to meaningfully impact the journey, they are excluded. From the remaining nodes, the algorithm determines the optimal location for the next stage of the journey by calculating a weighted total from user ratings, busyness and crime scores.

After the selected park is set as the new starting location, the algorithm repeats this process, keeping a running total of the distance covered and a list of visited locations. The selection of nodes is biased towards the user's end point by further weighting its selection to favour coordinates closer to the desired destination. Special cases and error handling ensure the robustness of the algorithm for a wide variety of routes; should the user select the same start and end location or attempt to create an impossible route, the algorithm will identify this behaviour and respond accordingly.

Further innovation is demonstrated with various elements incorporating AI interaction in the application, as the team felt this functionality aligned well with project objectives. The chatbot feature, the 'amble assistant', appears in the route presentation page. It can recommend quiet cafes and restaurants along the route generated by the algorithm, which are made through the open-source Python 'populartimes' module, as well as request prompts from OpenAI. The ‘Learn Something interesting’ element within the ‘For You’ page was designed to provide positive mental health resources for the user. When a menu option is selected, it calls OpenAI’s API with the prompt and specific route data (node locations, date, distance of route) as inputs, allowing OpenAI to respond with additional information on predefined topics vetted by the team.

### Data Analytics and Visualisation

This project utilised Yellow Taxi trip data, Citi Bike system data, NYPD complaint data, and historical weather data. These data sets were stored in a PostgreSQL database and manipulated using pgAdmin 4 and Python.

To obtain node busyness scores for the web application, taxi data from 2017, 2019 and 2022 and for Citi Bike data from 2022 were used. These data sets were obtained from NYC Open Data and approximately 230 million rows were relevant to Manhattan. Data from 2020 and 2021 were not used due to the significant effect of the COVID-19 pandemic on these years, while the 2018 taxi data was excluded due to a unique file corruption problem.

Using XGBoost regression, separate predictive models were trained using the taxi and Citi Bike data. Hourly historical weather data, obtained from the Weather Underground website using a Python web scraper, was incorporated into both models. This weather data came from La Guardia Airport Weather Station, which is managed by the National Oceanic and Atmospheric Administration (NOAA).

#### A.Data Preparation
##### Weather
Weather data was presented on the WUnderground website as an hourly table for each day. The data from each table was scraped and saved to separate CSV files, so that any errors only affected data for one day and could easily be detected and corrected. The files for each year were merged and loaded into a Pandas DataFrame for cleaning. A Unix timestamp column was created using the date and time columns. The Python module \textit{'pytz'} was utilised for timezone calculations, and the timestamp column values were then rounded to the nearest hour.

Rows containing errors or missing values were removed. The only notable problem arose due to the presence of entries of particular dates after midnight, which, belonged to the following day. These were removed by iterating through the rows and removing any  timestamp value lower than its previous row. The final cleaned weather data set covered the years 2017 to 2022 and contained 62,338 rows.

##### Taxi
Each year of taxi data was cleaned and prepared individually, and they were merged following this preparation. SQL queries and commands were used in the pgAdmin 4 platform, which allowed for efficient reading and writing of data.

Firstly, all columns not relevant to the goal of the project were dropped, which were mainly columns on taxes and other charges. Secondly, rows, where neither pick-up nor drop-off locations were within Manhattan, were dropped. Thirdly, pick-up and drop-off Unix timestamp columns were added to the remaining rows, populated with values extracted from the datetime columns. These values were also rounded to the nearest hour, and rows with timestamps occurring outside of the year under consideration were removed. Additionally, rows containing null values or errors, such as the drop off time occurring before the pick up time, were removed. 

A busyness column was added and populated for each row based on the row's start time and location. This was done using the sum of passenger counts from all rows whose times and locations matched those of the current row. An index was created from the combination of start location and timestamp before running the command to populate the busyness column, greatly increasing the command's efficiency. All columns were then dropped except for the start timestamp, start location and busyness. Rows corresponding to the same start location and time were identical to each other, and all duplicates were removed. This process reduced the number of rows from over 100 million in certain years to a maximum of 569,400 (65 Manhattan taxi zones x 24 hours x 365 days). 

##### Citi Bike
Similar data preparation was carried out for Citi Bike's 2022 data. Before model training, bike stations were aggregated based on the taxi zone they are located in. As there are 630 bike stations in Manhattan, without aggregation this would have resulted in a DataFrame too large for model training if station names had been converted to dummy variable columns. The measure of busyness for Citi Bike was based on trip count rather than passenger count.

The cleaned taxi and Citi Bike data were then combined with the cleaned weather data on their timestamp columns, with the taxi/Citi Bike data set as the target table and the weather data set as the source table. This merged data set was then loaded into a Pandas DataFrame and further manipulated before being used to train the predictive models.

![image](https://github.com/xingyeahhh/amble/assets/123461462/2840bca1-2ad7-4e33-8769-b9cd30244cb8)

##### Crime
Utilising the NYPD Complaint Data, crime scores for precincts and grid zones were created after a cleaning process that reduced 8.35 million rows to 638,810. These scores consist of a summation of crime reports for each zone, adjusted with a severity indicator (increasing values for ‘Violation’, ‘Misdemeanour’, and ‘Felony’) to create ‘total crime scores’.  The scores were then normalised and the higher of precinct and grid zone score was assigned to the location’s crime score.

#### B.Machine Learning Models
For both the taxi and Citi Bike data, three different types of models were trained and compared: linear regression, XGBoost, and random forest regression. 

Extensive analysis was performed to find the optimal features to include, and for taxi data, the optimal model was found to be XGBoost regressor that included weather. Table. I shows the mean absolute error (MAE), and coefficient of determination (R$^2$) for each type of model, obtained using the test data. It also includes comparisons of the same model type with weather excluded. It is important to note that busyness values were normalised using min-max normalisation to be able to compare and combine taxi and Citi Bike model scores. Outliers were accounted for in this calculation, all values within three standard deviations from the mean fall within the range 0 to 1.

![image](https://github.com/xingyeahhh/amble/assets/123461462/666d318b-d30c-4ee2-9c62-a42d9d9c3e54)

In addition to feature analysis, hyperparameter tuning and 10-fold cross-validation were performed. The optimal hyperparameters were determined as a learning rate of 0.2, max depth of 7, and 150 estimators. The MAE and R^2 values for the test set were 0.1258 and 0.9324, respectively. This strong performance on unseen data indicates a low level of overfitting on the test data. The mean MAE and R$^2$ values obtained from 10-fold cross-validation were 0.1314 and 0.9398, respectively. A histogram of residuals, the differences in actual versus predicted values obtained by using the model for taxi busyness on the test data, shows that the majority of the data is clustered around the mean of -0.0008. The data is also spread relatively uniformly on both sides of the mean, demonstrating that the predictions are not significantly positively or negatively biased  (see Appendix E).

For Citi Bike data, an XGBoost model was also found to produce the best results, with the best performing model also incorporating weather data. Table. II shows the MAE and R$^2$ values for linear regression, random forest regression and XGBoost models tested, including the XGBoost model that did not incorporate weather.

Extensive feature analysis was also carried out on the Citi Bike model and it found that the input features were the same as those of the taxi model. Hyperparameter tuning and 10-fold cross-validation were performed, with the optimal hyperparameters determined as a learning rate of 0.2, a max depth of 7, and 150 estimators. The MAE and R$^2$ values obtained from using the Citi Bike model on the train set were 0.2882 and 0.6708, respectively. The values obtained from using the model on the test set were 0.2973 and 0.6448, respectively. These small differences in the evaluation metrics indicate a very low level of overfitting on the training data. The mean MAE and R$^2$ values obtained from 10-fold cross-validation were 0.2939 and 0.6501, respectively. The histogram of the residuals obtained by using the model for Citi Bike busyness on the test set once again shows that data is clustered around the mean of almost exactly zero (-0.0006), with an evenly distribution to each side of the mean (see Appendix F).

The combined busyness scores were calculated from taxi and Citi Bike models. The predictions from the taxi model are giving a higher weight in this calculation based on the difference in MAE between the two models. The seasonal trends of the taxi and Citi Bike data differ from each other (see Fig. 2), therefore, combining them results in a more robust and comprehensive busyness score. Once the combined busyness score is obtained, it is used together with crime scores within the app's routing algorithm to identify optimal routing nodes.

![image](https://github.com/xingyeahhh/amble/assets/123461462/61a386c5-711c-4a08-ab72-271f34284a1a)
![image](https://github.com/xingyeahhh/amble/assets/123461462/3e01d2e9-54e6-4cd7-b838-e5b18e269615)






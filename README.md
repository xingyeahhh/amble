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


# amble
### ABSTRACT
Humans are not designed to live sedentary lives in overcrowded urban environments, which
is reflected in the deteriorating mental state of the species. The objective of this project is to build
an application which supports Manhattan residents seeking to improve their mental health. Despite the
widespread availability of wellness, mapping and exercise applications, no solutions combine these three
aspects, allowing users to build journey’s through quiet, green and safe spaces. At its core, amble is a
route-generating application featuring an algorithm capable of filling this void. The application includes
complimentary features such as an AI-powered chatbot offering suggestions to improve routes, a rating
system feedback loop designed to improve future performance, and mental health related resources specific
to your amble’s. The machine learning model which predicts busyness based on forecasted weather is trained
using data from Yellow Taxi, Citi Bike, and OpenWeather, together with NYPD crime statistics. The mean
average error of the Yellow Taxi and Citi Bike prediction models were 0.1258 and 0.2882, respectively; this
ratio determines data set weighting when calculating the busyness score. The project employed a ‘fail fast’
methodology, seeking user feedback as early as possible ultimately resulting in additional features such as
heatmaps to illustrate the algorithm’s effectiveness.
Application: https://csi6220-2-vm2.ucd.ie

### I. INTRODUCTION
amble – The Peaceful Way: The objective of this project
was to build an application that improves the physical and
mental health of users in Manhattan, New York City. Nearly
3 million adults in New York have a mental health condition,
with 36% of adults affected by anxiety or depression [1].
The importance of nature for mental health well-being has
been widely documented, with Kobylarczyk emphasising the
significant role of urban greenspaces [2], and Bakolis et
al. showing that natural features (e.g., trees and parks) can
counteract the negative mental health effects of cityscapes
[3]. By encouraging users to walk for mental and physical
health, amble supports the UN’s Sustainable Development
Goal 3, Good Health and Well-Being.
Rather than limiting busyness to physical mobility, amble expands this concept by integrating transport data (taxi
journeys and bike rentals), weather forecasts, information on
local amenities, and crime reports. This creates a broadened
understanding of busyness encompassing tangible issues like
traffic noise, overcrowding, and safety concerns, as well
as intangible stressors accompanying fast-paced urban life.
amble supports Manhattan residents as the target user in
making lifestyle changes, guiding them away from busyness – towards calming, nature-infused greenspaces, towards
’quietness’.
Users specify their walking time, duration, and starting
point and amble identifies the quietest route for them. In
addition to the walking path feature, amble is equipped with
heatmaps, directions, an AI-powered chatbot, a user rating
system and a resources page for enhanced user engagement.
Through extensive market research, a noticeable gap emerged
for an app combining such informative features, user-friendly
design, and motivational messages supporting users in their
journey towards better health. amble’s central functionality
is the innovative routing algorithm, which uses two machine
learning models to assign busyness to location nodes and, in
conjunction with crime scores evaluate potential waypoints
along the route. This system was use-tested by 22 participants
and achieved a predominantly positive approval of 80%.
Alleviating mental health problems through exercise and
mindfulness, amble provides an innovative solution to the
negative effects of busyness, which will be further contextualised within the following literature review.
### II. LITERATURE REVIEW
While developing the idea of amble, the team examined
available research around three main areas: the connection
between walking in quiet areas and positive mental health;
the definition of busyness and its relation to quietness; and
application design supporting better mental health.
A. WALKING AND MENTAL HEALTH
The Greek physician, Hippocrates, is famously ascribed to
have said: ‘Walking is man’s best medicine’. According to
Bakolis et al., regular contact with nature is linked to im
proved mental health. This is why amble was designed to be
simple, engaging, and to encourage regular usage.
Furthermore, Kobylarczyk outlines four areas of urban
life supporting health: service programs (like community
centres), passive and active recreation opportunities (like
observing art or engaging in sports), meeting sites, and places
of identification (like places of worship). This guided the selection of amble’s waypoints and amble’s primary park focus
to engage the user directly with greenspaces. Laurier et al.
emphasise the need for a clear purpose in walking activities
to engage an application’s user [4]. Thus, amble offers Ato-B routing for destination-oriented walks and a circular
feature for activity-focused walking. These features enhance
the user’s walking experience through various physical activities, while also facilitating social connectivity through locations identified by Kobylarczyk. This approach maximises
the user’s time by offering several mental health benefits.
Indeed, Tu et al. demonstrate how social integration and
gamification in apps for physical activity promote long-term
engagement and improved results [5]. While the project’s
time frame does not allow for the inclusion of a befriending
feature between users, amble recognises how social bonds
can decrease isolation through its node selection.

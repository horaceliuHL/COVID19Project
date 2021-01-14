<p align = "center">
  <img src = "https://user-images.githubusercontent.com/65971326/104558514-ea948700-5610-11eb-8d2c-5451e057e1b6.png" width = "700" height = "350" >
</p>

# COVID19Project

The COVID-19 Live Dashboard is a live worldwide processing software for COVID-19 which pulls from accurate APIs. The program configures high-level data into various visualizations that categorize the epidemic. Visitors can easily differentiate between the recovery rate and confirmed cases within countries, as well as derive regression data from each day's highest cases for the top 3 countries. In addition, maps and donut charts are presented for a colorful, yet clear visual representation of the current state the pandemic is in accross the world, with the top death rates per country and the top confirmed cases per country shown clearly on the dashboard.

Take a Look: www.covidlivedash.tech

# How it was Built/Tools Used

We were able to use a variety of front-end frameworks to build this visualization software, including but not limited to: HTML, CSS, Javascript, Node.js, Bootstrap, etc. By importing Apache Echarts through a front-end Node.js module, we were able to generate beautifully presented charts and graphs, as well as scatter plots which update in real time as the map view is changed. We also used the most updated data imported from an API (an amalgamation of different datasets including John Hopkins) for accuracy.

# What's Next

To further progress with this website, we can implement a drill-down data processing system which configures the data within the USA for each county and state. On top of that, the map would allow users to search for specific restaurants, parks, public spaces, and buildings for which you will be able to see the current daily cases around that area. This can be started with the Counties.csv file, as well as the commented out code in the app.js file, however, it is not yet completed or available.

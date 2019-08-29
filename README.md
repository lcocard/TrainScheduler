# TrainScheduler

### Overview

This is a train schedule application that incorporates Firebase to host arrival and departure data. The app will retrieve and manipulate this information with Moment.js. This website will provide up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.

---

### Setup

- Using Firebase to store data, GitHub to backup your project, and GitHub Pages to host the finished site.

### Instructions

### App basic spec:

- When adding trains, administrators should be able to submit the following:

  - Train Name

  - Destination

  - First Train Time -- in military time

  - Frequency -- in minutes

- Code this app to calculate when the next train will arrive; this should be relative to the current time.

- Users from many different machines are able to view same train times.

- Updating the "minutes to arrival" and "next train time" text once every minute.

- `Update` and `Remove` buttons for each train. The user can edit the row's elements -- train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).

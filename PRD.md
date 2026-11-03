# Product Requirements Document

## Product Name

Weather Outfit Planner

## Product Summary

Weather Outfit Planner helps a user decide exactly what to wear based on the weather at a specific destination, date, time, and occasion.

Instead of only showing weather data, the tool uses the forecast to work out a complete outfit.

The user receives recommendations for:

- Top
- Bottom
- Mid layer
- Outer layer
- Shoes
- Accessories

The recommendation changes according to the local weather conditions and the selected occasion.

---

## Target User

The tool is for someone who is preparing to go somewhere and wants a quick answer to:

**“What should I wear there at that time?”**

Possible situations include:

- an interview
- going to class
- a casual outing
- an outdoor activity

---

## Main User Goal

The user should be able to enter where they are going and when they will be there, then receive a specific outfit recommendation based on the local forecast.

---

## User Inputs

The user chooses:

1. **City or area**
2. **Date**
3. **Time**
4. **Occasion**

Available occasions:

- Interview
- Class
- Casual
- Outdoor

The user can make the location more specific by entering a state, region, or country.

Example:

`Boston, MA`

---

## API

The project uses the **Open-Meteo API**.

Documentation:

https://open-meteo.com/en/docs

The project first uses Open-Meteo's geocoding API to find the selected location.

The geocoding response provides information such as:

- city name
- state or region
- country
- latitude
- longitude
- timezone

The latitude and longitude are then used to request the weather forecast.

---

## Weather Data Used

The application uses these hourly forecast fields:

- `temperature_2m`
- `apparent_temperature`
- `relative_humidity_2m`
- `precipitation_probability`
- `snowfall`
- `weather_code`
- `wind_speed_10m`

The application uses `timezone=auto` so that the selected time is interpreted using the destination's local timezone.

---

## Main User Flow

1. User enters a city or area.
2. User selects a date.
3. User selects a time.
4. User selects an occasion.
5. User clicks **Prepare Brief**.
6. JavaScript validates the inputs.
7. The application fetches the location from the Open-Meteo geocoding API.
8. The application gets the latitude and longitude.
9. A second API request fetches the hourly weather forecast.
10. JavaScript finds the forecast hour closest to the user's selected time.
11. The application evaluates the local weather conditions.
12. The application combines the weather with the selected occasion.
13. A complete outfit recommendation is displayed.

---

## Worked-Out Output

The application does more than display raw API data.

JavaScript uses the forecast to calculate an outfit recommendation.

The recommendation considers:

- feels-like temperature
- humidity
- precipitation chance
- snow
- wind
- weather condition
- selected occasion

The result includes:

### Top

A specific shirt, T-shirt, sweater, performance shirt, or other top.

### Bottom

Specific trousers, jeans, chinos, shorts, hiking pants, or another appropriate bottom.

### Mid Layer

For example:

- blazer
- sweater
- fleece
- overshirt
- no mid layer

### Outer Layer

For example:

- wool coat
- trench coat
- rain jacket
- parka
- windbreaker
- waterproof shell

### Shoes

For example:

- leather loafers
- dress shoes
- sneakers
- boots
- waterproof hiking shoes

### Accessories

The application may recommend:

- umbrella
- sunglasses
- gloves
- scarf
- water bottle
- warm socks

---

## Occasion Logic

### Interview

The recommendation should remain professional while adapting to the weather.

Example:

- Oxford shirt
- tailored trousers
- blazer
- trench coat
- leather shoes

### Class

The recommendation should prioritize comfort and practical layering.

Example:

- T-shirt
- jeans
- overshirt
- light jacket
- sneakers

### Casual

The recommendation should feel relaxed but still coordinated.

Example:

- linen shirt
- chinos
- lightweight jacket
- sneakers

### Outdoor

The recommendation should prioritize weather protection and comfort.

Example:

- performance shirt
- hiking pants
- fleece
- waterproof shell
- trail shoes

---

## Weather Adjustments

### Hot Weather

Use:

- lightweight fabrics
- breathable clothing
- fewer layers

The app may recommend a water bottle.

### High Humidity

Use lighter and more breathable fabrics.

### Cold Weather

Add warmer layers such as:

- sweaters
- coats
- scarves
- gloves

### Rain

Add:

- water-resistant outerwear
- appropriate shoes
- umbrella when useful

### Snow

Use:

- insulated outerwear
- waterproof footwear
- warm socks
- gloves

### Strong Wind

Use a wind-resistant outer layer.

---

# Application States

## 1. Empty State

Shown before the user prepares a weather brief.

The page tells the user to enter:

- location
- date
- time
- occasion

No weather information is shown yet.

---

## 2. Loading State

Shown after the user clicks **Prepare Brief** while the API requests are running.

Example message:

**Preparing your outfit...**

The page explains that it is checking the local forecast and working out what to wear.

---

## 3. Invalid Input State

Shown when required information is missing or invalid.

Examples:

- missing city
- missing date
- missing time
- missing occasion
- date outside the available forecast range

The user receives a clear message explaining what must be corrected.

---

## 4. No Results State

Shown when the geocoding API cannot find the entered location.

The page suggests adding a state, region, or country.

Example:

`Boston, MA`

---

## 5. Error State

Shown when an API request fails or forecast data cannot be loaded.

The page tells the user to check their connection or selected date.

Every fetch request must:

- use `try/catch`
- check `response.ok`

---

## 6. In Use State

Shown after the data loads successfully.

The page displays:

- matched city
- state or region
- country
- selected date
- selected time
- occasion
- weather condition
- temperature
- feels-like temperature
- humidity
- precipitation chance
- wind
- snow
- exact outfit
- explanation of why that outfit fits the local conditions
- items to bring before leaving

---

# Design Requirements

The final interface should feel playful, colorful, and slightly editorial.

The design uses:

- warm cream background
- pastel pink
- soft blue
- yellow
- green
- rounded cards
- pill-shaped labels
- playful offset shadows
- serif display typography
- simple sans-serif interface text

The design should remain readable and usable even though it has a more fun personality.

---

# Technical Requirements

The project must use:

- HTML
- CSS
- JavaScript

No frameworks or external JavaScript libraries are required.

Weather data must be fetched using JavaScript.

The application must use:

- `fetch()`
- `async`
- `await`
- `try/catch`
- `response.ok`
- `.json()`

The API key must not be stored in the repository.

Open-Meteo does not require an API key for this project.

---

# Responsive Requirements

The application should work on:

- desktop
- tablet
- mobile

On smaller screens:

- the form fields stack vertically
- the weather and recommendation panels stack
- outfit rows remain readable
- buttons become easier to tap
- text remains within the screen width

---

# Accessibility

The application should:

- use semantic HTML
- use labels for all form controls
- provide readable contrast
- provide clear form errors
- use `aria-live` for changing result and error messages
- remain usable by keyboard

---

# Success Criteria

The project is successful if a user can:

1. enter a destination
2. choose a date and time
3. choose an occasion
4. receive weather data for that destination
5. receive a specific outfit rather than raw weather data
6. understand why that outfit was recommended
7. use the application on both desktop and mobile

The core value of the project is:

**The forecast is the data. The outfit is the answer.**

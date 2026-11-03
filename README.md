# Weather Outfit Planner

Weather Outfit Planner helps a user decide **exactly what to wear** for a specific destination, date, time, and occasion.

Instead of acting like a normal weather dashboard, the project uses local forecast data to work out a complete outfit.

The main idea is:

> **The weather is the evidence. The outfit is the answer.**

---

## Live Site

https://ashmohaghegh05.github.io/weather-outfit-planner/

## GitHub Repository

https://github.com/ashmohaghegh05/weather-outfit-planner

---

# What the Tool Does

The user chooses:

- city or area
- date
- time
- occasion

Available occasions are:

- Interview
- Class
- Casual
- Outdoor

The application then:

1. finds the selected location
2. gets its latitude and longitude
3. fetches the local hourly weather forecast
4. finds the forecast closest to the selected time
5. evaluates the local conditions
6. creates a specific outfit recommendation

---

# Exact Outfit Recommendation

The final result gives the user a complete outfit instead of generic advice.

It recommends:

- Top
- Bottom
- Mid Layer
- Outer Layer
- Shoes
- Accessories

For example, instead of saying:

`Wear something warm.`

the application can recommend:

- Light-blue Oxford shirt
- Charcoal tailored trousers
- Navy merino sweater
- Dark wool overcoat
- Black leather shoes
- Warm scarf and gloves

---

# Local Weather Conditions

The recommendation is based on weather for the selected destination and time.

The application considers:

- temperature
- feels-like temperature
- humidity
- precipitation probability
- snowfall
- wind speed
- weather condition

The recommendation changes when conditions change.

For example:

- high humidity causes the app to choose more breathable materials
- rain can add a trench coat, rain jacket, umbrella, or water-resistant shoes
- snow can add waterproof footwear and insulated layers
- strong wind can add a wind-resistant outer layer
- hot weather reduces layers and may add water and sunglasses
- cold weather can add gloves, scarves, and warmer coats

---

# Area-Specific Results

The user can enter a city or make the location more specific.

Examples:

`Boston, MA`

`Karachi, Pakistan`

The result displays the matched:

- city
- region or state
- country

The weather recommendation is based on forecast data for that location rather than a general assumption about the city.

---

# Occasion-Based Recommendations

## Interview

The outfit remains professional while adapting to weather conditions.

Possible pieces include:

- Oxford shirts
- tailored trousers
- blazers
- trench coats
- wool coats
- leather loafers
- derby shoes

## Class

The recommendation focuses on comfort and practical layering.

Possible pieces include:

- T-shirts
- jeans
- chinos
- overshirts
- sweaters
- bomber jackets
- sneakers

## Casual

The recommendation is relaxed but coordinated.

Possible pieces include:

- linen shirts
- T-shirts
- chinos
- jeans
- lightweight jackets
- sneakers

## Outdoor

The recommendation focuses more on weather protection and movement.

Possible pieces include:

- performance shirts
- thermal layers
- fleece
- hiking trousers
- waterproof shells
- trail shoes
- hiking boots

---

# API

This project uses **Open-Meteo**.

Documentation:

https://open-meteo.com/en/docs

The project uses two API requests.

## Geocoding

The first request converts the user's location into information including:

- location name
- state or region
- country
- latitude
- longitude

## Weather Forecast

The second request uses the latitude and longitude to retrieve hourly weather data.

The application uses:

- `temperature_2m`
- `apparent_temperature`
- `relative_humidity_2m`
- `precipitation_probability`
- `snowfall`
- `weather_code`
- `wind_speed_10m`

The forecast uses the destination's local timezone.

---

# How to Use the Tool

1. Open the live site.
2. Enter a city or area.
3. Select a date.
4. Select a time.
5. Select an occasion.
6. Click **Prepare Brief**.
7. Read the exact outfit recommendation.
8. Check the local weather conditions.
9. Review the **Before You Leave** section for useful accessories.

---

# Application States

The project includes the following states:

## Empty

Shown before the user has prepared a brief.

## Loading

Shown while the location and weather data are being fetched.

## Invalid Input

Shown when a required field is missing or the selected date is outside the available range.

## No Results

Shown when the location cannot be found.

## Error

Shown when the weather request fails.

## In Use

Shows the complete outfit, local conditions, explanation, and accessories.

---

# Design

The final interface uses a playful editorial style.

The design includes:

- warm cream background
- pastel pink
- soft blue
- yellow
- green
- purple accents
- rounded cards
- sticker-style labels
- offset shadows
- serif display typography
- simple sans-serif interface text

The result is meant to feel like a small personal fashion and weather brief rather than a normal weather application.

---

# Design Process

I created three trial design directions before choosing the main direction.

## Option A

Editorial Weather Brief

This version was very clean and editorial, but felt slightly too serious.

## Option B

Weather Command Desk

This version had a darker operational/dashboard appearance.

It made the weather information strong, but the project started to feel more like a traditional weather tool.

## Option C

Forecast Passport

This direction made the outfit recommendation more important than the raw forecast.

I selected Option C as the base direction.

The final interface later evolved further into a more colorful, playful version while keeping the Forecast Passport idea and recommendation-first hierarchy.

---

# How the Final Version Changed From the Original Plan

The original proposal focused mainly on:

- city
- forecast
- clothing recommendation

As I built and tested the project, I expanded the tool to include:

- specific date
- specific time
- occasion
- destination local time
- hourly weather
- humidity
- snowfall
- more detailed rain and wind logic
- exact outfit pieces
- city/state/country display
- a playful final visual design

The original proposal remains in the repository to show where the project started.

---

# Technology

The project uses:

- HTML
- CSS
- JavaScript
- Open-Meteo API

It does not use:

- frameworks
- external JavaScript libraries
- an API key

---

# JavaScript Concepts Used

The project uses concepts covered in class, including:

- variables
- arrays
- objects
- conditional statements
- functions
- DOM manipulation
- event listeners
- `fetch()`
- `async`
- `await`
- `try/catch`
- `response.ok`
- `.json()`

---

# Main API Flow

The main program flow is:

`User Input`

↓

`Submit Event`

↓

`Validate Input`

↓

`Fetch Location`

↓

`Get Latitude + Longitude`

↓

`Fetch Hourly Forecast`

↓

`Find Selected Forecast Hour`

↓

`Evaluate Weather + Occasion`

↓

`Build Exact Outfit`

↓

`Render Result`

---

# Project Files

The main files include:

- `index.html`
- `style.css`
- `script.js`
- `PROPOSAL.md`
- `PRD.md`
- `DESIGN.md`
- `AGENTS.md`
- `README.md`
- `option-c.html`

---

# AI Reflection

## One AI output I did not accept as-is

One AI output I did not accept as-is was the first design direction.

The generated design options helped me compare different approaches, but I did not simply keep the first suggestion.

I compared the three trial pages and chose **Option C: Forecast Passport** because it made the recommendation more important than the raw weather data.

I later changed the design again because the initial Forecast Passport version felt too formal for the final project.

I changed:

- the color palette
- card shapes
- button styling
- labels
- shadows
- outfit presentation
- overall personality

The final version uses a more playful and colorful interface while keeping the useful structure from Option C.

I knew these changes were better because the purpose of the tool is not just to read weather numbers. The user should be able to quickly see **what to wear and why**.

### Commit showing this design decision

**Replace the link below with the actual GitHub URL for your `Create option-c.html` commit before submission:**

`PASTE-OPTION-C-COMMIT-URL-HERE`

---

# What I Learned

This project helped me understand how an application can use API data to answer a practical question instead of only displaying the data.

I also practiced using two API requests together:

1. one request to find a location
2. another request to get weather for that location

The most important part was turning the forecast into a useful decision.

Instead of stopping at:

**“It will be 48°F.”**

the application answers:

**“What exactly should I wear?”**

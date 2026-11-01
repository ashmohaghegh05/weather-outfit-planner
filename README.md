# Weather Outfit Planner

**Who opens this and what they need in the first five seconds:**  
I open this tool when I want to know what the weather actually means for my day — not just the temperature, but what I should wear and what I should bring before I leave.

## What This Tool Does

Weather Outfit Planner turns a city forecast into a practical clothing and preparation recommendation.

Instead of only showing raw weather data, the tool uses the forecast to answer questions such as:

- Do I need a coat or just a light jacket?
- Should I bring an umbrella?
- Will strong wind make it feel colder?
- Is the weather warm enough for lighter clothing?
- Is there anything important I should bring before leaving?

The goal is to turn weather data into a decision that can be understood in a few seconds.

## Live Website

[Open Weather Outfit Planner](https://ashmohaghegh05.github.io/weather-outfit-planner/)

## Project Repository

[View the GitHub Repository](https://github.com/ashmohaghegh05/weather-outfit-planner)

## How to Use It

### 1. Enter a City

Type the name of a city into the search field.

For example:

```text
Boston
```

### 2. Prepare the Weather Brief

Click **Prepare Brief**.

The page first looks up the location and then requests the weather forecast for that city's coordinates.

### 3. Read the Recommendation

The tool uses the forecast to work out a recommendation for:

- What to wear
- Whether a jacket or coat is needed
- Whether to bring an umbrella
- Whether wind or rain should affect preparation
- What additional items may be useful before leaving

### 4. Review the Forecast Details

The recommendation is supported by weather information such as:

- Forecast high
- Forecast low
- Apparent temperature
- Rain probability
- Wind speed
- Weather conditions

You can search another city at any time without reloading the page.

---

# The API

This project uses **Open-Meteo**.

Open-Meteo documentation:

https://open-meteo.com/en/docs

The project uses two parts of Open-Meteo.

## Geocoding API

The first request converts the city entered by the user into geographic coordinates.

Useful fields include:

- `name`
- `latitude`
- `longitude`
- `country`
- `timezone`

The latitude and longitude are then used in the second request.

## Forecast API

The second request gets weather data for those coordinates.

The project uses forecast information such as:

- `temperature_2m_max`
- `temperature_2m_min`
- `apparent_temperature_max`
- `apparent_temperature_min`
- `precipitation_probability_max`
- `weather_code`
- `wind_speed_10m_max`

Open-Meteo does not require an API key for this project.

---

# What the Page Works Out

The important part of the project is not simply displaying API data.

JavaScript reads the forecast and turns it into a recommendation.

For example:

- Very cold weather can produce a warm-coat and layering recommendation.
- Cool weather can produce a light-jacket recommendation.
- Hot weather can produce a lighter-clothing recommendation.
- High rain probability can add an umbrella recommendation.
- Strong wind can add an outer-layer recommendation.
- Apparent temperature can be used when the weather feels meaningfully different from the actual temperature.

The result explains the main reason behind the recommendation so the user can understand how the weather affected the answer.

---

# Main Project Flow

The basic flow of the application is:

```text
User enters a city
        ↓
Validate the input
        ↓
Fetch matching location
        ↓
Read latitude + longitude
        ↓
Fetch weather forecast
        ↓
Read forecast data
        ↓
Apply recommendation rules
        ↓
Render the weather brief
```

This means the project uses one API response to create the request for the next API.

---

# Application States

The interface intentionally handles the different states required for Mini Project 3.

## Empty

Before the user searches:

**Enter a city to prepare your weather brief.**

No fake weather information is displayed.

## Loading

While the API requests are running:

**Checking the forecast...**

The page remains usable instead of appearing frozen.

## Invalid Input

If the city field is empty:

**Enter a city before searching.**

No API request is sent.

## No Results

If the city cannot be found:

**No matching city was found. Try a different search.**

The forecast request is not made without valid coordinates.

## Error

If an API request fails:

**The forecast could not be loaded. Please try again.**

The user can search again without reloading the page.

## In Use

When both requests succeed, the page displays:

- City and country
- Weather description
- Outfit recommendation
- Explanation
- Forecast high and low
- Apparent temperature
- Rain probability
- Wind speed
- What to bring

---

# Design Direction

Before building the final interface, I created and compared three visual directions.

## Option A — Editorial Weather Brief

A light editorial interface with oversized forecast information and a simple newspaper-like structure.

## Option B — Weather Command Desk

A dark operational interface designed to feel like a weather decision console.

## Option C — Forecast Passport / Travel Brief

A warm editorial interface inspired by travel documents and personal briefing sheets.

I selected **Option C — Forecast Passport / Travel Brief**.

The final design makes the recommendation the most important part of the page while keeping the weather numbers available as supporting evidence.

The main design principle is:

> **The weather data supports the decision. The recommendation is the answer.**

The interface uses:

- Warm paper-colored background
- Editorial typography
- Navy and blue accents
- Strong borders and rules
- A two-column recommendation and forecast layout
- Minimal decoration
- No shadows or gradients
- Responsive single-column mobile layout

---

# Where the Final Result Differed From What I Expected

I originally expected the project to look more like a normal weather dashboard with weather values as the main focus.

After comparing the three design directions, I changed the hierarchy.

The final direction treats the weather information as supporting evidence and makes the clothing recommendation the main answer.

This made more sense for the purpose of the tool because the user is not opening it only to see the temperature. The user is opening it to decide what to wear and what to bring.

---

# AI Output I Did Not Accept As-Is

## Required Question

### Pick one piece of AI output you did not accept as-is. What did it give you, what did you change, and how did you know it needed changing?

AI generated three different visual directions for the Weather Outfit Planner.

I did not accept the first design automatically.

Option A was clean and editorial, but it still felt close to a traditional forecast page.

Option B was visually distinctive, but its dark command-center style made the tool feel more technical and operational than I wanted.

I selected Option C, **Forecast Passport / Travel Brief**, because it made the recommendation feel like the main result while the raw weather information remained available as supporting evidence.

I knew the earlier directions needed changing because the purpose of this project is not simply to display weather data. It is to help the user make a decision from that data.

After choosing Option C, I removed Options A and B and used Option C as the foundation for `DESIGN.md` and the final interface.

### Commit

**Replace this line with the real Option C commit URL before final submission:**

```text
https://github.com/ashmohaghegh05/weather-outfit-planner/commit/PASTE-COMMIT-HASH-HERE
```

---

# Error Handling

Every API request is designed to use:

- `fetch()`
- `async`
- `await`
- `try/catch`
- `response.ok`
- `.json()`

The page does not assume every request will succeed.

If a request fails, the interface shows an inline error instead of crashing or using an `alert()` box.

---

# Technology

This project uses:

- HTML
- CSS
- Vanilla JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- `fetch()`
- `async` / `await`
- `try/catch`
- DOM manipulation

The project does **not** use:

- React
- Tailwind
- Bootstrap
- External JavaScript libraries
- A database
- A backend
- An API key

Everything

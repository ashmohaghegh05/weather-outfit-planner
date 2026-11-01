# Product Requirements Document

## Project

Weather Outfit Planner

## Project Summary

I am building a weather outfit planner that looks up the forecast for a city and helps me decide what to wear and what to bring.

The page should turn raw weather data into a practical recommendation instead of only repeating the API response.

## User

The main user is me.

I want to use this before class, interviews, meetings, or other plans where I need to know how the weather should affect what I wear or bring.

## Main Problem

A normal weather forecast gives useful data, but I still have to interpret it myself.

I want the tool to answer questions such as:

- Is it cold enough for a coat?
- Will I need an umbrella?
- Is the wind strong enough to matter?
- Will it feel colder than the actual temperature?
- Should I wear lighter or warmer clothes?

## Main Goal

The main goal is to turn weather forecast data into a short, useful outfit and preparation recommendation.

The user should be able to enter a city and understand the result quickly.

---

# API

The project will use Open-Meteo.

## Geocoding API

The geocoding API is used to turn a city name into coordinates.

The project may use fields such as:

- `name`
- `latitude`
- `longitude`
- `country`
- `timezone`

## Forecast API

The forecast API is used to get the weather for the selected location.

The project may use:

- `temperature_2m_max`
- `temperature_2m_min`
- `apparent_temperature_max`
- `apparent_temperature_min`
- `precipitation_probability_max`
- `weather_code`
- `wind_speed_10m_max`

The project does not require an API key.

---

# Core User Flow

1. The user enters a city.
2. The page validates the input.
3. The page shows a loading state.
4. JavaScript sends a request to the geocoding API.
5. If the city is found, JavaScript reads the latitude and longitude.
6. JavaScript sends a second request to the forecast API.
7. The weather data is processed.
8. JavaScript creates an outfit and preparation recommendation.
9. The forecast and recommendation appear on the page.

---

# What the User Chooses

The user chooses the location by typing a city name.

The city changes which coordinates and forecast are requested.

The page should not use a fixed city.

---

# What the Page Works Out

The page should calculate a recommendation from the API data.

Possible rules include:

## Cold Weather

If the apparent temperature is very low:

- Recommend a warm coat
- Recommend layers

## Mild Weather

If the temperature is moderate:

- Recommend normal clothing
- Suggest a light jacket if needed

## Hot Weather

If the temperature is high:

- Recommend lighter clothing
- Remind the user to stay comfortable in the heat

## Rain

If precipitation probability is high:

- Recommend an umbrella
- Recommend rain-resistant outerwear if appropriate

## Wind

If wind speed is high:

- Recommend an outer layer or wind-resistant jacket

The recommendation should explain the main reason behind it.

---

# Calculated Output

The project should not only show the raw API response.

The final output should include:

- Location
- Forecast high
- Forecast low
- Apparent temperature
- Rain probability
- Wind speed
- Simple weather description
- Outfit recommendation
- What to bring

---

# Required Page States

The page must intentionally support every required Mini Project 3 state.

## 1. Empty State

This is what appears when the page first loads.

The user should see:

- Project name
- Short explanation
- City search form
- A simple message explaining what to do

Example:

**Enter a city to get your weather-based outfit recommendation.**

No fake forecast data should appear.

---

## 2. Loading State

This appears after the user submits a valid city while the API requests are running.

The page should show a clear message such as:

**Checking the forecast...**

The search form should remain visible.

The page should not appear frozen.

---

## 3. Error State

This appears when:

- The request fails
- Open-Meteo cannot be reached
- The response is not successful

The page should show an inline message.

Example:

**The forecast could not be loaded. Please try again.**

The user should be able to search again without reloading the page.

The page must not use `alert()`.

---

## 4. Invalid Input State

If the user submits an empty city:

- Do not send an API request
- Show a clear inline message
- Keep the form available

Example:

**Enter a city before searching.**

---

## 5. No Results State

If the geocoding API cannot find the city:

- Do not request forecast data with missing coordinates
- Show a clear message

Example:

**No matching city was found. Try a different search.**

This is different from a network or API error.

---

## 6. In-Use State

When the requests succeed, the page should show:

- City and country
- Main forecast data
- Outfit recommendation
- What the user should bring
- A way to search another city

The recommendation should be visually more important than the raw forecast numbers.

---

# Input Validation

The search field is required.

Before making a request:

1. Read the city value.
2. Remove extra spaces.
3. Check that the value is not empty.

If it is empty, show the invalid-input state.

---

# Fetch Requirements

Every API request must:

- Use `fetch()`
- Use `await`
- Sit inside `try/catch`
- Check `response.ok`
- Convert the response with `.json()`

If `response.ok` is false, the code should throw an error so the error state can be shown.

---

# JavaScript Structure

Keep the JavaScript simple and readable.

Possible functions include:

```text
searchLocation()
fetchForecast()
createRecommendation()
showLoading()
showError()
renderWeather()
```

The exact names can change.

The code should remain easy enough to explain during the walkthrough.

---

# Recommendation Logic

The recommendation logic should use simple conditions.

Possible inputs include:

- Apparent temperature
- Maximum temperature
- Minimum temperature
- Rain probability
- Wind speed
- Weather code

Use straightforward `if`, `else if`, and `else` conditions.

Avoid overly complicated scoring systems unless necessary.

---

# Page Structure

The project should use one main page.

## Header

Contains:

- Project name
- Short explanation

## Search Section

Contains:

- City input
- Search button
- Inline status/error message

## Recommendation Section

Shows the main answer worked out from the weather.

## Forecast Details

Shows the supporting weather data.

## Footer

Simple project identification.

---

# Responsive Design

The page should work comfortably on both desktop and mobile.

On smaller screens:

- Use one column
- Make the search input full width
- Keep buttons easy to tap
- Keep the recommendation readable
- Avoid horizontal scrolling

---

# Accessibility

- Every input must have a visible label
- Keyboard focus must remain visible
- Do not rely only on color
- Error messages should explain what went wrong
- Buttons should use descriptive text
- Maintain readable contrast

---

# Technical Requirements

Use:

- HTML
- CSS
- Vanilla JavaScript
- `fetch()`
- `async`
- `await`
- `try/catch`
- `response.ok`
- DOM manipulation

Do not use:

- React
- Tailwind
- Bootstrap
- External JavaScript libraries
- CDN libraries
- A database
- A server
- A hidden API key

The project should run on GitHub Pages.

---

# Success Criteria

The project is successful if I can:

1. Enter a city.
2. See a loading state.
3. Receive forecast data from Open-Meteo.
4. See a useful outfit recommendation.
5. Understand why the recommendation was made.
6. Receive a useful message if the city is not found.
7. Receive a useful message if the request fails.
8. Submit an empty search and see an inline validation message.
9. Use the page comfortably on a phone.
10. Explain the fetch and recommendation logic during the walkthrough.




# AGENTS.md

## Project

Weather Outfit Planner

## Main Rule

Use the simplest code that works.

Do not add features that were not requested.

Keep the project easy to read, easy to explain, and easy to debug.

---

# Project Purpose

Weather Outfit Planner helps a user decide exactly what to wear for a specific place, date, time, and occasion.

The application:

1. looks up a location
2. gets its local weather forecast
3. finds the forecast closest to the user's selected time
4. evaluates the weather conditions
5. recommends one specific outfit

The weather data supports the decision.

**The outfit is the main answer.**

---

# Required Technology

Use only:

- HTML
- CSS
- JavaScript

Do not use:

- frameworks
- React
- Vue
- Bootstrap
- external JavaScript libraries
- CDN libraries

Keep all code readable for a beginner JavaScript course.

---

# Main Files

The main project files are:

- `index.html`
- `style.css`
- `script.js`
- `PROPOSAL.md`
- `PRD.md`
- `DESIGN.md`
- `AGENTS.md`
- `README.md`
- `option-c.html`

Do not create unnecessary files.

---

# API

Use Open-Meteo.

Documentation:

https://open-meteo.com/en/docs

The project uses two API requests.

---

## 1. Geocoding API

Use the user's location input to find:

- city name
- state or region
- country
- latitude
- longitude
- timezone

The user may enter a more specific location such as:

`Boston, MA`

or:

`Karachi, Pakistan`

Use `encodeURIComponent()` when placing user input inside the API URL.

---

## 2. Weather Forecast API

Use the latitude and longitude from the geocoding result.

Request hourly values for:

- `temperature_2m`
- `apparent_temperature`
- `relative_humidity_2m`
- `precipitation_probability`
- `snowfall`
- `weather_code`
- `wind_speed_10m`

Use:

`timezone=auto`

so forecast timestamps use the destination's local timezone.

Use Fahrenheit for temperature and mph for wind because the current interface is designed around those units.

---

# Fetch Rules

Every fetch request must:

1. be inside an async function
2. use `await`
3. check `response.ok`
4. call `.json()`
5. be handled through `try/catch`

Example pattern:

```javascript
const response = await fetch(url);

if (!response.ok) {
    throw new Error("Request failed");
}

const data = await response.json();
```

Do not assume a failed HTTP request will automatically throw an error.

---

# User Inputs

The user chooses:

- city or area
- date
- time
- occasion

Available occasions:

- Interview
- Class
- Casual
- Outdoor

Do not remove these inputs unless specifically requested.

---

# Date Rules

Only allow dates within the forecast range used by the project.

The current application allows:

- today
- up to 15 days after today

The date limits should be created with JavaScript.

Do not hard-code actual calendar dates.

---

# Time Rules

The forecast API returns hourly weather data.

The application should find the hourly forecast closest to the user's chosen time.

The result should clearly state that the time is:

**DESTINATION LOCAL TIME**

---

# Outfit Logic

The application must not simply display raw weather data.

It must work out an outfit.

The recommendation should depend on:

- occasion
- apparent temperature
- humidity
- precipitation probability
- snow
- wind
- weather condition

---

# Exact Outfit Structure

Each recommendation should contain:

- Top
- Bottom
- Mid Layer
- Outer Layer
- Shoes
- Accessories

Use actual garment descriptions.

Good:

`Light-blue Oxford shirt`

Bad:

`Wear something professional`

Good:

`Dark navy wool overcoat`

Bad:

`Wear a warm layer`

Good:

`Black water-resistant leather loafers`

Bad:

`Wear good shoes`

The user should be able to read the result and know what outfit to assemble.

---

# Occasion Logic

## Interview

Recommendations should remain professional.

Possible garments include:

- Oxford shirt
- tailored trousers
- blazer
- trench coat
- wool coat
- leather loafers
- derby shoes

Weather protection may change the outer layer or shoes.

---

## Class

Recommendations should prioritize:

- comfort
- practical layering
- easy everyday clothing

Possible garments include:

- T-shirt
- jeans
- chinos
- sweater
- overshirt
- bomber jacket
- sneakers

---

## Casual

Recommendations should be relaxed but coordinated.

Possible garments include:

- linen shirt
- T-shirt
- chinos
- jeans
- overshirt
- lightweight jacket
- sneakers

---

## Outdoor

Recommendations should prioritize:

- comfort
- weather protection
- movement
- practical materials

Possible garments include:

- thermal base layer
- performance T-shirt
- fleece
- hiking trousers
- shell jacket
- trail shoes
- hiking boots

---

# Weather Adjustments

## High Humidity

When humidity is high and the weather is warm:

- choose breathable fabrics
- reduce unnecessary layers
- use cotton, linen, or moisture-wicking materials

---

## Rain

When precipitation probability is high:

- use rain-resistant outerwear
- adjust footwear
- add an umbrella when wind is not too strong

If wind is strong, prefer hooded rain protection rather than relying only on an umbrella.

---

## Snow

When snow is expected:

- use insulated outerwear
- use waterproof footwear
- add warm socks
- add gloves

---

## Strong Wind

When wind is strong:

- use a wind-blocking outer layer

Do not leave the recommendation with "no outer layer" if strong wind makes a layer necessary.

---

## Very Cold Weather

Add useful cold-weather accessories such as:

- gloves
- scarf
- warm socks

---

## Hot Weather

Use:

- lighter fabrics
- fewer layers
- breathable clothing

A water bottle may be added as an accessory.

---

## Sunny Weather

Sunglasses may be added when conditions are clear and warm enough.

---

# Weather Codes

Use a simple helper function to convert Open-Meteo weather codes into readable conditions.

Examples:

- Clear sky
- Mainly clear
- Partly cloudy
- Overcast
- Fog
- Drizzle
- Rain
- Snow
- Rain showers
- Snow showers
- Thunderstorm

Do not display raw weather-code numbers to the user.

---

# Application States

The following states must remain supported.

---

## Empty State

Before the user submits the form.

Show guidance explaining what information to enter.

---

## Loading State

Show while the API calls are running.

Example:

**Preparing your outfit...**

Do not leave the previous result visible while a new request is loading.

---

## Invalid Input

Show when:

- location is missing
- date is missing
- time is missing
- occasion is missing
- date is outside the allowed range

Give the user a clear message explaining what must be corrected.

---

## No Results

Show when the geocoding API cannot find a location.

Suggest adding:

- state
- region
- country

---

## Error State

Show if an API request fails or expected forecast data is missing.

Do not expose technical error details directly to the user.

Technical errors may be logged with:

```javascript
console.error(error);
```

---

## In Use State

Show:

- destination
- date
- time
- occasion
- weather condition
- exact outfit
- explanation
- local weather metrics
- Before You Leave items

---

# Rendering Rules

Use JavaScript to create and render result content.

Prefer:

- `document.createElement()`
- `.textContent`
- `.appendChild()`

Do not insert user-provided text into the page with unsafe HTML.

Avoid unnecessary use of `innerHTML`.

Using:

```javascript
resultArea.innerHTML = "";
```

to clear an existing result is acceptable.

---

# Design Direction

Follow `DESIGN.md`.

The final design should feel:

- playful
- colorful
- cute
- editorial
- organized

Use:

- warm cream background
- pastel pink
- soft blue
- soft yellow
- green
- purple accents
- rounded cards
- pill-shaped labels
- offset shadows
- serif headings
- sans-serif interface text

---

# Design Priority

The recommendation should visually dominate the weather data.

The order of importance is:

1. exact outfit
2. destination and occasion
3. explanation
4. local weather conditions
5. accessories / Before You Leave

Do not redesign the page into a traditional weather dashboard.

---

# Responsive Design

The project must work on:

- desktop
- tablet
- mobile

On smaller screens:

- stack form fields
- stack result cards
- keep text inside the viewport
- make button full width when useful
- stack outfit label/value rows
- remove decorative rotation if it hurts readability

---

# Accessibility

Keep:

- semantic HTML
- form labels
- keyboard-accessible controls
- visible focus states
- readable contrast
- `aria-live` on changing messages and result areas

Do not communicate important information through color alone.

---

# Code Style

Keep functions focused on one responsibility.

Suggested function structure:

- `setDateLimits()`
- `searchLocation()`
- `fetchForecast()`
- `getWeatherForTime()`
- `createRecommendation()`
- `getWeatherDescription()`
- `renderWeather()`
- `addOutfitRow()`
- `addMetric()`
- state helper functions

Use descriptive variable names.

Avoid deeply nested code when a helper function makes the logic easier to understand.

---

# Comments

Use comments to separate major parts of the JavaScript.

Example:

```javascript
/* ---------------------------------
   WEATHER API
--------------------------------- */
```

Do not comment every individual line.

Comments should help someone understand the structure of the file.

---

# Security

There is no API key required for Open-Meteo.

Do not add an API key to this project.

Do not commit secrets or tokens.

User input should be encoded before it is added to a URL.

---

# Testing

Before considering the project finished, test:

### Normal request

Example:

- Boston, MA
- valid date
- 9:00 AM
- Interview

Check that the full outfit appears.

### Different occasion

Use the same location/weather but choose another occasion.

The outfit should change.

### Hot location

Confirm lighter outfit recommendations appear.

### Cold location

Confirm warmer layers appear.

### Rain

Confirm rain protection is added.

### Invalid location

Example:

`asdfghjklxyz`

Confirm the No Results state appears.

### Missing field

Confirm validation appears.

### Mobile width

Confirm the page remains readable and usable.

---

# Walkthrough Rule

The code must remain simple enough that the student can explain:

1. how the location API works
2. how latitude and longitude are obtained
3. how the weather API works
4. why `await` is needed
5. what `response.ok` checks
6. what `.json()` does
7. how the selected forecast hour is found
8. how the weather conditions affect the outfit
9. how JavaScript renders the final result

Do not make the solution more technically complex than necessary.

---

# Final Principle

The project should not behave like a normal weather app.

The user is not primarily asking:

**“What is the weather?”**

The user is asking:

**“What exactly should I wear there?”**

Keep the project focused on answering that question.

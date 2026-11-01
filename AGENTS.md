# Agent Instructions

## Project

This repository contains Mini Project 3: Weather Outfit Planner.

The tool looks up weather forecast data using Open-Meteo and turns that data into a practical recommendation for what to wear and what to bring.

Before changing anything, read:

1. `PROPOSAL.md`
2. `PRD.md`
3. `DESIGN.md`

These files define what the project should do and how it should look.

---

## Main Rule

Use the simplest code that works, and add nothing I did not ask for.

The project should remain easy enough for me to explain during the class walkthrough.

Do not add advanced patterns, abstractions, frameworks, libraries, or extra features unless they are necessary.

---

## Design Rules

Follow `DESIGN.md`.

The final visual direction is:

**Forecast Passport / Travel Brief**

Main design rule:

> The weather data supports the decision. The recommendation is the answer.

The recommendation should be more visually important than the raw forecast numbers.

Do not redesign the project into a generic weather dashboard.

---

## Technology Rules

Use only:

- HTML
- CSS
- Vanilla JavaScript

Do not use:

- React
- Vue
- Angular
- Tailwind
- Bootstrap
- jQuery
- External JavaScript libraries
- CDN libraries
- Databases
- Backend code
- Server code

Everything should run directly in the browser and deploy on GitHub Pages.

---

## API Rules

Use Open-Meteo.

The project may use:

- Open-Meteo Geocoding API
- Open-Meteo Forecast API

The project does not require an API key.

Do not add any API key.

Do not add another weather API unless I explicitly ask for one.

Before using an API field, make sure it exists in the real API response.

Do not guess field names.

---

## Fetch Rules

Every API request must:

- Use `fetch()`
- Use `await`
- Be inside `try/catch`
- Check `response.ok`
- Convert the response using `.json()`

If `response.ok` is false, throw an error so the page can show the error state.

Keep the fetch logic easy to read.

---

## Expected Files

Keep the project simple.

Expected main files:

```text
index.html
style.css
script.js
PROPOSAL.md
PRD.md
DESIGN.md
AGENTS.md
README.md
option-c.html
```

Do not create unnecessary folders or files.

---

## Main User Flow

The user should:

1. Enter a city.
2. Submit the search.
3. See a loading state.
4. Have the city converted into coordinates using the geocoding API.
5. Have the forecast loaded using the forecast API.
6. See a weather-based clothing recommendation.
7. See the supporting forecast data.
8. Be able to search again without reloading the page.

---

## Input Validation

The city field is required.

Before sending any API request:

1. Read the input.
2. Trim extra spaces.
3. Check whether it is empty.

If the city is empty:

- Do not fetch anything.
- Show an inline error.
- Keep the form usable.
- Do not use `alert()`.

---

## Required States

Support every state defined in `PRD.md`.

### Empty State

Before a city is searched:

- Show the hero.
- Show the search form.
- Show a simple starting message.
- Do not show fake weather data.

### Loading State

While the API requests are running:

Show:

**Checking the forecast...**

Keep the page stable and usable.

### Invalid Input State

If the city field is empty:

Show:

**Enter a city before searching.**

Do not send a request.

### No Results State

If no city is found:

Show:

**No matching city was found. Try a different search.**

Do not request forecast data without valid coordinates.

### Error State

If an API request fails:

Show:

**The forecast could not be loaded. Please try again.**

Keep the search form available.

### In-Use State

When requests succeed, show:

- City
- Country
- Weather description
- High temperature
- Low temperature
- Apparent temperature
- Rain probability
- Wind speed
- Outfit recommendation
- What to bring

---

## Recommendation Logic

The page must work out an answer from the API data.

Do not only display weather values.

Use simple conditional logic.

Possible rules:

### Cold

Recommend:

- Warm coat
- Layers

### Cool

Recommend:

- Light jacket
- Extra layer if needed

### Mild

Recommend:

- Normal clothing
- Optional light layer

### Hot

Recommend:

- Light clothing
- Heat-conscious preparation

### Rain

If rain probability is high:

Recommend:

- Umbrella
- Rain-ready shoes or outerwear when appropriate

### Wind

If wind speed is high:

Recommend:

- Wind-resistant outer layer

Use apparent temperature when it better represents how the weather will feel.

Keep the rules understandable.

Do not create a complicated scoring system unless necessary.

---

## JavaScript Structure

Prefer small, clearly named functions.

Possible functions include:

```text
searchLocation()
fetchForecast()
createRecommendation()
getWeatherDescription()
showLoading()
showMessage()
renderWeather()
```

The exact names may change.

Do not put the whole project inside one giant function.

Do not compress multiple important steps into one unreadable line.

---

## Course Concepts to Prefer

Prefer concepts covered in class:

- `const`
- `let`
- Strings
- Numbers
- Booleans
- Arrays
- Objects
- Functions
- Parameters
- `return`
- `if`
- `else if`
- `else`
- Comparison operators
- Logical operators
- `addEventListener()`
- `querySelector()`
- `createElement()`
- `textContent`
- `fetch()`
- `async`
- `await`
- `try/catch`
- `response.ok`
- `.json()`

If a new method is necessary, explain what it does and why it is needed.

---

## DOM Safety

Use `textContent` for text shown on the page.

Do not place API or user-entered values into the page using unsafe `innerHTML`.

Treat outside data as untrusted.

---

## Error Handling

Do not allow a failed API request to crash the page.

Use `try/catch`.

The `catch` block should:

- Show a useful inline message
- Keep the form available
- Allow the user to try again

Use `console.log()` temporarily during debugging if necessary.

Remove unnecessary debugging logs from the final version.

---

## HTML Rules

Use semantic HTML where appropriate.

Prefer:

- `<header>`
- `<main>`
- `<section>`
- `<form>`
- `<label>`
- `<article>`
- `<aside>`
- `<footer>`

Every input must have a visible `<label>`.

Do not rely only on placeholder text.

---

## Accessibility

The page must be keyboard usable.

Keep visible focus styles.

Do not communicate important information with color alone.

Buttons must use descriptive labels.

Error messages should clearly explain what the user can do next.

Maintain readable contrast.

---

## Responsive Design

Follow `DESIGN.md`.

On desktop:

- Use a strong editorial hero
- Use a two-column result layout
- Recommendation on the left
- Supporting forecast data on the right

On mobile:

- Use one column
- Make search controls easy to tap
- Keep the recommendation before supporting forecast details
- Avoid horizontal scrolling

---

## Visual Restrictions

Do not add:

- Gradients
- Glassmorphism
- Drop shadows
- Animated weather backgrounds
- Floating clouds
- Rain animations
- Stock illustrations
- Giant weather icons
- Pill-shaped controls
- Excessive rounded corners
- External fonts
- Multiple competing accent colors

Use the colors, typography, borders, spacing, and hierarchy defined in `DESIGN.md`.

---

## Editing Rules

When I ask for one change:

- Change only what is necessary.
- Preserve working functionality.
- Do not redesign unrelated sections.
- Preserve `DESIGN.md`.
- Do not add features I did not request.

If a requested change conflicts with `PRD.md` or `DESIGN.md`, point it out before making a major change.

---

## Testing

Important tests:

1. Search a valid city.
2. Confirm the loading state appears.
3. Confirm geocoding returns the correct location.
4. Confirm forecast data loads.
5. Confirm the recommendation is based on the returned data.
6. Submit an empty city.
7. Search for a city that does not exist.
8. Test the error state with the browser set to Offline.
9. Search again after an error.
10. Test on a narrow/mobile screen.
11. Confirm there is no horizontal scrolling.

---

## Walkthrough Preparation

The final JavaScript should be readable enough that I can explain:

- Why there are two API requests
- What the geocoding API returns
- How latitude and longitude are used
- What `fetch()` does
- Why `await` is used
- Why the function needs `async`
- Why `response.ok` is checked
- What `.json()` does
- Why `try/catch` is used
- How the recommendation is calculated
- What happens when a city is not found
- What happens if a fetch line or condition is removed

Prefer understandable code over clever code.

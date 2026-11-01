# Mini Project 3 Proposal

## What I Am Building

I am building a weather outfit planner that looks up the forecast for a location and helps me decide what to wear and what to bring.

The goal is to make weather information more useful instead of only showing temperatures and percentages.

## Who It Is For

This tool is mainly for me.

I often check the weather before going to class, an interview, a meeting, or another important event, but a normal weather app still leaves me deciding what the forecast actually means for what I should wear.

I want one simple page where I can enter a city and quickly get both the forecast and a practical recommendation.

## The API

I will use **Open-Meteo**.

Documentation:

https://open-meteo.com/en/docs

I will also use the Open-Meteo Geocoding API so the user can type a city name instead of entering latitude and longitude manually.

The geocoding API can return fields such as:

- `name`
- `latitude`
- `longitude`
- `country`
- `timezone`

The forecast API can return daily weather fields such as:

- `temperature_2m_max`
- `temperature_2m_min`
- `apparent_temperature_max`
- `apparent_temperature_min`
- `precipitation_probability_max`
- `weather_code`
- `wind_speed_10m_max`

The geocoding data gives me the coordinates needed to request the forecast, and the forecast data gives me the information needed to create the outfit recommendation.

## API URLs I Tested

For location search, I can use an endpoint such as:

```text
https://geocoding-api.open-meteo.com/v1/search?name=Boston&count=1&language=en&format=json
```

For weather data, I can use an endpoint based on the latitude and longitude returned by the location search.

For example:

```text
https://api.open-meteo.com/v1/forecast?latitude=42.36&longitude=-71.06&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto
```

## What the User Chooses

The user will enter a city or location.

The location changes which coordinates are requested from the geocoding API and therefore which weather forecast is loaded.

The user can then see the forecast for that location and the recommendation generated from it.

## What the Page Works Out

The page will not only display the API response.

It will use the forecast data to work out a practical clothing and preparation recommendation.

For example:

- If it is cold, recommend a coat or warm layers.
- If it is mild, recommend a light jacket.
- If it is hot, recommend lighter clothing.
- If rain is likely, recommend bringing an umbrella.
- If wind is strong, recommend an outer layer or wind-resistant jacket.
- If the apparent temperature is much colder than the actual temperature, use the apparent temperature when giving the recommendation.

The result should give the user a short explanation of why the recommendation was made.

## Features

The main features I want are:

1. Search for a city.
2. Look up the city's coordinates using the Open-Meteo Geocoding API.
3. Fetch the weather forecast using the Open-Meteo Forecast API.
4. Show important forecast information such as temperature, rain probability, and wind.
5. Generate a practical outfit and preparation recommendation from the weather data.

## What I Do Not Know Yet

There are several JavaScript parts that I still need to figure out.

I am not completely sure how to:

- Use one API response to make a second API request.
- Find the correct city when several search results have similar names.
- Match the weather arrays with the correct date.
- Convert Open-Meteo weather codes into simple descriptions.
- Create the recommendation rules without making the code too complicated.
- Show a loading state while the API requests are running.
- Handle a city that cannot be found.
- Handle a failed API request with `try/catch`.
- Check `response.ok` correctly before reading the response.
- Keep the page easy to use on both desktop and mobile.

These are the main JavaScript parts I expect to work through while building the project.

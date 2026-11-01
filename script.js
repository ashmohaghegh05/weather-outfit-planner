const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city");
const eventDateInput = document.querySelector("#event-date");
const eventTimeInput = document.querySelector("#event-time");
const occasionInput = document.querySelector("#occasion");
const formMessage = document.querySelector("#form-message");
const resultArea = document.querySelector("#result-area");


setDateLimits();


form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();
    const eventDate = eventDateInput.value;
    const eventTime = eventTimeInput.value;
    const occasion = occasionInput.value;

    clearFormMessage();


    if (
        city === "" ||
        eventDate === "" ||
        eventTime === "" ||
        occasion === ""
    ) {
        showFormError(
            "Enter a city, date, time, and occasion before preparing your brief."
        );

        return;
    }


    if (
        eventDate < eventDateInput.min ||
        eventDate > eventDateInput.max
    ) {
        showFormError(
            "Choose a date within the available forecast range."
        );

        return;
    }


    showLoading();


    try {

        const location = await searchLocation(city);


        if (!location) {
            showNoResults();
            return;
        }


        const forecastData = await fetchForecast(
            location.latitude,
            location.longitude,
            eventDate
        );


        const weather = getWeatherForTime(
            forecastData,
            eventTime
        );


        renderWeather(
            location,
            weather,
            eventDate,
            eventTime,
            occasion
        );

    } catch (error) {

        console.log(error);

        showError();
    }
});


/* ---------------------------------
   DATE LIMITS
--------------------------------- */

function setDateLimits() {
    const today = new Date();

    const lastForecastDate = new Date();
    lastForecastDate.setDate(
        lastForecastDate.getDate() + 15
    );

    eventDateInput.min = formatDateForInput(today);

    eventDateInput.max =
        formatDateForInput(lastForecastDate);
}


function formatDateForInput(date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


/* ---------------------------------
   GEOCODING
--------------------------------- */

async function searchLocation(city) {
    const url =
        "https://geocoding-api.open-meteo.com/v1/search" +
        "?name=" + encodeURIComponent(city) +
        "&count=1" +
        "&language=en" +
        "&format=json";


    const response = await fetch(url);


    if (!response.ok) {
        throw new Error(
            "Location request failed: " +
            response.status
        );
    }


    const data = await response.json();


    if (
        !data.results ||
        data.results.length === 0
    ) {
        return null;
    }


    return data.results[0];
}


/* ---------------------------------
   WEATHER API
--------------------------------- */

async function fetchForecast(
    latitude,
    longitude,
    eventDate
) {

    const hourlyFields = [
        "temperature_2m",
        "apparent_temperature",
        "precipitation_probability",
        "weather_code",
        "wind_speed_10m"
    ].join(",");


    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + latitude +
        "&longitude=" + longitude +
        "&hourly=" + hourlyFields +
        "&temperature_unit=fahrenheit" +
        "&wind_speed_unit=mph" +
        "&timezone=auto" +
        "&start_date=" + eventDate +
        "&end_date=" + eventDate;


    const response = await fetch(url);


    if (!response.ok) {
        throw new Error(
            "Forecast request failed: " +
            response.status
        );
    }


    const data = await response.json();


    if (
        !data.hourly ||
        !data.hourly.time ||
        data.hourly.time.length === 0
    ) {
        throw new Error(
            "Hourly forecast data is missing."
        );
    }


    return data;
}


/* ---------------------------------
   FIND CLOSEST HOUR
--------------------------------- */

function getWeatherForTime(
    forecastData,
    eventTime
) {

    const requestedMinutes =
        timeToMinutes(eventTime);

    let closestIndex = 0;
    let smallestDifference = Infinity;


    forecastData.hourly.time.forEach(
        function(time, index) {

            const timePart = time.split("T")[1];

            const forecastMinutes =
                timeToMinutes(timePart);

            const difference = Math.abs(
                forecastMinutes -
                requestedMinutes
            );


            if (difference < smallestDifference) {
                smallestDifference = difference;
                closestIndex = index;
            }
        }
    );


    return {
        forecastTime:
            forecastData.hourly.time[
                closestIndex
            ],

        temperature:
            forecastData.hourly.temperature_2m[
                closestIndex
            ],

        apparentTemperature:
            forecastData.hourly.apparent_temperature[
                closestIndex
            ],

        rain:
            forecastData.hourly.precipitation_probability[
                closestIndex
            ] ?? 0,

        weatherCode:
            forecastData.hourly.weather_code[
                closestIndex
            ],

        wind:
            forecastData.hourly.wind_speed_10m[
                closestIndex
            ] ?? 0,

        timezone:
            forecastData.timezone
    };
}


function timeToMinutes(time) {
    const parts = time.split(":");

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    return hours * 60 + minutes;
}


/* ---------------------------------
   RECOMMENDATION
--------------------------------- */

function createRecommendation(
    weather,
    occasion
) {

    const items = [];
    const reasons = [];

    const feelsLike =
        weather.apparentTemperature;

    let recommendation = "";


    /* OCCASION + TEMPERATURE */

    if (occasion === "Interview") {

        if (feelsLike <= 35) {
            recommendation =
                "Wear your interview outfit with a warm coat and layers.";

            addItem(items, "Warm coat");
            addItem(items, "Professional layers");

        } else if (feelsLike <= 50) {
            recommendation =
                "Wear your interview outfit with a clean jacket or warm outer layer.";

            addItem(items, "Jacket");

        } else if (feelsLike <= 65) {
            recommendation =
                "Wear your interview outfit with a light layer for the trip.";

            addItem(items, "Light layer");

        } else {
            recommendation =
                "Wear a breathable interview outfit and keep extra layers light.";
        }


    } else if (occasion === "Class") {

        if (feelsLike <= 35) {
            recommendation =
                "Dress warmly for class with a coat and comfortable layers.";

            addItem(items, "Warm coat");
            addItem(items, "Layers");

        } else if (feelsLike <= 50) {
            recommendation =
                "Wear comfortable class clothes with a jacket.";

            addItem(items, "Jacket");

        } else if (feelsLike <= 65) {
            recommendation =
                "Wear comfortable layers and bring a light jacket.";

            addItem(items, "Light jacket");

        } else {
            recommendation =
                "Wear comfortable lightweight clothes for class.";
        }


    } else if (occasion === "Outdoor") {

        if (feelsLike <= 35) {
            recommendation =
                "Dress for the outdoors with a warm coat and several layers.";

            addItem(items, "Warm coat");
            addItem(items, "Layers");

        } else if (feelsLike <= 50) {
            recommendation =
                "Wear an outdoor jacket and layers you can adjust.";

            addItem(items, "Outdoor jacket");
            addItem(items, "Layers");

        } else if (feelsLike <= 65) {
            recommendation =
                "Wear light outdoor layers that are easy to remove.";

            addItem(items, "Light layers");

        } else {
            recommendation =
                "Choose breathable clothing suitable for being outside.";

            addItem(items, "Breathable clothing");
        }


    } else {

        if (feelsLike <= 35) {
            recommendation =
                "Keep it casual but warm with a coat and layers.";

            addItem(items, "Warm coat");
            addItem(items, "Layers");

        } else if (feelsLike <= 50) {
            recommendation =
                "Wear a casual outfit with a jacket.";

            addItem(items, "Jacket");

        } else if (feelsLike <= 65) {
            recommendation =
                "Wear casual layers with a light jacket nearby.";

            addItem(items, "Light jacket");

        } else {
            recommendation =
                "Wear a light and comfortable casual outfit.";
        }
    }


    /* TEMPERATURE REASON */

    reasons.push(
        "At your selected time it should feel like " +
        Math.round(feelsLike) +
        "°F."
    );


    /* RAIN */

    if (weather.rain >= 60) {

        recommendation +=
            " Bring an umbrella.";

        addItem(items, "Umbrella");
        addItem(items, "Rain-ready shoes");

        reasons.push(
            "Rain is likely with a " +
            Math.round(weather.rain) +
            "% precipitation chance."
        );


    } else if (weather.rain >= 30) {

        addItem(items, "Compact umbrella");

        reasons.push(
            "There is some chance of rain, so a compact umbrella may be useful."
        );
    }


    /* WIND */

    if (weather.wind >= 20) {

        recommendation +=
            " Add a wind-resistant outer layer.";

        addItem(
            items,
            "Wind-resistant layer"
        );

        reasons.push(
            "Wind is expected around " +
            Math.round(weather.wind) +
            " mph."
        );
    }


    /* OUTDOOR EXTRA */

    if (
        occasion === "Outdoor" &&
        weather.rain >= 30
    ) {
        addItem(
            items,
            "Water-resistant outerwear"
        );
    }


    return {
        recommendation: recommendation,

        reason: reasons.join(" "),

        items: items,

        weatherDescription:
            getWeatherDescription(
                weather.weatherCode
            )
    };
}


function addItem(items, item) {
    if (!items.includes(item)) {
        items.push(item);
    }
}


/* ---------------------------------
   WEATHER DESCRIPTION
--------------------------------- */

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear";
    }

    if (code === 1 || code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 85 && code <= 86) {
        return "Snow showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Mixed conditions";
}


/* ---------------------------------
   RENDER RESULT
--------------------------------- */

function renderWeather(
    location,
    weather,
    eventDate,
    eventTime,
    occasion
) {

    resultArea.innerHTML = "";


    const advice =
        createRecommendation(
            weather,
            occasion
        );


    const brief =
        document.createElement("div");

    brief.className =
        "weather-brief";


    /* LEFT PANEL */

    const recommendationPanel =
        document.createElement("article");

    recommendationPanel.className =
        "recommendation-panel";


    const label =
        document.createElement("p");

    label.className = "result-label";

    label.textContent =
        "YOUR RECOMMENDATION";


    const occasionLine =
        document.createElement("p");

    occasionLine.className =
        "occasion-line";

    occasionLine.textContent =
        occasion;


    const locationName =
        document.createElement("h3");

    locationName.className =
        "result-location";


    if (location.country) {

        locationName.textContent =
            location.name +
            ", " +
            location.country;

    } else {

        locationName.textContent =
            location.name;
    }


    const eventLine =
        document.createElement("p");

    eventLine.className =
        "event-time-line";

    eventLine.textContent =
        formatReadableDate(eventDate) +
        " · " +
        formatReadableTime(eventTime) +
        " · LOCAL TIME";


    const condition =
        document.createElement("p");

    condition.className =
        "result-condition";

    condition.textContent =
        advice.weatherDescription;


    const recommendationText =
        document.createElement("p");

    recommendationText.className =
        "recommendation-text";

    recommendationText.textContent =
        advice.recommendation;


    const reason =
        document.createElement("p");

    reason.className =
        "recommendation-reason";

    reason.textContent =
        advice.reason;


    const tags =
        document.createElement("div");

    tags.className =
        "recommendation-tags";


    advice.items.forEach(
        function(item) {

            const tag =
                document.createElement(
                    "span"
                );

            tag.className =
                "recommendation-tag";

            tag.textContent = item;

            tags.appendChild(tag);
        }
    );


    recommendationPanel.appendChild(
        label
    );

    recommendationPanel.appendChild(
        occasionLine
    );

    recommendationPanel.appendChild(
        locationName
    );

    recommendationPanel.appendChild(
        eventLine
    );

    recommendationPanel.appendChild(
        condition
    );

    recommendationPanel.appendChild(
        recommendationText
    );

    recommendationPanel.appendChild(
        reason
    );

    recommendationPanel.appendChild(
        tags
    );


    /* RIGHT PANEL */

    const forecastPanel =
        document.createElement("aside");

    forecastPanel.className =
        "forecast-panel";


    const forecastTitle =
        document.createElement("p");

    forecastTitle.className =
        "forecast-title";

    forecastTitle.textContent =
        "FORECAST AT YOUR TIME";


    forecastPanel.appendChild(
        forecastTitle
    );


    addMetric(
        forecastPanel,
        "Temperature",
        Math.round(
            weather.temperature
        ) + "°F"
    );


    addMetric(
        forecastPanel,
        "Feels Like",
        Math.round(
            weather.apparentTemperature
        ) + "°F"
    );


    addMetric(
        forecastPanel,
        "Rain Chance",
        Math.round(
            weather.rain
        ) + "%"
    );


    addMetric(
        forecastPanel,
        "Wind",
        Math.round(
            weather.wind
        ) + " mph"
    );


    addMetric(
        forecastPanel,
        "Forecast Hour",
        formatForecastHour(
            weather.forecastTime
        )
    );


    brief.appendChild(
        recommendationPanel
    );

    brief.appendChild(
        forecastPanel
    );


    /* BEFORE YOU LEAVE */

    const beforeYouLeave =
        document.createElement("section");

    beforeYouLeave.className =
        "before-you-leave";


    const beforeTitle =
        document.createElement("h3");

    beforeTitle.textContent =
        "BEFORE YOU LEAVE";


    const beforeText =
        document.createElement("p");


    if (advice.items.length > 0) {

        beforeText.textContent =
            "Consider: " +
            advice.items.join(", ") +
            ".";

    } else {

        beforeText.textContent =
            "No special weather preparation is needed.";
    }


    beforeYouLeave.appendChild(
        beforeTitle
    );

    beforeYouLeave.appendChild(
        beforeText
    );


    resultArea.appendChild(brief);

    resultArea.appendChild(
        beforeYouLeave
    );
}


/* ---------------------------------
   METRIC
--------------------------------- */

function addMetric(
    parent,
    labelText,
    valueText
) {

    const metric =
        document.createElement("div");

    metric.className =
        "weather-metric";


    const label =
        document.createElement("span");

    label.className =
        "metric-label";

    label.textContent =
        labelText;


    const value =
        document.createElement("span");

    value.className =
        "metric-value";

    value.textContent =
        valueText;


    metric.appendChild(label);
    metric.appendChild(value);

    parent.appendChild(metric);
}


/* ---------------------------------
   READABLE DATE + TIME
--------------------------------- */

function formatReadableDate(dateValue) {

    const parts =
        dateValue.split("-");

    const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}


function formatReadableTime(timeValue) {

    const parts =
        timeValue.split(":");

    let hours = Number(parts[0]);

    const minutes = parts[1];

    const period =
        hours >= 12 ? "PM" : "AM";


    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }


    return (
        hours +
        ":" +
        minutes +
        " " +
        period
    );
}


function formatForecastHour(
    forecastTime
) {

    const time =
        forecastTime.split("T")[1];

    return formatReadableTime(time);
}


/* ---------------------------------
   PAGE STATES
--------------------------------- */

function showLoading() {

    showStatus(
        "loading",
        "Checking the forecast...",
        "Looking up the location and weather for your selected time."
    );
}


function showNoResults() {

    showStatus(
        "error",
        "No matching city was found.",
        "Try another city or make the location more specific."
    );
}


function showError() {

    showStatus(
        "error",
        "The forecast could not be loaded.",
        "Check your connection and make sure the selected date is within the forecast range."
    );
}


function showStatus(
    type,
    titleText,
    messageText
) {

    resultArea.innerHTML = "";


    const status =
        document.createElement("div");

    status.className =
        "status-state " + type;


    const title =
        document.createElement("h3");

    title.textContent =
        titleText;


    const message =
        document.createElement("p");

    message.textContent =
        messageText;


    status.appendChild(title);

    status.appendChild(message);

    resultArea.appendChild(status);
}


/* ---------------------------------
   FORM MESSAGES
--------------------------------- */

function clearFormMessage() {

    formMessage.textContent = "";

    formMessage.className =
        "form-message";
}


function showFormError(message) {

    formMessage.textContent =
        message;

    formMessage.className =
        "form-message error";
}

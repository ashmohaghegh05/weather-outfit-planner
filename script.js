const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city");
const formMessage = document.querySelector("#form-message");
const resultArea = document.querySelector("#result-area");


form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (city === "") {
        formMessage.textContent = "Enter a city before searching.";
        formMessage.classList.add("error");
        return;
    }

    showLoading();

    try {
        const location = await searchLocation(city);

        if (!location) {
            showNoResults();
            return;
        }

        const forecast = await fetchForecast(
            location.latitude,
            location.longitude
        );

        renderWeather(location, forecast);

    } catch (error) {
        console.log(error);
        showError();
    }
});


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
            "Location request failed: " + response.status
        );
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return null;
    }

    return data.results[0];
}


async function fetchForecast(latitude, longitude) {
    const dailyFields = [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "precipitation_probability_max",
        "wind_speed_10m_max"
    ].join(",");

    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + latitude +
        "&longitude=" + longitude +
        "&daily=" + dailyFields +
        "&temperature_unit=fahrenheit" +
        "&wind_speed_unit=mph" +
        "&timezone=auto" +
        "&forecast_days=1";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Forecast request failed: " + response.status
        );
    }

    const data = await response.json();

    if (!data.daily) {
        throw new Error("Forecast data is missing.");
    }

    return {
        weatherCode: data.daily.weather_code[0],

        high: data.daily.temperature_2m_max[0],

        low: data.daily.temperature_2m_min[0],

        apparentHigh:
            data.daily.apparent_temperature_max[0],

        apparentLow:
            data.daily.apparent_temperature_min[0],

        rain:
            data.daily.precipitation_probability_max[0],

        wind:
            data.daily.wind_speed_10m_max[0]
    };
}


function createRecommendation(weather) {
    const items = [];
    const reasons = [];

    let clothing = "";

    if (weather.apparentLow <= 35) {
        clothing = "Wear a warm coat and dress in layers.";

        items.push("Warm coat");
        items.push("Layers");

        reasons.push(
            "It will feel cold enough that warm layers are important."
        );

    } else if (weather.apparentLow <= 50) {
        clothing = "Wear a light jacket or an extra layer.";

        items.push("Light jacket");

        reasons.push(
            "The cooler apparent temperature makes an extra layer useful."
        );

    } else if (weather.apparentHigh >= 80) {
        clothing = "Wear light, breathable clothing.";

        items.push("Light clothing");

        reasons.push(
            "The forecast will feel warm, so lighter clothing should be more comfortable."
        );

    } else if (weather.apparentHigh >= 70) {
        clothing = "Wear lighter everyday clothing.";

        items.push("Light outfit");

        reasons.push(
            "The weather should feel comfortably warm."
        );

    } else {
        clothing = "Wear comfortable everyday clothing.";

        items.push("Everyday layers");

        reasons.push(
            "Temperatures are moderate enough for normal clothing."
        );
    }


    if (weather.rain >= 50) {
        items.push("Umbrella");
        items.push("Rain-ready shoes");

        reasons.push(
            "Rain is likely, so an umbrella and rain-ready shoes are a good idea."
        );
    }


    if (weather.wind >= 20) {
        items.push("Wind-resistant layer");

        reasons.push(
            "Strong wind may make the conditions feel less comfortable."
        );
    }


    const weatherDescription =
        getWeatherDescription(weather.weatherCode);


    let recommendation = clothing;

    if (weather.rain >= 50) {
        recommendation += " Bring an umbrella.";
    }

    if (weather.wind >= 20) {
        recommendation += " Plan for strong wind.";
    }


    return {
        recommendation: recommendation,

        reason: reasons.join(" "),

        items: items,

        weatherDescription: weatherDescription
    };
}


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


function renderWeather(location, weather) {
    resultArea.innerHTML = "";

    const recommendation =
        createRecommendation(weather);


    const brief = document.createElement("div");
    brief.className = "weather-brief";


    const recommendationPanel =
        document.createElement("article");

    recommendationPanel.className =
        "recommendation-panel";


    const label = document.createElement("p");
    label.className = "result-label";
    label.textContent = "TODAY'S RECOMMENDATION";


    const locationName = document.createElement("h3");
    locationName.className = "result-location";

    if (location.country) {
        locationName.textContent =
            location.name + ", " + location.country;
    } else {
        locationName.textContent = location.name;
    }


    const condition = document.createElement("p");
    condition.className = "result-condition";
    condition.textContent =
        recommendation.weatherDescription;


    const recommendationText =
        document.createElement("p");

    recommendationText.className =
        "recommendation-text";

    recommendationText.textContent =
        recommendation.recommendation;


    const reason = document.createElement("p");
    reason.className = "recommendation-reason";
    reason.textContent = recommendation.reason;


    const tags = document.createElement("div");
    tags.className = "recommendation-tags";


    recommendation.items.forEach(function(item) {
        const tag = document.createElement("span");

        tag.className = "recommendation-tag";

        tag.textContent = item;

        tags.appendChild(tag);
    });


    recommendationPanel.appendChild(label);
    recommendationPanel.appendChild(locationName);
    recommendationPanel.appendChild(condition);
    recommendationPanel.appendChild(
        recommendationText
    );
    recommendationPanel.appendChild(reason);
    recommendationPanel.appendChild(tags);


    const forecastPanel =
        document.createElement("aside");

    forecastPanel.className = "forecast-panel";


    const forecastTitle =
        document.createElement("p");

    forecastTitle.className = "forecast-title";
    forecastTitle.textContent = "FORECAST DETAILS";

    forecastPanel.appendChild(forecastTitle);


    addMetric(
        forecastPanel,
        "High",
        Math.round(weather.high) + "°F"
    );

    addMetric(
        forecastPanel,
        "Low",
        Math.round(weather.low) + "°F"
    );

    addMetric(
        forecastPanel,
        "Feels Like High",
        Math.round(weather.apparentHigh) + "°F"
    );

    addMetric(
        forecastPanel,
        "Feels Like Low",
        Math.round(weather.apparentLow) + "°F"
    );

    addMetric(
        forecastPanel,
        "Rain Chance",
        Math.round(weather.rain) + "%"
    );

    addMetric(
        forecastPanel,
        "Wind",
        Math.round(weather.wind) + " mph"
    );


    brief.appendChild(recommendationPanel);
    brief.appendChild(forecastPanel);


    const beforeYouLeave =
        document.createElement("section");

    beforeYouLeave.className = "before-you-leave";


    const beforeTitle = document.createElement("h3");
    beforeTitle.textContent = "BEFORE YOU LEAVE";


    const beforeText = document.createElement("p");

    if (recommendation.items.length > 0) {
        beforeText.textContent =
            "Consider bringing: " +
            recommendation.items.join(", ") +
            ".";
    } else {
        beforeText.textContent =
            "No special preparation is needed.";
    }


    beforeYouLeave.appendChild(beforeTitle);
    beforeYouLeave.appendChild(beforeText);


    resultArea.appendChild(brief);
    resultArea.appendChild(beforeYouLeave);
}


function addMetric(parent, labelText, valueText) {
    const metric = document.createElement("div");
    metric.className = "weather-metric";


    const label = document.createElement("span");
    label.className = "metric-label";
    label.textContent = labelText;


    const value = document.createElement("span");
    value.className = "metric-value";
    value.textContent = valueText;


    metric.appendChild(label);
    metric.appendChild(value);

    parent.appendChild(metric);
}


function showLoading() {
    showStatus(
        "loading",
        "Checking the forecast...",
        "Looking up the location and preparing your weather brief."
    );
}


function showNoResults() {
    showStatus(
        "error",
        "No matching city was found.",
        "Try a different city or make the location more specific."
    );
}


function showError() {
    showStatus(
        "error",
        "The forecast could not be loaded.",
        "Please check your connection and try again."
    );
}


function showStatus(type, titleText, messageText) {
    resultArea.innerHTML = "";

    const status = document.createElement("div");

    status.className =
        "status-state " + type;


    const title = document.createElement("h3");
    title.textContent = titleText;


    const message = document.createElement("p");
    message.textContent = messageText;


    status.appendChild(title);
    status.appendChild(message);

    resultArea.appendChild(status);
}

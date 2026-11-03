const form =
    document.querySelector("#weather-form");

const cityInput =
    document.querySelector("#city");

const eventDateInput =
    document.querySelector("#event-date");

const eventTimeInput =
    document.querySelector("#event-time");

const occasionInput =
    document.querySelector("#occasion");

const formMessage =
    document.querySelector("#form-message");

const resultArea =
    document.querySelector("#result-area");


setDateLimits();


form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();

        const eventDate =
            eventDateInput.value;

        const eventTime =
            eventTimeInput.value;

        const occasion =
            occasionInput.value;


        clearFormMessage();


        if (
            city === "" ||
            eventDate === "" ||
            eventTime === "" ||
            occasion === ""
        ) {

            showFormError(
                "Enter a city or area, date, time, and occasion."
            );

            return;
        }


        if (
            eventDate <
            eventDateInput.min ||
            eventDate >
            eventDateInput.max
        ) {

            showFormError(
                "Choose a date within the available forecast range."
            );

            return;
        }


        showLoading();


        try {

            const location =
                await searchLocation(
                    city
                );


            if (!location) {

                showNoResults();

                return;
            }


            const forecastData =
                await fetchForecast(
                    location.latitude,
                    location.longitude,
                    eventDate
                );


            const weather =
                getWeatherForTime(
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

            console.error(error);

            showError();
        }
    }
);


/* ---------------------------------
   DATE RANGE
--------------------------------- */

function setDateLimits() {

    const today =
        new Date();


    const finalDate =
        new Date();


    finalDate.setDate(
        finalDate.getDate() + 15
    );


    eventDateInput.min =
        formatDateForInput(
            today
        );


    eventDateInput.max =
        formatDateForInput(
            finalDate
        );
}


function formatDateForInput(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


/* ---------------------------------
   LOCATION API
--------------------------------- */

async function searchLocation(
    locationQuery
) {

    const url =
        "https://geocoding-api.open-meteo.com/v1/search" +
        "?name=" +
        encodeURIComponent(
            locationQuery
        ) +
        "&count=1" +
        "&language=en" +
        "&format=json";


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Location request failed: " +
            response.status
        );
    }


    const data =
        await response.json();


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
        "relative_humidity_2m",
        "precipitation_probability",
        "snowfall",
        "weather_code",
        "wind_speed_10m"
    ].join(",");


    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        "&hourly=" +
        hourlyFields +
        "&temperature_unit=fahrenheit" +
        "&wind_speed_unit=mph" +
        "&timezone=auto" +
        "&start_date=" +
        eventDate +
        "&end_date=" +
        eventDate;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Forecast request failed: " +
            response.status
        );
    }


    const data =
        await response.json();


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
   FIND CLOSEST FORECAST HOUR
--------------------------------- */

function getWeatherForTime(
    forecastData,
    eventTime
) {

    const requestedMinutes =
        timeToMinutes(
            eventTime
        );


    let closestIndex = 0;

    let smallestDifference =
        Infinity;


    forecastData.hourly.time.forEach(
        function(
            forecastTime,
            index
        ) {

            const hour =
                forecastTime
                    .split("T")[1];


            const forecastMinutes =
                timeToMinutes(
                    hour
                );


            const difference =
                Math.abs(
                    forecastMinutes -
                    requestedMinutes
                );


            if (
                difference <
                smallestDifference
            ) {

                smallestDifference =
                    difference;


                closestIndex =
                    index;
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


        humidity:
            forecastData.hourly.relative_humidity_2m[
                closestIndex
            ] ?? 0,


        rain:
            forecastData.hourly.precipitation_probability[
                closestIndex
            ] ?? 0,


        snowfall:
            forecastData.hourly.snowfall[
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

    const parts =
        time.split(":");


    const hours =
        Number(
            parts[0]
        );


    const minutes =
        Number(
            parts[1]
        );


    return (
        hours * 60 +
        minutes
    );
}


/* ---------------------------------
   LOCATION DISPLAY
--------------------------------- */

function getAreaName(location) {

    const parts = [];


    if (location.name) {

        parts.push(
            location.name
        );
    }


    if (
        location.admin1 &&
        location.admin1 !==
        location.name
    ) {

        parts.push(
            location.admin1
        );
    }


    if (
        location.country &&
        !parts.includes(
            location.country
        )
    ) {

        parts.push(
            location.country
        );
    }


    return parts.join(", ");
}


/* ---------------------------------
   OUTFIT RECOMMENDATION
--------------------------------- */

function createRecommendation(
    weather,
    occasion,
    location
) {

    const feelsLike =
        weather.apparentTemperature;


    const areaName =
        getAreaName(
            location
        );


    const outfit = {

        top: "",

        bottom: "",

        midLayer: "",

        outerLayer: "",

        shoes: "",

        accessories: []
    };


    const reasons = [];

    let headline = "";


    /* ---------------------------------
       INTERVIEW
    --------------------------------- */

    if (occasion === "Interview") {

        headline =
            "Professional, polished, and matched to the local forecast.";


        if (feelsLike <= 35) {

            outfit.top =
                "Light-blue Oxford shirt";

            outfit.bottom =
                "Charcoal tailored trousers";

            outfit.midLayer =
                "Navy merino crewneck sweater";

            outfit.outerLayer =
                "Dark navy wool overcoat";

            outfit.shoes =
                "Black leather derby shoes";


        } else if (feelsLike <= 50) {

            outfit.top =
                "White Oxford shirt";

            outfit.bottom =
                "Charcoal tailored trousers";

            outfit.midLayer =
                "Navy structured blazer";

            outfit.outerLayer =
                "Tan or navy trench coat";

            outfit.shoes =
                "Dark brown leather loafers";


        } else if (feelsLike <= 65) {

            outfit.top =
                "Pale-blue Oxford shirt";

            outfit.bottom =
                "Navy tailored trousers";

            outfit.midLayer =
                "Lightweight navy blazer";

            outfit.outerLayer =
                "No heavy outer coat";

            outfit.shoes =
                "Dark brown leather loafers";


        } else if (feelsLike <= 78) {

            outfit.top =
                "White lightweight cotton dress shirt";

            outfit.bottom =
                "Charcoal lightweight tailored trousers";

            outfit.midLayer =
                "Unlined navy blazer";

            outfit.outerLayer =
                "No outer coat";

            outfit.shoes =
                "Brown leather loafers";


        } else {

            outfit.top =
                "Light-blue cotton-linen dress shirt";

            outfit.bottom =
                "Stone lightweight tailored trousers";

            outfit.midLayer =
                "Carry an unlined navy blazer";

            outfit.outerLayer =
                "No outer coat";

            outfit.shoes =
                "Breathable brown leather loafers";
        }
    }


    /* ---------------------------------
       CLASS
    --------------------------------- */

    else if (occasion === "Class") {

        headline =
            "Comfortable for class while still looking put together.";


        if (feelsLike <= 35) {

            outfit.top =
                "Grey long-sleeve thermal shirt";

            outfit.bottom =
                "Dark straight-leg jeans";

            outfit.midLayer =
                "Navy crewneck sweater";

            outfit.outerLayer =
                "Black insulated parka";

            outfit.shoes =
                "Water-resistant casual boots";


        } else if (feelsLike <= 50) {

            outfit.top =
                "White cotton T-shirt";

            outfit.bottom =
                "Dark straight-leg jeans";

            outfit.midLayer =
                "Heather-grey crewneck sweater";

            outfit.outerLayer =
                "Olive bomber jacket";

            outfit.shoes =
                "Clean leather sneakers";


        } else if (feelsLike <= 65) {

            outfit.top =
                "White cotton T-shirt";

            outfit.bottom =
                "Straight-leg blue jeans";

            outfit.midLayer =
                "Blue cotton overshirt";

            outfit.outerLayer =
                "Lightweight bomber jacket";

            outfit.shoes =
                "Clean white sneakers";


        } else if (feelsLike <= 78) {

            outfit.top =
                "Navy cotton T-shirt";

            outfit.bottom =
                "Lightweight tan chinos";

            outfit.midLayer =
                "Light-blue cotton overshirt";

            outfit.outerLayer =
                "No heavy outer layer";

            outfit.shoes =
                "Clean white sneakers";


        } else {

            outfit.top =
                "Breathable white cotton T-shirt";

            outfit.bottom =
                "Lightweight tan chinos";

            outfit.midLayer =
                "No mid layer";

            outfit.outerLayer =
                "No outer layer";

            outfit.shoes =
                "Breathable mesh sneakers";
        }
    }


    /* ---------------------------------
       OUTDOOR
    --------------------------------- */

    else if (occasion === "Outdoor") {

        headline =
            "A practical outdoor outfit built around the actual conditions.";


        if (feelsLike <= 35) {

            outfit.top =
                "Thermal long-sleeve base layer";

            outfit.bottom =
                "Lined hiking pants";

            outfit.midLayer =
                "Quarter-zip fleece";

            outfit.outerLayer =
                "Insulated weather-resistant shell jacket";

            outfit.shoes =
                "Waterproof hiking boots";


        } else if (feelsLike <= 50) {

            outfit.top =
                "Merino long-sleeve base layer";

            outfit.bottom =
                "Durable hiking trousers";

            outfit.midLayer =
                "Light fleece quarter-zip";

            outfit.outerLayer =
                "Water-resistant hiking shell";

            outfit.shoes =
                "Water-resistant trail shoes";


        } else if (feelsLike <= 65) {

            outfit.top =
                "Moisture-wicking performance T-shirt";

            outfit.bottom =
                "Lightweight hiking trousers";

            outfit.midLayer =
                "Thin fleece layer";

            outfit.outerLayer =
                "Packable windbreaker";

            outfit.shoes =
                "Trail-running sneakers";


        } else if (feelsLike <= 78) {

            outfit.top =
                "Breathable performance T-shirt";

            outfit.bottom =
                "Lightweight outdoor pants";

            outfit.midLayer =
                "No mid layer";

            outfit.outerLayer =
                "Packable lightweight shell";

            outfit.shoes =
                "Breathable trail sneakers";


        } else {

            outfit.top =
                "Light moisture-wicking performance shirt";

            outfit.bottom =
                "Breathable outdoor shorts";

            outfit.midLayer =
                "No mid layer";

            outfit.outerLayer =
                "Light packable sun layer";

            outfit.shoes =
                "Breathable trail sneakers";
        }
    }


    /* ---------------------------------
       CASUAL
    --------------------------------- */

    else {

        headline =
            "A complete casual outfit matched to the local forecast.";


        if (feelsLike <= 35) {

            outfit.top =
                "Cream knit sweater";

            outfit.bottom =
                "Dark indigo jeans";

            outfit.midLayer =
                "Light thermal undershirt";

            outfit.outerLayer =
                "Camel wool coat";

            outfit.shoes =
                "Dark brown Chelsea boots";


        } else if (feelsLike <= 50) {

            outfit.top =
                "White heavyweight T-shirt";

            outfit.bottom =
                "Dark straight-leg jeans";

            outfit.midLayer =
                "Navy flannel overshirt";

            outfit.outerLayer =
                "Brown bomber jacket";

            outfit.shoes =
                "Neutral leather sneakers";


        } else if (feelsLike <= 65) {

            outfit.top =
                "White cotton T-shirt";

            outfit.bottom =
                "Olive chinos";

            outfit.midLayer =
                "Navy cotton overshirt";

            outfit.outerLayer =
                "Lightweight Harrington jacket";

            outfit.shoes =
                "Clean white sneakers";


        } else if (feelsLike <= 78) {

            outfit.top =
                "Light-blue linen-blend camp-collar shirt";

            outfit.bottom =
                "Beige lightweight chinos";

            outfit.midLayer =
                "No mid layer";

            outfit.outerLayer =
                "Optional lightweight overshirt";

            outfit.shoes =
                "White canvas sneakers";


        } else {

            outfit.top =
                "White lightweight linen shirt";

            outfit.bottom =
                "Beige lightweight chinos or tailored shorts";

            outfit.midLayer =
                "No mid layer";

            outfit.outerLayer =
                "No outer layer";

            outfit.shoes =
                "Breathable canvas sneakers";
        }
    }


    /* ---------------------------------
       HUMID CONDITIONS
    --------------------------------- */

    if (
        weather.humidity >= 75 &&
        feelsLike >= 70
    ) {

        if (occasion === "Interview") {

            outfit.top =
                "Light-blue lightweight cotton-linen dress shirt";


        } else if (occasion === "Class") {

            outfit.top =
                "Breathable lightweight cotton T-shirt";


        } else if (occasion === "Outdoor") {

            outfit.top =
                "Moisture-wicking performance T-shirt";


        } else {

            outfit.top =
                "Lightweight linen-blend shirt";
        }


        reasons.push(
            areaName +
            " is forecast to be humid at about " +
            Math.round(
                weather.humidity
            ) +
            "%, so the top uses a lighter, more breathable fabric."
        );
    }


    /* ---------------------------------
       SNOW
    --------------------------------- */

    const snowExpected =
        weather.snowfall > 0 ||
        (
            weather.weatherCode >= 71 &&
            weather.weatherCode <= 77
        ) ||
        (
            weather.weatherCode >= 85 &&
            weather.weatherCode <= 86
        );


    if (snowExpected) {

        if (occasion === "Interview") {

            outfit.outerLayer =
                "Dark water-resistant wool overcoat";

            outfit.shoes =
                "Black water-resistant leather boots";


        } else if (occasion === "Outdoor") {

            outfit.outerLayer =
                "Insulated waterproof shell jacket";

            outfit.shoes =
                "Insulated waterproof hiking boots";


        } else {

            outfit.outerLayer =
                "Insulated water-resistant coat";

            outfit.shoes =
                "Waterproof boots";
        }


        addAccessory(
            outfit.accessories,
            "Warm wool socks"
        );


        addAccessory(
            outfit.accessories,
            "Gloves"
        );


        reasons.push(
            "Snow is expected around " +
            areaName +
            ", so waterproof footwear and an insulated outer layer are important."
        );
    }


    /* ---------------------------------
       RAIN
    --------------------------------- */

    if (weather.rain >= 60) {

        if (occasion === "Interview") {

            if (!snowExpected) {

                outfit.outerLayer =
                    feelsLike <= 55
                        ? "Structured water-resistant trench coat"
                        : "Lightweight water-resistant trench coat";
            }


            outfit.shoes =
                "Black water-resistant leather loafers or derby shoes";


        } else if (occasion === "Outdoor") {

            outfit.outerLayer =
                "Waterproof breathable shell jacket";

            outfit.shoes =
                "Water-resistant trail shoes";


        } else {

            if (!snowExpected) {

                outfit.outerLayer =
                    "Lightweight rain-resistant jacket";
            }


            outfit.shoes =
                "Rain-ready sneakers or boots";
        }


        if (weather.wind < 25) {

            addAccessory(
                outfit.accessories,
                "Compact umbrella"
            );


        } else {

            addAccessory(
                outfit.accessories,
                "Hooded rain protection"
            );
        }


        reasons.push(
            "The rain chance in " +
            areaName +
            " is around " +
            Math.round(
                weather.rain
            ) +
            "%, so the outfit includes rain protection."
        );


    } else if (weather.rain >= 30) {

        addAccessory(
            outfit.accessories,
            "Compact umbrella"
        );


        reasons.push(
            "There is a moderate chance of rain in " +
            areaName +
            ", so a compact umbrella is worth bringing."
        );
    }


    /* ---------------------------------
       WIND
    --------------------------------- */

    if (weather.wind >= 20) {

        if (
            outfit.outerLayer ===
            "No outer layer" ||
            outfit.outerLayer ===
            "No outer coat" ||
            outfit.outerLayer ===
            "No heavy outer layer"
        ) {

            outfit.outerLayer =
                "Lightweight wind-resistant jacket";
        }


        reasons.push(
            "Winds around " +
            Math.round(
                weather.wind
            ) +
            " mph make a wind-blocking layer useful."
        );
    }


    /* ---------------------------------
       VERY COLD
    --------------------------------- */

    if (feelsLike <= 32) {

        addAccessory(
            outfit.accessories,
            "Warm scarf"
        );


        addAccessory(
            outfit.accessories,
            "Gloves"
        );
    }


    /* ---------------------------------
       HOT
    --------------------------------- */

    if (feelsLike >= 80) {

        addAccessory(
            outfit.accessories,
            "Water bottle"
        );
    }


    /* ---------------------------------
       SUNNY
    --------------------------------- */

    if (
        feelsLike >= 65 &&
        (
            weather.weatherCode === 0 ||
            weather.weatherCode === 1
        )
    ) {

        addAccessory(
            outfit.accessories,
            "Sunglasses"
        );
    }


    /* ---------------------------------
       THUNDERSTORM
    --------------------------------- */

    if (weather.weatherCode >= 95) {

        addAccessory(
            outfit.accessories,
            "Check conditions again before leaving"
        );


        reasons.push(
            "Thunderstorms are possible, so check the latest local conditions before heading out."
        );
    }


    /* ---------------------------------
       MAIN LOCAL EXPLANATION
    --------------------------------- */

    reasons.unshift(
        "At your selected time in " +
        areaName +
        ", it should feel like " +
        Math.round(
            feelsLike
        ) +
        "°F with about " +
        Math.round(
            weather.humidity
        ) +
        "% humidity, a " +
        Math.round(
            weather.rain
        ) +
        "% precipitation chance, and winds around " +
        Math.round(
            weather.wind
        ) +
        " mph."
    );


    return {

        headline:
            headline,

        outfit:
            outfit,

        reason:
            reasons.join(" "),

        weatherDescription:
            getWeatherDescription(
                weather.weatherCode
            )
    };
}


function addAccessory(
    accessories,
    item
) {

    if (
        !accessories.includes(
            item
        )
    ) {

        accessories.push(
            item
        );
    }
}


/* ---------------------------------
   WMO WEATHER DESCRIPTION
--------------------------------- */

function getWeatherDescription(
    code
) {

    if (code === 0) {

        return "Clear sky";
    }


    if (code === 1) {

        return "Mainly clear";
    }


    if (code === 2) {

        return "Partly cloudy";
    }


    if (code === 3) {

        return "Overcast";
    }


    if (
        code === 45 ||
        code === 48
    ) {

        return "Fog";
    }


    if (
        code >= 51 &&
        code <= 57
    ) {

        return "Drizzle";
    }


    if (
        code >= 61 &&
        code <= 67
    ) {

        return "Rain";
    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return "Snow";
    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "Rain showers";
    }


    if (
        code >= 85 &&
        code <= 86
    ) {

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

    resultArea.innerHTML =
        "";


    const advice =
        createRecommendation(
            weather,
            occasion,
            location
        );


    const brief =
        document.createElement(
            "div"
        );


    brief.className =
        "weather-brief";


    /* RECOMMENDATION */

    const recommendationPanel =
        document.createElement(
            "article"
        );


    recommendationPanel.className =
        "recommendation-panel";


    const label =
        document.createElement(
            "p"
        );


    label.className =
        "result-label";


    label.textContent =
        "YOUR EXACT OUTFIT";


    const occasionLine =
        document.createElement(
            "p"
        );


    occasionLine.className =
        "occasion-line";


    occasionLine.textContent =
        occasion;


    const locationName =
        document.createElement(
            "h3"
        );


    locationName.className =
        "result-location";


    locationName.textContent =
        getAreaName(
            location
        );


    const eventLine =
        document.createElement(
            "p"
        );


    eventLine.className =
        "event-time-line";


    eventLine.textContent =
        formatReadableDate(
            eventDate
        ) +
        " · " +
        formatReadableTime(
            eventTime
        ) +
        " · DESTINATION LOCAL TIME";


    const condition =
        document.createElement(
            "p"
        );


    condition.className =
        "result-condition";


    condition.textContent =
        advice.weatherDescription;


    const headline =
        document.createElement(
            "p"
        );


    headline.className =
        "recommendation-text";


    headline.textContent =
        advice.headline;


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
        headline
    );


    /* OUTFIT */

    const outfitSection =
        document.createElement(
            "section"
        );


    outfitSection.className =
        "outfit-section";


    const outfitTitle =
        document.createElement(
            "p"
        );


    outfitTitle.className =
        "outfit-title";


    outfitTitle.textContent =
        "COMPLETE OUTFIT";


    const outfitGrid =
        document.createElement(
            "div"
        );


    outfitGrid.className =
        "outfit-grid";


    addOutfitRow(
        outfitGrid,
        "Top",
        advice.outfit.top
    );


    addOutfitRow(
        outfitGrid,
        "Bottom",
        advice.outfit.bottom
    );


    addOutfitRow(
        outfitGrid,
        "Mid Layer",
        advice.outfit.midLayer
    );


    addOutfitRow(
        outfitGrid,
        "Outer Layer",
        advice.outfit.outerLayer
    );


    addOutfitRow(
        outfitGrid,
        "Shoes",
        advice.outfit.shoes
    );


    addOutfitRow(
        outfitGrid,
        "Accessories",
        advice.outfit.accessories
            .length > 0
            ? advice.outfit.accessories
                .join(", ")
            : "None needed"
    );


    outfitSection.appendChild(
        outfitTitle
    );


    outfitSection.appendChild(
        outfitGrid
    );


    recommendationPanel.appendChild(
        outfitSection
    );


    const localNote =
        document.createElement(
            "p"
        );


    localNote.className =
        "local-weather-note";


    localNote.textContent =
        advice.reason;


    recommendationPanel.appendChild(
        localNote
    );


    /* FORECAST PANEL */

    const forecastPanel =
        document.createElement(
            "aside"
        );


    forecastPanel.className =
        "forecast-panel";


    const forecastTitle =
        document.createElement(
            "p"
        );


    forecastTitle.className =
        "forecast-title";


    forecastTitle.textContent =
        "LOCAL CONDITIONS";


    forecastPanel.appendChild(
        forecastTitle
    );


    addMetric(
        forecastPanel,
        "Temperature",
        Math.round(
            weather.temperature
        ) +
        "°F"
    );


    addMetric(
        forecastPanel,
        "Feels Like",
        Math.round(
            weather.apparentTemperature
        ) +
        "°F"
    );


    addMetric(
        forecastPanel,
        "Humidity",
        Math.round(
            weather.humidity
        ) +
        "%"
    );


    addMetric(
        forecastPanel,
        "Precipitation",
        Math.round(
            weather.rain
        ) +
        "%"
    );


    addMetric(
        forecastPanel,
        "Wind",
        Math.round(
            weather.wind
        ) +
        " mph"
    );


    addMetric(
        forecastPanel,
        "Snow",
        weather.snowfall > 0
            ? weather.snowfall
                .toFixed(1) +
                " cm"
            : "None"
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


    resultArea.appendChild(
        brief
    );


    /* BEFORE LEAVING */

    const beforeYouLeave =
        document.createElement(
            "section"
        );


    beforeYouLeave.className =
        "before-you-leave";


    const beforeTitle =
        document.createElement(
            "h3"
        );


    beforeTitle.textContent =
        "BEFORE YOU LEAVE";


    const beforeText =
        document.createElement(
            "p"
        );


    if (
        advice.outfit.accessories
            .length > 0
    ) {

        beforeText.textContent =
            "Bring: " +
            advice.outfit.accessories
                .join(", ") +
            ".";


    } else {

        beforeText.textContent =
            "No additional weather accessories are needed for this forecast.";
    }


    beforeYouLeave.appendChild(
        beforeTitle
    );


    beforeYouLeave.appendChild(
        beforeText
    );


    resultArea.appendChild(
        beforeYouLeave
    );
}


/* ---------------------------------
   OUTFIT ROW
--------------------------------- */

function addOutfitRow(
    parent,
    labelText,
    valueText
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "outfit-row";


    const label =
        document.createElement(
            "span"
        );


    label.className =
        "outfit-label";


    label.textContent =
        labelText;


    const value =
        document.createElement(
            "span"
        );


    value.className =
        "outfit-value";


    value.textContent =
        valueText;


    row.appendChild(
        label
    );


    row.appendChild(
        value
    );


    parent.appendChild(
        row
    );
}


/* ---------------------------------
   FORECAST METRIC
--------------------------------- */

function addMetric(
    parent,
    labelText,
    valueText
) {

    const metric =
        document.createElement(
            "div"
        );


    metric.className =
        "weather-metric";


    const label =
        document.createElement(
            "span"
        );


    label.className =
        "metric-label";


    label.textContent =
        labelText;


    const value =
        document.createElement(
            "span"
        );


    value.className =
        "metric-value";


    value.textContent =
        valueText;


    metric.appendChild(
        label
    );


    metric.appendChild(
        value
    );


    parent.appendChild(
        metric
    );
}


/* ---------------------------------
   DATE / TIME FORMATTING
--------------------------------- */

function formatReadableDate(
    dateValue
) {

    const parts =
        dateValue.split("-");


    const date =
        new Date(
            Number(
                parts[0]
            ),
            Number(
                parts[1]
            ) - 1,
            Number(
                parts[2]
            )
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month:
                "long",

            day:
                "numeric",

            year:
                "numeric"
        }
    );
}


function formatReadableTime(
    timeValue
) {

    const parts =
        timeValue.split(":");


    let hours =
        Number(
            parts[0]
        );


    const minutes =
        parts[1];


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12;


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
        forecastTime
            .split("T")[1];


    return formatReadableTime(
        time
    );
}


/* ---------------------------------
   STATES
--------------------------------- */

function showLoading() {

    showStatus(
        "loading",
        "Preparing your outfit...",
        "Checking the destination's local forecast and working out what to wear."
    );
}


function showNoResults() {

    showStatus(
        "error",
        "No matching location was found.",
        "Try the city again or add its state, region, or country. Example: Boston, MA."
    );
}


function showError() {

    showStatus(
        "error",
        "The forecast could not be loaded.",
        "Check your connection and make sure the selected date is within the available forecast range."
    );
}


function showStatus(
    type,
    titleText,
    messageText
) {

    resultArea.innerHTML =
        "";


    const status =
        document.createElement(
            "div"
        );


    status.className =
        "status-state " +
        type;


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        titleText;


    const message =
        document.createElement(
            "p"
        );


    message.textContent =
        messageText;


    status.appendChild(
        title
    );


    status.appendChild(
        message
    );


    resultArea.appendChild(
        status
    );
}


/* ---------------------------------
   FORM ERROR
--------------------------------- */

function clearFormMessage() {

    formMessage.textContent =
        "";


    formMessage.className =
        "form-message";
}


function showFormError(message) {

    formMessage.textContent =
        message;


    formMessage.className =
        "form-message error";
}

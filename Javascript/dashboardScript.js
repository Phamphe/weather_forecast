let currentTemp = null; // Global variable to store temperature in Celsius

const userLocation = document.getElementById("userLocation"),
  converter = document.getElementById("converter"),
  weatherIcon = document.querySelector(".weatherIcon"),
  temperature = document.querySelector(".temperature"),
  feelsLike = document.querySelector(".feelsLike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),

  HValue = document.getElementById("HValue"),
  WValue = document.getElementById("WValue"),
  SRValue = document.getElementById("SRValue"),
  SSValue = document.getElementById("SSValue"),
  CValue = document.getElementById("CValue"),
  UVValue = document.getElementById("UVValue"),
  PValue = document.getElementById("PValue"),

  Forecast = document.querySelector(".Forecast");

const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=64f9716a1abb4f99787cef9d9702144d&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/3.0/onecall?appid=64f9716a1abb4f99787cef9d9702144d&exclude=minutely&units=metric&`;

function findUserLocation() {
  Forecast.innerHTML = "";
  // Fetch current weather using the 2.5 endpoint
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${userLocation.value}&units=metric&appid=64f9716a1abb4f99787cef9d9702144d`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== 200) {
        alert(data.message);
        return;
      }
      console.log(data);

      city.innerHTML = data.name + ", " + data.sys.country;
      weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

      // Store the raw temperature in Celsius for later conversion
      currentTemp = data.main.temp;
      temperature.innerHTML = TempConverter(currentTemp);

      // Fetch additional weather data using the 3.0 One Call API
      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely&units=metric&appid=64f9716a1abb4f99787cef9d9702144d`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Update additional fields
          feelsLike.innerHTML = "Feels like " + data.current.feels_like;
          description.innerHTML =
            `<i class="fa-brands fa-cloudversify"></i> &nbsp;` +
            data.current.weather[0].description;
          const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };

          date.innerHTML = getLongFormattedDateTime(
            data.current.dt,
            data.timezone_offset,
            options
          );

          HValue.innerHTML =
            Math.round(data.current.humidity) + "<span>%</span>";
          WValue.innerHTML = data.current.wind_speed + "<span>m/s</span>";

          const options1 = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          SRValue.innerHTML = getLongFormattedDateTime(
            data.current.sunrise,
            data.timezone_offset,
            options1
          );
          SSValue.innerHTML = getLongFormattedDateTime(
            data.current.sunset,
            data.timezone_offset,
            options1
          );

          CValue.innerHTML = data.current.clouds + "<span>%</span>";
          UVValue.innerHTML = data.current.uvi;
          PValue.innerHTML = data.current.pressure + "<span>hPa</span>";

          // Process daily forecast
          data.daily.forEach((weather) => {
            let div = document.createElement("div");
            const options = {
              weekday: "long",
              month: "long",
              day: "numeric",
            };

            let daily = getLongFormattedDateTime(weather.dt, 0, options).split(
              " at "
            );
            div.innerHTML = daily[0];
            div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>`;
            div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description
              }</p>`;
            // Create a span with data attributes to store raw Celsius values
            div.innerHTML += `<span class="forecast-temp" data-raw-min="${weather.temp.min
              }" data-raw-max="${weather.temp.max}">
                                <span>${TempConverter(weather.temp.min)}</span>
                                <span>${TempConverter(weather.temp.max)}</span>
                              </span>`;
            Forecast.append(div);
          });
        });
    });
}

function TempConverter(temp) {
  let tempValue = Math.round(temp);
  let message = "";
  if (converter.value === "°C") {
    message = tempValue + "<span>\xB0C</span>";
  } else {
    let ctof = Math.round((tempValue * 9) / 5 + 32);
    message = ctof + "<span>\xB0F</span>";
  }
  return message;
}

// Listen for changes in the unit selection to update temperature displays dynamically.
converter.addEventListener("change", () => {
  if (currentTemp !== null) {
    temperature.innerHTML = TempConverter(currentTemp);
  }
  // Update all forecast temperatures
  document.querySelectorAll(".forecast-temp").forEach((el) => {
    let rawMin = parseFloat(el.getAttribute("data-raw-min"));
    let rawMax = parseFloat(el.getAttribute("data-raw-max"));
    el.innerHTML = `<span>${TempConverter(rawMin)}</span>
                      <span>${TempConverter(rawMax)}</span>`;
  });
});

function formatUnixTime(dtValue, offset, options = {}) {
  const date = new Date((dtValue + offset) * 1000);
  return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}

function getLongFormattedDateTime(dtValue, offSet, options) {
  return formatUnixTime(dtValue, offSet, options);
}


// Get modal elements
const modal = document.getElementById("anomalyModal");
const closeBtn = document.getElementsByClassName("close")[0];

// Close modal when clicking close icon
closeBtn.onclick = function () {
  modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


//Searching weather anomalies for any previous date and 7 day future anomalies
function searchAnomalies() {
  const date = document.getElementById("anomalyDate").value;
  const location = document.getElementById("anomalyLocation").value;

  if (!date || !location) {
    alert("Please select both date and location");
    return;
  }

  // Initially get coordinates for the location
  fetch(`${WEATHER_API_ENDPOINT}${location}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      const { lat, lon } = data.coord;
      const selectedDate = new Date(date);
      const timestamp = Math.floor(selectedDate.getTime() / 1000);
      const cityName = data.name;
      const currentDate = new Date();
      
      // Reset hours to compare just the dates
      currentDate.setHours(0, 0, 0, 0);
      const compareDate = new Date(selectedDate);
      compareDate.setHours(0, 0, 0, 0);
      
      // Days difference calculation between selected date and today
      const daysDifference = Math.round((compareDate - currentDate) / (1000 * 60 * 60 * 24));
      
      // If selected date is today or in the past, use time-machine endpoint
      if (daysDifference <= 0) {
        return fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=64f9716a1abb4f99787cef9d9702144d&units=metric`)
          .then(response => response.json())
          .then(weatherData => {
            displayPastAnomalies(weatherData, cityName, date);
          });
      } 
      // If selected date is in the future (within forecast range)
      else if (daysDifference <= 16) { // Assuming 7-day forecast is available
        return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current&appid=64f9716a1abb4f99787cef9d9702144d&units=metric`)
          .then(response => response.json())
          .then(weatherData => {
            displayFutureAnomalies(weatherData, cityName, date, daysDifference);
          });
      } 
      // If selected date is too far in the future
      else {
        throw new Error(`Weather forecasts are only available up to 7 days in the future.`);
      }
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}




// Function to display past weather anomalies
function displayPastAnomalies(data, cityName, searchDate) {
  const resultsDiv = document.getElementById("anomalyResults");
  resultsDiv.innerHTML = '';

  if (!data.data || data.data.length === 0) {
    resultsDiv.innerHTML = `<div class="anomaly-error">No weather data available for ${cityName} on ${new Date(searchDate).toLocaleDateString()}</div>`;
    modal.style.display = "flex";
    return;
  }

  const weather = data.data[0];
  const html = `
      <div class="anomaly-data">
          <h3>Historical Weather for ${cityName}</h3>
          
          <div class="anomaly-grid">
              <div class="anomaly-item">
                  <h4>Temperature</h4>
                  <p>${weather.temp}°C</p>
              </div>
              <div class="anomaly-item">
                  <h4>Humidity</h4>
                  <p>${weather.humidity}%</p>
              </div>
              <div class="anomaly-item">
                  <h4>Wind Speed</h4>
                  <p>${weather.wind_speed} m/s</p>
              </div>
              <div class="anomaly-item">
                  <h4>Weather</h4>
                  <p>${weather.weather[0].description}</p>
              </div>
          </div>
          <div class="anomaly-details">
              <p class="date-info">Date: ${new Date(weather.dt * 1000).toLocaleDateString()}</p>
              <p>Pressure: ${weather.pressure} hPa</p>
              <p>Clouds: ${weather.clouds}%</p>
              <p>Dew Point: ${weather.dew_point}°C</p>
              <p>UV Index: ${weather.uvi}</p>
              <p>Visibility: ${weather.visibility} meters</p>
          </div>
      </div>
  `;

  resultsDiv.innerHTML = html;
  modal.style.display = "flex";
}


// Function to display future 7 days weather forecast
function displayFutureAnomalies(data, cityName, searchDate, dayIndex) {
  const resultsDiv = document.getElementById("anomalyResults");
  resultsDiv.innerHTML = '';

  if (!data.daily || data.daily.length <= dayIndex) {
    resultsDiv.innerHTML = `<div class="anomaly-error">No forecast data available for ${cityName} on ${new Date(searchDate).toLocaleDateString()}</div>`;
    modal.style.display = "flex";
    return;
  }

  const forecast = data.daily[dayIndex];
  const html = `
      <div class="anomaly-data">
          <h3>Weather Forecast for ${cityName}</h3>
          
          <div class="anomaly-grid">
              <div class="anomaly-item">
                  <h4>Temperature</h4>
                  <p>Day: ${forecast.temp.day}°C</p>
                  <p>Min: ${forecast.temp.min}°C</p>
                  <p>Max: ${forecast.temp.max}°C</p>
              </div>
              <div class="anomaly-item">
                  <h4>Humidity</h4>
                  <p>${forecast.humidity}%</p>
              </div>
              <div class="anomaly-item">
                  <h4>Wind Speed</h4>
                  <p>${forecast.wind_speed} m/s</p>
              </div>
              <div class="anomaly-item">
                  <h4>Weather</h4>
                  <p>${forecast.weather[0].description}</p>
              </div>
          </div>
          <div class="anomaly-details">
              <p class="date-info">Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
              <p>Pressure: ${forecast.pressure} hPa</p>
              <p>Clouds: ${forecast.clouds}%</p>
              <p>Dew Point: ${forecast.dew_point}°C</p>
              <p>UV Index: ${forecast.uvi}</p>
              <p>Precipitation Probability: ${(forecast.pop * 100).toFixed(0)}%</p>
          </div>
      </div>
  `;

  resultsDiv.innerHTML = html;
  modal.style.display = "flex";
}







/*---------------Site Tour Guide----------------*/


const tourSteps = [
  {
    element: '.input-group',
    title: 'Search Current Weather',
    content: 'Search current weather in your city or where you are heading next.',
    position: 'bottom'
  },
  {
    element: '.search-container',
    title: 'Historical Weather Search',
    content: 'Search weather forecasts for different dates and cities to plan ahead or review past conditions.',
    position: 'top'
  },
  {
    element: '.Highlights',
    title: 'Weather Highlights',
    content: 'View detailed weather metrics including humidity, wind speed, UV index, and more.Searched from the sidebar',
    position: 'top'
  },
  {
    element: '.Forecast',
    title: 'Weekly Forecast',
    content: 'Check the weather forecast under [Weekly Forecast] for the upcoming week to better plan your activities.',
    position: 'bottom'
  }
];

// function end() {
//   this.overlay.remove();
//   if (this.tooltip) {
//     this.tooltip.remove();
//   }
//   document.querySelectorAll('.tour-highlight').forEach(el => {
//     el.classList.remove('tour-highlight');
//   });
//   localStorage.setItem('weatherTourCompleted', 'true');
// }

class WeatherTour {
  constructor(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.overlay = null;
    this.tooltip = null;
  }

  start() {
    // tour if it was completed
    if (localStorage.getItem('weatherTourCompleted')) {
      return;
    }

    this.createOverlay();
    this.showStep(0);
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'tour-overlay';
    document.body.appendChild(this.overlay);
  }

  createTooltip(step) {
    const element = document.querySelector(step.element);
    if (!element) return;

    // Remove previous tooltip if exists
    if (this.tooltip) {
      this.tooltip.remove();
    }

    // Remove previous highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });

    // Create new tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = `tour-tooltip ${step.position}`;

    // Add content for pop up
    this.tooltip.innerHTML = `
      <h3 style="margin-bottom: 10px; color: #007cba;">${step.title}</h3>
      <p style="margin-bottom: 15px;">${step.content}</p>
      <div class="tour-buttons">
        <button class="tour-button skip" onclick="tour.end()">Skip Tour</button>
        <button class="tour-button" onclick="tour.nextStep()">
          ${this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    `;

    // Position tooltip
    const elementRect = element.getBoundingClientRect();
    const tooltipPosition = this.calculateTooltipPosition(elementRect, step.position);

    Object.assign(this.tooltip.style, {
      left: tooltipPosition.left + 'px',
      top: tooltipPosition.top + 'px'
    });

    // Highlight current element
    element.classList.add('tour-highlight');

    document.body.appendChild(this.tooltip);
  }

  calculateTooltipPosition(elementRect, position) {
    const offset = 20;
    let left = elementRect.left + (elementRect.width / 2) - 150;
    let top;

    if (position === 'bottom') {
      top = elementRect.bottom + offset;
    } else {
      top = elementRect.top - offset - 180;
    }

    // Tooltip stays within viewport
    left = Math.max(20, Math.min(left, window.innerWidth - 320));
    top = Math.max(20, Math.min(top, window.innerHeight - 200));

    return { left, top };
  }

  showStep(index) {
    this.currentStep = index;
    const step = this.steps[index];
    this.createTooltip(step);
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.end();
    }
  }

  end() {
    this.overlay.remove();
    if (this.tooltip) {
      this.tooltip.remove();
    }
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    localStorage.setItem('weatherTourCompleted', 'true');
    
 
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}




// This session is for localStorage purposes
// Clear cache or browsing history for the session to restart [Past 24 hrs or few hours]

let tour;
document.addEventListener('DOMContentLoaded', () => {
  tour = new WeatherTour(tourSteps);

  // Force tour to start (for testing)
  setTimeout(() => tour.start(), 1000);
});


// Adding function to detect user's location
function detectUserLocation() {
  
  document.querySelector('.weather-input').classList.add('weather-loading');
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Fetch city name and weather data using coordinates
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=64f9716a1abb4f99787cef9d9702144d`)
          .then(response => response.json())
          .then(data => {
            // Update the search input with the detected city name
            userLocation.value = data.name;
            
            // Loading weather data for the detected location
            findUserLocationByCoords(lat, lon);
          })
          .catch(error => {
            console.error("Error fetching location data:", error);
            document.querySelector('.weather-input').classList.remove('weather-loading');
            alert("Could not determine your location. Please search manually.");
          });
      },
     
      (error) => {
        console.error("Geolocation error:", error);
        document.querySelector('.weather-input').classList.remove('weather-loading');
        alert("Could not determine your location. Please search manually.");
      },
      
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    alert("Geolocation is not supported by this browser. Please search manually.");
    document.querySelector('.weather-input').classList.remove('weather-loading');
  }
}


function findUserLocationByCoords(lat, lon) {
  Forecast.innerHTML = "";
  
  // Fetching current weather using coordinates
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=64f9716a1abb4f99787cef9d9702144d`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== 200) {
        alert(data.message);
        document.querySelector('.weather-input').classList.remove('weather-loading');
        return;
      }
      
      city.innerHTML = data.name + ", " + data.sys.country;
      weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

      // Store the raw temperature in Celsius for later conversion
      currentTemp = data.main.temp;
      temperature.innerHTML = TempConverter(currentTemp);

      // Fetch additional weather data using the 3.0 One Call API
      fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=64f9716a1abb4f99787cef9d9702144d`)
        .then((response) => response.json())
        .then((data) => {
          // Update additional fields
          feelsLike.innerHTML = "Feels like " + data.current.feels_like;
          description.innerHTML =
            `<i class="fa-brands fa-cloudversify"></i> &nbsp;` +
            data.current.weather[0].description;
          const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };

          date.innerHTML = getLongFormattedDateTime(
            data.current.dt,
            data.timezone_offset,
            options
          );

          HValue.innerHTML =
            Math.round(data.current.humidity) + "<span>%</span>";
          WValue.innerHTML = data.current.wind_speed + "<span>m/s</span>";

          const options1 = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          SRValue.innerHTML = getLongFormattedDateTime(
            data.current.sunrise,
            data.timezone_offset,
            options1
          );
          SSValue.innerHTML = getLongFormattedDateTime(
            data.current.sunset,
            data.timezone_offset,
            options1
          );

          CValue.innerHTML = data.current.clouds + "<span>%</span>";
          UVValue.innerHTML = data.current.uvi;
          PValue.innerHTML = data.current.pressure + "<span>hPa</span>";

          // Processing daily forecast
          data.daily.forEach((weather) => {
            let div = document.createElement("div");
            const options = {
              weekday: "long",
              month: "long",
              day: "numeric",
            };

            let daily = getLongFormattedDateTime(weather.dt, 0, options).split(
              " at "
            );
            div.innerHTML = daily[0];
            div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>`;
            div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}</p>`;
            
            div.innerHTML += `<span class="forecast-temp" data-raw-min="${weather.temp.min}" data-raw-max="${weather.temp.max}">
                                <span>${TempConverter(weather.temp.min)}</span>
                                <span>${TempConverter(weather.temp.max)}</span>
                              </span>`;
            Forecast.append(div);
          });
          
          // Removed loading state
          document.querySelector('.weather-input').classList.remove('weather-loading');
          document.querySelector('.weather-input').classList.add('weather-loaded');
        })
        .catch(error => {
          console.error("Error fetching detailed weather:", error);
          document.querySelector('.weather-input').classList.remove('weather-loading');
        });
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
      document.querySelector('.weather-input').classList.remove('weather-loading');
    });
}

// Calling the geolocation function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  tour = new WeatherTour(tourSteps);
  
  // Start tour after a delay
  setTimeout(() => tour.start(), 1000);
  
  // Detection of user location on page load
  detectUserLocation();
});


document.querySelector('.fa-search').addEventListener('click', findUserLocation);



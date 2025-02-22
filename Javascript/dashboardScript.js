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

function searchAnomalies() {
  const date = document.getElementById("anomalyDate").value;
  const location = document.getElementById("anomalyLocation").value;

  if (!date || !location) {
    alert("Please select both date and location");
    return;
  }

  // First get coordinates for the location
  fetch(`${WEATHER_API_ENDPOINT}${location}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      const { lat, lon } = data.coord;
      const timestamp = Math.floor(new Date(date).getTime() / 1000);
      const cityName = data.name; // Store the city name


      return fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=64f9716a1abb4f99787cef9d9702144d&units=metric`)
        .then(response => response.json())
        .then(weatherData => {
          // Pass both city name and weather data
          displayAnomalies(weatherData, cityName);
        });
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}

// Update the modal display function
function displayAnomalies(data, cityName) {
  const resultsDiv = document.getElementById("anomalyResults");
  resultsDiv.innerHTML = '';

  const weather = data.data[0];
  const html = `
      <div class="anomaly-data">
          <h3>Weather Summary for ${cityName}</h3>
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



# Weather R'US - Weather Tracking Web App

## 📌 Overview

Weather R’US is a web application that provides real-time weather updates and historical weather data for various locations.
The app fetches weather data from the OpenWeather API and displays it dynamically on the dashboard. Users can search for a city and retrieve past weather conditions for a selected date.

## 🌟 Features

### 🔹 Login & Signup

- The landing page consists of a toggle form between **Sign In** and **Sign Up**.
- Users can switch between the forms but no authentication is implemented.
- Upon clicking **Sign In**, users are redirected to `dashboard.html`.
- Mobile Responsiveness: Mobile, Tablet and Desktop

### 🔹 Dashboard

- Displays real-time weather conditions based on the searched location.
- Uses OpenWeather API to fetch live data, including:
  - Temperature
  - Humidity
  - Wind Speed
  - Cloud Coverage
  - UV Index
  - Atmospheric Pressure
- The **unit converter** allows users to switch between Celsius (°C) and Fahrenheit (°F).
- A **dropdown menu** next to the user profile provides options for settings and logout.
- A **dashboard tour** makes it easier for users to interact with the webapp.

### 🔹 Historical Weather Search

- Users can **search for past weather conditions** by selecting a date and entering a location.
- A modal displays:
  - The selected date
  - The city and country
  - The temperature of that day
  - A weather description
- The historical data feature is powered by OpenWeather’s **One Call API**.

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **APIs:** OpenWeather API
- **Libraries:** FontAwesome for icons

## 🚀 Setup Instructions

1. Clone this repository:

   git clone https://github.com/Phamphe/weather_forecast.git

   ```

   ```

2. Navigate to the project folder:
   ```sh
   cd weather_forecast
   ```
3. Open `login.html` in a web browser.

---

💡 _Weather R’US - Your go-to weather tracking solution!_

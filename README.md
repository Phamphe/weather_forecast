Weather R'US - Weather Tracking Web App
📌 Overview
Weather R’US is a web application that provides real-time weather updates, historical weather anomalies, and future forecasts for any location. The app fetches data from the OpenWeather API and dynamically displays the weather conditions on the dashboard. Users can also detect their current location using geolocation and retrieve past and future weather conditions for any date.

🎨 Figma Dashboard Design
👉 View Design in Figma

🌟 Features
🔹 Login & Signup
The landing page features a toggle form to switch between Sign In and Sign Up.
Clicking Sign In redirects users to dashboard.html.
The login system is static with no authentication.
✅ Fully responsive (Mobile, Tablet, and Desktop).
🔹 Dashboard (Real-Time Weather Updates)
Displays live weather conditions for the searched city.
Uses OpenWeather API to fetch:
✅ Temperature (°C / °F)
✅ Humidity
✅ Wind Speed
✅ Cloud Coverage
✅ UV Index
✅ Atmospheric Pressure
Geo-location feature detects the user's current location and displays the weather.
Users can still manually search for other cities.
Dropdown menu (next to the profile) for Settings & Logout.
🏆 Dashboard Tour guides new users.
🔹 Historical Weather Search (Any Date)
Users can search for past weather conditions by selecting a date and entering a city.
Uses OpenWeather’s Historical API to fetch:
✅ The selected date
✅ The city and country
✅ The temperature on that day
✅ A weather description
Data is displayed inside a modal popup.
🔹 Future Weather Forecast
Users can check the future weather for any given date.
Powered by OpenWeather’s One Call API.
Includes:
✅ Forecasted temperature
✅ Predicted weather conditions
✅ Expected humidity and wind speed
🛠️ Technologies Used
Frontend: HTML, CSS, JavaScript
APIs: OpenWeather API (Real-time, Historical, and Future Forecast Data)
Libraries: FontAwesome for icons
🚀 Setup Instructions
1️⃣ Clone this repository:

sh
Copy
Edit
git clone https://github.com/Phamphe/weather_forecast.git
2️⃣ Navigate to the project folder:

sh
Copy
Edit
cd weather_forecast
3️⃣ Open login.html in a web browser.


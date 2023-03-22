
// 抓取ID
const timeEL = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherFprecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');




const days = ['Sunday','Monday','Tuesday','WednesDay','Thursday','Friday','Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 天氣api 新版3.0要付費才可以開通其他功能
const API_KEI='a2578ffa91583c3c6adf1d742725fd7b';



// 設置年月份時間
setInterval(() =>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    // 設定12小時
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    // 設定上午下午
    const ampm = hour >=12? 'PM' : 'AM'
    // 正確時間印到頁面上
    timeEL.innerHTML = hoursIn12HrFormat + ':' + minutes + ''+`<span id="am-pm">${ampm}</span>`

    // 調整時間顯示有00:00 而非 0:00
    timeEL.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat)+ ':' + (minutes <10? '0' + minutes:minutes) + ''+`<spand id="am-pm">${ampm}</span>`




    // 日期更新
    dateEl.innerHTML = days[day]+','+date+''+months[month]


},1000);


getWeatherData()
function getWeatherData(){
    // 獲取經緯度
    navigator.geolocation.getCurrentPosition((success) =>{
       
        console.log(success)
        let {latitude, longitude} = success.coords;


        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEI}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })


    })
}

function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;


    timezone.innerHTML = data.timezone;
    // 右上角畫面顯示經緯度
    countryEl.innerHTML = data.lat + 'N' + data.log+'E'

    currentTempEl.innerHTML =
    `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    
    
    <div class="weather-item">
        <div>sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>

    
    <div class="weather-item">
        <div>sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    `;

    let otherDayForcast =''
    data.daily.forEach((day,idx) => {
        if(idx == 0){
            currentTempEl.innerHTML =`
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"> 
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night -${day.temp.night}&#176; C</div>
                <div class="temp">Day -${day.temp.day}&#176; C</div>
            </div>
            `
            
        }else{

                // 底下天氣列
                otherDayForcast =+`          
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"> 
                    <div class="temp">Night -${day.temp.night}&#176; C</div>
                    <div class="temp">Day -${day.temp.day}&#176; C</div>
                </div>`
        }

    })


    weatherForecastEl.innerHTML = otherDayForcast;

}
import { getRandomUser, getUserData, filterUserData, averageSleepDay, averageSleepQuality, getMilesPerDay, getMinutesPerDay, getStepGoal, getAverageStepGoal, theWaterFunction, stepChart, activityChart, theSleepingFunction, compareStepGoal } from './data-model.js';
import { getLatestData } from './hydrationFunctions.js';
import { displayUserInfo, displayWaterInfo, displaySleepInfo, displayActivityInfo, displayStepInfo } from './domUpdates.js';
import { fetchPromises } from './apiCalls.js';
import './styles.css';

//QuerySelectors Here:
const userToggleButton = document.querySelector('.toggleButton');
const userInformation = document.querySelector('.user-info');

//Variables Here:
let userDataAll;
let sleepDataAll;
let hydrationDataAll;
let activityDataAll;

//Event Listeners Here:
window.addEventListener('load', function () {
  Promise.all(fetchPromises).then((values) => {
    //data from Web APIs:
    userDataAll = values[0].users;
    sleepDataAll = values[1].sleepData;
    hydrationDataAll = values[2].hydrationData;
    activityDataAll = values[3].activityData;

    //random currentUser functions:
    let randomUserIndex = getRandomUser(userDataAll);
    let currentUser = getUserData(userDataAll, randomUserIndex);
 
    //Hydration functions:
    let hydrationData = filterUserData(hydrationDataAll, currentUser);  
    let todaysHydrationDate = getLatestData(hydrationData);
    let waterPerDayPerWeek = getLatestData(hydrationData, 'week');
    let waterChartToDom = theWaterFunction(waterPerDayPerWeek);
    
    //Sleep functions:
    let sleepData = filterUserData(sleepDataAll, currentUser);
    let averageSleep = averageSleepDay(sleepData);
    let aveSleepQuality = averageSleepQuality(sleepData);
    let sleepPerDayPerWeek = getLatestData(sleepData, 'week');
    let sleepToday = getLatestData(sleepData);
    let sleepChartToDom = theSleepingFunction(sleepPerDayPerWeek);
    
    //Activity and Step functions:
    let averageSteps = getAverageStepGoal(userDataAll);
    let activityData = filterUserData(activityDataAll, currentUser);
    let activityPerDayPerWeek = getLatestData(activityData,'week');
    let activityToday = getLatestData(activityData);
    let milesPerDay = getMilesPerDay(currentUser, activityData, activityToday);
    let stepGoal = getStepGoal(currentUser, activityData, activityToday);
    let minutesPerDay = getMinutesPerDay(activityData, activityToday); 
    let stepChartToDom = stepChart(activityPerDayPerWeek);
    let activityChartToDom = activityChart(activityPerDayPerWeek);
    let compareSteps = compareStepGoal(currentUser, userDataAll);

    //Dom Updates functions:
    displayUserInfo(currentUser, activityToday);
    displayWaterInfo(todaysHydrationDate, waterChartToDom);
    displaySleepInfo(averageSleep, aveSleepQuality, sleepToday, sleepChartToDom);
    displayActivityInfo(milesPerDay, minutesPerDay, activityToday, activityChartToDom);
    displayStepInfo(currentUser, stepGoal, stepChartToDom, compareSteps, averageSteps);
    }); 
});

userToggleButton.addEventListener('click',function() {
  userInformation.classList.toggle('hidden')
});


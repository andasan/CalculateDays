//----------------------------------------------------------------------------------
//Display the current date on the front end on page load
//----------------------------------------------------------------------------------
function displayCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
  
    if(dd<10) {
        dd = '0'+dd;
    } 
  
    if(mm<10) {
        mm = '0'+mm;
    } 
    
    today = yyyy + '-' + mm + '-' + dd;
    $('input#currentDate').val(today);
}


//----------------------------------------------------------------------------------
//Where the magic happens! >.<
//----------------------------------------------------------------------------------
function calc2dates(){

    //Initialize
    let currDate = new Date($('#currentDate').val().replace(/-/g, '\/'));                    //Extract current date data, change format to yyyy/mm/dd
    let currentDay = currDate.getDate();                                                     //Extract day in current date
    let currentMonth = currDate.getMonth()+1;                                                //Extract month in current date (January is 0, so +1)
    let currentYear = currDate.getFullYear();                                                //Extract year in current date

    let birthDate = new Date($('#myDate').val().replace(/-/g, '\/')); //Extract birth date data, change format to yyyy/mm/dd
    let birthDay = birthDate.getDate();                                                      //Extract day in birth date
    let birthMonth = birthDate.getMonth()+1;                                                 //Extract month in birth date (January is 0, so +1)
    let birthYear = birthDate.getFullYear();                                                 //Extract year in birth date

    let calcdaysinmonth=0;                                  //Placeholder for the total number of days on birth year (Dec 31 to birth day)
    let calcdaysinmonth2=0;                                 //Placeholder for the total number of days on current year (Jan 1 to current day)
    let calcdaysinbetween = 0;                              //Placeholder for the total number of days in between birth year and current year
    let total = 0;                                          //Placeholder for the overall TOTAL number of days between 2 dates
    let monthList1 = [31,28,31,30,31,30,31,31,30,31,30,31]; //Array for number of days per month (Jan=31, Feb=28.....) || Non-leap year
    let monthList2 = [31,29,31,30,31,30,31,31,30,31,30,31]; //Array for number of days per month (Jan=31, Feb=29.....) || Leap year



    if(isNaN(birthDate)){                                           //Check for undefined entry
        $('#result').html("Enter your date of birth");              //Print error message
    }
    else if(birthDate>currDate){                                    //Checking for earlier current date then birth date
        $('#result').html("Dont try to be funny. Please enter a date later than your birth date."); //Print error message
    }
    else{
        //----------------------------------------------------------------------------------
        //Calculate only the months of current year
        //----------------------------------------------------------------------------------
        if(birthYear == currentYear && birthMonth != currentMonth){ //Validate if same year AND the target month is not the same as current month
            console.log("same year");
            for(let x = birthMonth; x <= currentMonth; x++){        //Set loop from beginning of the year until target month
                if(checkForLeap(currentYear)){                      //Validate if leap year -- true
                    if(x == currentMonth){                          //Validate if loop reaches target month -- true
                        total += currentDay-birthDay;               //Add days of the months and current days of target month
                        break;                                      //Exit the loop
                    }
                    else{                                           //Validate if loop reaches target month -- false
                        total += monthList2[x-1];                   //Addition assignment for days in months
                    }
                }
                else{                                               //Validate if leap year -- false
                    if(x == currentMonth){                          //Validate if loop reaches target month -- true
                        total += currentDay-birthDay;                      //Add days of the months and current days of target month
                        break;                                      //Exit the loop
                    }
                    else{                                           //Validate if loop reaches target month -- false
                        total += monthList1[x-1];                   //Addition assignment for days in months
                    }
                }
            }
        }
        //----------------------------------------------------------------------------------
        //Calculate only the days if both dates fall on the same month
        //----------------------------------------------------------------------------------
        else if(birthYear == currentYear && birthMonth == currentMonth){        //Validate if same year AND same month
                total = currentDay-birthDay;                                    //Sum up the days by subtracting the birth day against the days on birth month
        }
        //----------------------------------------------------------------------------------
        //Calculate the days if both dates dont fall on the same year
        //----------------------------------------------------------------------------------
        else{
            //calculate number of days from last date of birth year (Dec31) to day of birth
            for(let x = 12; x >= birthMonth; x--){
                console.log("diff year");
                if(checkForLeap(birthYear)){                                    //Validate if leap year -- true
                    if(x == birthMonth){
                        calcdaysinmonth += (monthList2[x-1]-birthDay);          
                    }
                    else{
                        calcdaysinmonth += monthList2[x-1];
                    }
                }else{                                                          //Validate if leap year -- false
                    if(x == birthMonth){
                        calcdaysinmonth += (monthList1[x-1]-birthDay);
                    }
                    else{
                        calcdaysinmonth += monthList1[x-1];
                    }
                }
            }
    
            //calculate number of days from beginning of current year to current day
            for(let x = 1; x <= currentMonth; x++){
                if(checkForLeap(currentYear)){                                  //Validate if leap year -- true
                    if(x == currentMonth){
                        calcdaysinmonth2+=currentDay;
                        break;
                    }
                    else{
                        calcdaysinmonth2 += monthList2[x-1];
                    }
                }
                else{                                                           //Validate if leap year -- false
                    if(x == currentMonth){
                        calcdaysinmonth2+=currentDay;
                        break;
                    }
                    else{
                        calcdaysinmonth2 += monthList1[x-1];
                    }
                }
            }
    
            //calculate the number of days in between the two years, if any
            for(let x = birthYear+1; x < currentYear; x++){ //Loops and add the days in between years, birthYear+1 also eliminates "if" previous year is birth year
                if(checkForLeap(x)){                        //Validate if leap year -- true
                    calcdaysinbetween+=366;
                }
                else{                                       //Validate if leap year -- false
                    calcdaysinbetween+=365;
                }
            }
            total = calcdaysinmonth + calcdaysinmonth2 + calcdaysinbetween;     //Add days on birthyear + days on current year + days in between (if any) 
        }

        let dayOftheWeek = checkDayoftheWeek(birthDate);
        $('#result').html("You've been alive for <span class='text-danger'>"+total+ " days</span><br>Born on: " +dayOftheWeek); //Print results
    }
}

//----------------------------------------------------------------------------------
//Function to check for leap year
//----------------------------------------------------------------------------------
function checkForLeap(yyyy){
    if(yyyy%4 ==0 && !(yyyy%100==0) || yyyy%400==0){
        return 1;
    }else{
        return 0;
    }
}

//----------------------------------------------------------------------------------
//Function to check the day of the week
//----------------------------------------------------------------------------------
function checkDayoftheWeek(xxx){
    //Day of the week
    let days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    let d = new Date(xxx);
    let n = d.getDay();
    return days[n-1];
}


//----------------------------------------------------------------------------------
//Start
//----------------------------------------------------------------------------------
window.onload = function() {
    displayCurrentDate();
};

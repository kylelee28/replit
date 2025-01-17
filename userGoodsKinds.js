"use strict"

//리팩토링 할 때 함수로 만든거 싹다 깔끔하게 바꿔야 하고, 
//date를 무조건 날릴 수 있게 바꿔야 하며
//moment.format을 쓰지 말것. 왜 이것을 아직도 몰랐지?
//이딴식으로 코딩하지 말자.

const date = new Date()

const row = document.querySelectorAll(".day-number")
const rows = [...row]
const prevButton = document.querySelector(".go-prev")
const nextButton = document.querySelector(".go-next")
const selectButton = document.querySelector(".select-button")



//option 동적 생성하기 
addEventListener("load", ()=>{
for (let i=0; i<4; i++){
    let year = document.createElement("option"); 
    year.innerText = 2021 + i; 
    document.querySelector("select[name=year]").append(year); 
  }
  
  for(let i=1; i<=12; i++){
          let month = document.createElement("option"); 
          month.innerText = i; 
          document.querySelector("select[name=month]").append(month); 
      }
})

selectButton.addEventListener("click", ()=>{
  //today를 가리키는 원판 제거 
  rows.forEach((row)=>row.classList.remove("day-today"))
  
  let selectedYear = document.querySelector("select[name=year] option:checked").text;
  let selectedMonth = document.querySelector("select[name=month] option:checked").text;

  const renderCalender = ()=>{
    document.querySelector(".month-year").textContent= `${selectedYear}년 ${selectedMonth}월`

    //option으로 선택한 연도와 월을 파라미터로 던진다. 
    renderDays(selectedYear, selectedMonth);
    currentDate(selectedYear, selectedMonth)
  }
  renderCalender();
})
  

//현재 연도와 현재 월을 로딩해주는 함수 
const renderCalender = ()=>{
  let currentYear = date.getFullYear()// 현재 년도
  let currentMonth =  date.getMonth()+1 // 현재 월 (0부터 시작하므로 +1 해줌)
  document.querySelector(".month-year").textContent= `${currentYear}년 ${currentMonth}월`
  renderDays(currentYear, currentMonth);
  currentDate(currentYear, currentMonth)

}
renderCalender();

const prevMonth = ()=>{
  date.setMonth(date.getMonth()-1)
  renderCalender();
}

const nextMonth = ()=>{
  date.setMonth(date.getMonth()+1)
  renderCalender();

}


prevButton.addEventListener("click", ()=>{
  prevMonth()
})

nextButton.addEventListener("click", ()=>{
  nextMonth()
})


//사용자가 보는 월에 따라서 여러 변수들을 달리 계산해주는 함수

function renderDays (currentYear, currentMonth) {

 if(currentMonth < 10){
   currentMonth = "0" + currentMonth
 }
  
  const prevMoment = moment(currentYear+"-"+currentMonth).subtract(1, "M").format('YYYY-MM')
  const nextMoment = moment(currentYear+"-"+currentMonth).add(1, "M").format('YYYY-MM')

  const prevEnd = moment(prevMoment).endOf('month').format('YYYY-MM-DD')
  const nextStart = moment(nextMoment).startOf('month').format('YYYY-MM-DD')

  //이번달 마지막일, 이전달 마지막 일 지난달 마지막 날의 요일과 다음달 첫번째 날의 요일을 확인한다. 
  const endDay = moment(currentYear+"-"+currentMonth).endOf('month').format('DD')
  const prevEndday = moment(prevMoment).endOf('month').format('DD')

  const prevDate = moment(prevEnd).day(); 
  const nextDate = moment(nextStart).day();

   currentArr(prevDate, prevEndday, nextDate, endDay)
}

//날짜 배열을 만든다. 

function currentArr (prevDate, prevEndday, nextDate, endDay) {
  //prevDate는 지난달 마지막 일의 요일, prevEndday는 지난달 마지막일, endDay는 현재 달 마지막일 
  let arr = [];
  
  for (let i=0; i<=prevDate; i++){
    arr.push((prevEndday - (prevDate-i)).toString())
  }


  for (let i=1; i<7-prevDate; i++){
    arr.push("0"+i)
             }
  
    for (let i=7-prevDate; i<=endDay; i++){
    if(i<10){
      arr.push("0"+i)
      } else {
      arr.push(`${i}`)
      }
    }
  //현재달의 시작 일과 마지막 일의 배열에서의 idx를 확인한다. 
  let startIdx = arr.findIndex((arrs) => arrs === "01")
  let endIdx = parseInt(endDay, 10) + startIdx


  for (let i=1; i<=42-endIdx; i++){
    if(i<10){
      arr.push("0"+i)
      } else {
      arr.push(`${i}`)
      }
  }

  // 현재 달의 날짜를 매칭한다. 
  
  for (let i=0; i<42; i++){
    row[i].innerHTML = arr[i]
  }

  // 각 날짜에 대해서 이전달과 다음달에 포함된 날짜는 연하게 표기하겠다.
  rows.forEach((row)=>{
    row.classList.remove("day-gray")
  })

  for (let i=0; i<startIdx; i++){
    row[i].classList.add("day-gray")
  }

  for (let i=endIdx; i<42; i++){
     row[i].classList.add("day-gray")
    
  }
  //arr의 요소들을 모두 제거 
  arr.length = 0;

  }

function currentDate(currentYear, currentMonth){
  //currentYear과 currentMonth는 달력에 표기된 연도와 날짜를 일컫는 것임

  //today를 가리키는 원판 제거 
  rows.forEach((row)=>row.classList.remove("day-today"))
  
  if(currentMonth < 10){
     currentMonth = "0" + currentMonth
  }
  
  let todayDate = date.getDate()
  if(todayDate < 10){
     todayDate = "0" + todayDate
   }
  if(currentYear == moment().year() && currentMonth == moment().month()+1){

    let idx = rows.findIndex((row)=>row.innerHTML == todayDate && !row.classList.contains("day-gray")) 

    rows[idx].classList.add("day-today")
    
}
}
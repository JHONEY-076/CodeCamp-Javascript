// 문서내에서 지정된  그룹과 일치하는 데이터를 querySelector로 참조해줌
const messageContainer = document.querySelector("#d-day-message");
const container = document.querySelector("#d-day-container");
const savedDate = localStorage.getItem("saved-date");
const intervalIdArr = [];

//input 박스에 입력된 값을 불러와서 dataFormat 형태로 반환해주는 함수
const dataFormMaker = function () {
  const inputYear = document.querySelector("#target-year-input").value;
  const inputMonth = document.querySelector("#target-month-input").value;
  const inputDate = document.querySelector("#target-date-input").value;

  //주어진 변수를 바로 문자열 형태(2024-09-07)로 변환해줌(템플릿 리터럴)
  //const dateFormat= inputYear + '-' + inputMonth + '-'+inputDate;
  const dateFormat = `${inputYear}-${inputMonth}-${inputDate}`;
  //템플릿 리터럴
  return dateFormat;
  // console.log(inputYear, inputMonth, inputDate);
};

//날짜 데이터를 관리해주는 함수
const counterMaker = function (data) {
  if (data !== savedDate) {
    localStorage.setItem("saved-date", data);
  }
  const nowDate = new Date();
  const targetDate = new Date(data).setHours(0, 0, 0, 0); //자정을 기준으로 날짜를 다시 구해옴
  const remaining = (targetDate - nowDate) / 1000; //지정된 날짜와 현재 날짜를 빼서 초로 나타냄

  //remaining이 0이거나 음수인경우 그리고 잘못된 값이 입력된 값이 있으면 해당 메세지를 출력해줌
  if (remaining <= 0) {
    container.style.display = "none"; //3번째 줄에 container에 대한 변수 지역 변수로 참조함
    messageContainer.innerHTML = "<h3>타이머가 종료되었습니다</h3>"; //2번째 줄에 messageContainer에 대한 지역 변수 지역 변수로 참조함
    messageContainer.style.display = "flex";
    setClearInterval();
    return;
  } else if (isNaN(remaining)) {
    container.style.display = "none";
    messageContainer.innerHTML = "<h3>유효한 시간대가 아닙니다.</h>";
    messageContainer.style.display = "flex";
    setClearInterval();
    return;
  }

  // 날짜,시간,분,초를 계산한 값을 가지고 있는 객체
  const remainingObj = {
    remainingDate: Math.floor(remaining / 3600 / 24),
    remainingHours: Math.floor(remaining / 3600) % 24,
    remainingMin: Math.floor(remaining / 60) % 60,
    remainingSec: Math.floor(remaining) % 60,
  };

  const documentArr = ["days", "hours", "min", "sec"];
  const timeKeys = Object.keys(remainingObj);

  const format = function (time) {
    if (time < 10) {
      return "0" + time;
    } else {
      return time;
    }
  };

  let i = 0;
  for (let tag of documentArr) {
    const remainingTime = format(remainingObj[timeKeys[i]]);
    document.getElementById(tag).textContent = remainingTime;
    i++;
  }

  // for (let i = 0; i < timeKeys.length; i = i + 1) {
  //   documentObj[docKeys[i]].textContent = remainingObj[timeKeys[i]];
  // }

  // documentObj["days"].textContent = remainingObj["remainingDate"];
  // documentObj["hours"].textContent = remainingObj["remainingHours"];
  // documentObj["min"].textContent = remainingObj["remainingMin"];
  // documentObj["sec"].textContent = remainingObj["remainingSec"];

  // const documentObj = {
  //   days: document.getElementById("days"),
  //   hours: document.getElementById("hours"),
  //   min: document.getElementById("min"),
  //   sec: document.getElementById("sec"),
  // };
  // let i = 0;
  // for (let key in documentObj) {
  //   documentObj[key].textContent = remainingObj[timeKeys[i]];
  //   // i=i+1;
  //   i++;
  // }
};

const starter = function (targetDateInput) {
  // 매개변수의 데이터가 들어오는지 유뮤에 따라서
  if (!targetDateInput) {
    //매개변수가 안들어 올  경우
    targetDateInput = dataFormMaker(); // 데이터를 할당
  }
  container.style.display = "flex";
  messageContainer.style.display = "none";
  setClearInterval();
  counterMaker(targetDateInput);
  const intervalId = setInterval(() => {
    counterMaker(targetDateInput);
  }, 1000);
  intervalIdArr.push(intervalId);
};

const setClearInterval = function () {
  localStorage.removeItem("saved-date");
  for (let i = 0; i < intervalIdArr.length; i++) {
    clearInterval(intervalIdArr[i]);
  }
};

const resetTimer = function () {
  container.style.display = "none";
  messageContainer.innerHTML = "<h3>D-Day를 입력해 주세요.</h3>";
  messageContainer.style.display = "flex";
  setClearInterval();
};

if (savedDate) {
  starter(savedDate);
} else {
  container.style.display = "none";
  messageContainer.innerHTML = "<h3>D-Day를 입력해 주세요.</h3>";
}

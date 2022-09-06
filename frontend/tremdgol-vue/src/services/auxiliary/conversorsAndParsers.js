export function getTimeStamps_parseEpochTimeToTimeToKO(epochTimeString) {
  // 10jun2021
  const getDateDDMMMhhmmMiniZone = (date) => {
    // 03/Jun 13:10 GMT-0300
    var dd = date.getDate();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var MMM = months[date.getMonth()];
    var hh = date.getHours();
    var mm = date.getMinutes();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (hh < 10) {
      hh = "0" + hh;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    let dateStringed = date.toString();
    let timeZone = dateStringed.substring(dateStringed.indexOf("("), dateStringed.length);
    let miniTimeZone = dateStringed.substring(dateStringed.indexOf("GMT"), dateStringed.indexOf(" ("));
    // console.log(dateStringed)
    // console.log(timeZone)
    // console.log(miniTimeZone)
    return dd + "/" + MMM + " " + hh + ":" + mm + " " + miniTimeZone;
  };

  const msToTimeddHHmm = (msDuration) => {
    // 4h54m | 42m | 1d3h | 10h | -15m | -3h
    let msDuration_absolute = Math.abs(msDuration);
    var milliseconds = parseInt((msDuration_absolute % 1000) / 100),
      seconds = Math.floor((msDuration_absolute / 1000) % 60),
      minutes = Math.floor((msDuration_absolute / (1000 * 60)) % 60),
      hours = Math.floor((msDuration_absolute / (1000 * 60 * 60)) % 24),
      days = Math.floor(msDuration_absolute / (1000 * 60 * 60) / 24);

    let retorno = "";
    if (days > 0) {
      retorno += days + "d";
      if (hours > 0) {
        retorno += hours + "h";
      }
    } else {
      if (hours > 0) {
        if (hours >= 5) {
          retorno += hours + "h";
        } else {
          retorno += hours + "h" + minutes + "m";
        }
      } else {
        retorno += minutes + "m";
      }
    }
    return msDuration > 0 ? retorno : "-" + retorno;
  };

  const getTimeStamps = (epochTimeString) => {
    return {
      // NEW TIMESTAMPS properties (correct names)
      time_stringed_ISO_8601: new Date(epochTimeString * 1000), // The 0 there is the key, which sets the date to the epoch
      time_stringed_withZoneBR: getDateDDMMMhhmmMiniZone(new Date(epochTimeString * 1000)), // The 0 there is the key, which sets the date to the epoch
      timeUntilKickOff_stringed: msToTimeddHHmm(new Date(Number(epochTimeString) * 1000).getTime() - new Date().getTime()),
    };
  };
  // NEW TIMESTAMPS properties (correct names)
  let retorno = JSON.parse(JSON.stringify(getTimeStamps(epochTimeString)));

  return retorno;
}

export function getDateDDMMMhhmm(date) {
  var dd = date.getDate();
  //ar months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  var MMM = months[date.getMonth()];
  var hh = date.getHours();
  var mm = date.getMinutes();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  var dateStringed = date.toString();
  var timeZone = dateStringed.substring(dateStringed.indexOf("("), dateStringed.length);
  //return dd + '/' + MMM + ' ' + hh + ':' + mm + ' ' + timeZone;
  return dd + "/" + MMM + " " + hh + ":" + mm;
}

export function getDateDDMMMhhmmZone(date) {
  var dd = date.getDate();
  //ar months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  var MMM = months[date.getMonth()];
  var hh = date.getHours();
  var mm = date.getMinutes();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  var dateStringed = date.toString();
  var timeZone = dateStringed.substring(dateStringed.indexOf("("), dateStringed.length);
  return dd + "/" + MMM + " " + hh + ":" + mm + " " + timeZone;
}

export function getDateDDMMMYYYYhhmmZone(date) {
  var dd = date.getDate();
  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  var MMM = months[date.getMonth()];
  var hh = date.getHours();
  var mm = date.getMinutes();
  var yyyy = date.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  var dateStringed = date.toString();
  var timeZone = dateStringed.substring(dateStringed.indexOf("("), dateStringed.length);
  return dd + "/" + MMM + "/" + yyyy + " " + hh + ":" + mm + " " + timeZone;
}

export function getDateYYYYMMMDDhhmmZone(date) {
  var dd = date.getDate();
  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  var MMM = months[date.getMonth()];
  var hh = date.getHours();
  var mm = date.getMinutes();
  var yyyy = date.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  var dateStringed = date.toString();
  var timeZone = dateStringed.substring(dateStringed.indexOf("("), dateStringed.length);
  return yyyy + "/" + MMM + "/" + dd + " " + hh + ":" + mm + " " + timeZone;
}

export function getDateDDMMMhhmmMiniZone(date) {
  // 03/Jun 13:10 GMT-0300
  var dd = date.getDate();
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MMM = months[date.getMonth()];
  var hh = date.getHours();
  var mm = date.getMinutes();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  let dateStringed = date.toString();
  let timeZone = dateStringed.substring(dateStringed.indexOf("("), dateStringed.length);
  let miniTimeZone = dateStringed.substring(dateStringed.indexOf("GMT"), dateStringed.indexOf(" ("));
  // console.log(dateStringed)
  // console.log(timeZone)
  // console.log(miniTimeZone)
  return dd + "/" + MMM + " " + hh + ":" + mm + "Z";
}

export function getDatehhmmss(date) {
  // 13:10:03
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();

  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (ss < 10) {
    ss = "0" + ss;
  }
  return "" + hh + ":" + mm + ":" + ss;
}

export function getDateDDMMMhhmmss(date) {
  // 03/Jun 13:10:10
  var dd = date.getDate();
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MMM = months[date.getMonth()];
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (ss < 10) {
    ss = "0" + ss;
  }
  let dateStringed = date.toString();
  let timeZone = dateStringed.substring(dateStringed.indexOf("("), dateStringed.length);
  let miniTimeZone = dateStringed.substring(dateStringed.indexOf("GMT"), dateStringed.indexOf(" ("));
  console.log(dateStringed);
  console.log(timeZone);
  console.log(miniTimeZone);
  return dd + "/" + MMM + " " + hh + ":" + mm + ":" + ss;
}

export function round(number, decimalPlaces) {
  if (decimalPlaces === 0) {
    return Math.round(number);
  } else {
    return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
  }
}

export function stringifyBFreciept(recieptResponseBF) {
  // 02aug2021 // 2022jun14 copied from @jvictortips BF_ENDPOINTS_LIB
  //console.log("stringifyBFreciept(recieptResponseBF) --- START");
  var result = recieptResponseBF.result;
  var retorno = "" + result.status;
  if (result.status === "FAILURE") {
    retorno += " ⚠️ " + result.errorCode + "";
    const reports = result.instructionReports[0];
    const sizeToUse = reports.instruction.limitOrder.betTargetSize
      ? reports.instruction.limitOrder.betTargetSize
      : reports.instruction.limitOrder.size;
    retorno +=
      " ⛔️  reports: " +
      result.instructionReports[0].status +
      " (" +
      reports.errorCode +
      ") " +
      " ▫ " +
      sizeToUse +
      "@" +
      reports.instruction.limitOrder.price +
      " (" +
      reports.instruction.limitOrder.persistenceType +
      ")" +
      " ▫ " +
      reports.instruction.orderType +
      " (" +
      reports.instruction.side +
      ")";
  } else if (result.status === "SUCCESS") {
    const reports = result.instructionReports[0];
    const sizeToUse = reports.instruction.limitOrder.betTargetSize
      ? reports.instruction.limitOrder.betTargetSize
      : reports.instruction.limitOrder.size;
    retorno +=
      " ✔️  reports: " +
      reports.status +
      " ▫️ " +
      sizeToUse +
      "@" +
      reports.instruction.limitOrder.price +
      " (" +
      reports.instruction.limitOrder.persistenceType +
      ")" +
      " ▫ " +
      reports.instruction.orderType +
      " (" +
      reports.instruction.side +
      ")";
    retorno += " ▫ " + reports.orderStatus;
    retorno += reports.orderStatus === "EXECUTION_COMPLETE" ? " ✅ " : "  ⚠️ ";
    //retorno += reports.placedDate + ' ▫ ' + reports.sizeMatched + '@' + reports.averagePriceMatched;
    retorno += getDateDDMMMhhmmss(new Date(reports.placedDate)) + " ▫ " + reports.sizeMatched + "@" + reports.averagePriceMatched;
    retorno += " (" + reports.instruction.customerOrderRef + ")";
  } else {
    retorno += "status desconhecido:\n" + recieptResponseBF;
  }
  //console.log("stringifyBFreciept(recieptResponseBF) --- END");
  return retorno;
}

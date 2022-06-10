var thespreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet =thespreadsheet.getActiveSheet();
var lastRow = sheet.getLastRow();
var lastColumn = sheet.getLastColumn();
var calendar = CalendarApp.getCalendarById('jpmfjh91hlllhvhg866buuiuq8@group.calendar.google.com');
var cell = sheet.getCurrentCell();
var selectRow = cell.getRow();
var selectCol = cell.getColumn();
var x = cell.getValue().toString();
var y = sheet.getRange(selectRow,selectCol+1).getValue().toString();
var text = y.replace("Sent: ","");
var col = 8

function Submission(row){
  this.timestamp = sheet.getRange(row, 1).getValue();
  this.name = sheet.getRange(row, 2).getValue();
  this.reason = sheet.getRange(row, 3).getValue();
  this.phonenumnber = sheet.getRange(row, 4).getValue();
  this.date = new Date(sheet.getRange(row, 5).getValue());
  this.dateString = (this.date.getDate() + 1) + '/' + 
  this.date.getMonth() + '/' + this.date.getYear();
  this.time = sheet.getRange(row, 6).getValue();
  this.timeString = this.time.toLocaleTimeString();
  this.email = sheet.getRange(row, 7).getValue();
  // Adjust time and make end time
  this.date.setHours(this.time.getHours());
  this.date.setMinutes(this.time.getMinutes());
  this.endTime = new Date(this.date);
  this.endTime.setHours(this.time.getHours() + 1);
}
function deleteevents(request)
{
  var name = (request.name).toString();
  var event = calendar.getEventsForDay(request.date,{search :name})
  var ev = event[0]
  ev.deleteEvent();

    

}
function StatusObject(selectRow,selectCol){
  this.statusArray = sheet.getRange(1, lastColumn -1,selectRow, 1).getValues();
  this.notifiedArray = sheet.getRange(1, lastColumn, selectRow, 1).getValues();
  this.statusArray = [].concat.apply([], this.statusArray);
  this.notifiedArray = [].concat.apply([], this.notifiedArray);
}

function getChangeIndex(statusChange,selectRow,selectCol){
 
  if (statusChange.statusArray[statusChange.statusArray.length-1]==""){
    return;
  } else if (statusChange.statusArray[statusChange.statusArray.length-1] != "") {
    statusChange.status = statusChange.statusArray[statusChange.statusArray.length -1];
    sheet.getRange(selectRow, selectCol+1).setValue("Sent: " + statusChange.status);
    statusChange.notifiedArray[statusChange.statusArray.length-1] = "update";
    Logger.log(statusChange.status = statusChange.statusArray[statusChange.statusArray.length -1])
  } else {
    statusChange.status = statusChange.statusArray[statusChange.statusArray.length -1];
    
    statusChange.notifiedArray[statusChange.statusArray.length-1] = "no update";
  }
}

//var cell = sheet.getCurrentCell();
//var selectRow = cell.getRow();
//var selectCol = cell.getColumn();
function getConflicts(request,selectCol,selectRow) {
  var conflicts = calendar.getEvents(request.date, request.endTime);
  if (conflicts.length < 1) {
    request.status = "New";
  } else {
    request.status = "Conflict";
    sheet.getRange(selectRow, selectCol ).setValue("Reject");
    sheet.getRange(selectRow, selectCol+1).setValue("Sent: Conflict");
  }
}

function draftEmail(request){
  request.buttonLink = "https://forms.gle/F49kLJpXsaCLDHWw5"
  request.buttonText = "New Request";
  Logger.log(request.status.toString())
  switch (request.status.toString()) {
    case "New":
      request.subject = "Request for " + request.dateString + " Appointment Received";
      request.header = "Request Received";
      request.message = "Once the request has been reviewed you will receive an email updating you on it.";
      break;
    case "New2":
      request.email = "accundertest1602@gmail.com";
      request.subject = "New Request for " + request.dateString;
      request.header = "Request Received";
      request.message = "A new request needs to be reviewed.";
      request.buttonLink = "https://docs.google.com/spreadsheets/d/19JZtLZ3tPMiy-L5Cx8hds_OlVIw7r1tzSlM6DuY8w5M/edit?usp=sharing";
      request.buttonText = "View Request";
      break;
    case "Accept":
      request.subject = "Confirmation: Appointment for " + request.dateString + " has been scheduled";
      request.header = "Confirmation";
      request.message = "Your appointment has been scheduled.";
      break;
    case "Conflict":
      request.subject = "Conflict with " + request.dateString + " Appointment Request";
      request.header = "Conflict";
      request.message = "There was a scheduling conflict. Please reschedule.";
      request.buttonText = "Reschedule";
      break;
    case "Reject":
      request.subject = "Update on Appointment Requested for " + request.dateString;
      request.header = "Reschedule";
      request.message = "Unfortunately the request times does not work. Could "+
        "we reschedule?";
      request.buttonText = "Reschedule";
      break
    case "Reschedule":
      request.subject = "Update on Appointment Requested for " + request.dateString;
      request.header = "Reschedule";
      request.message = "I have an emergency now can we reschedule?";
      request.buttonText = "Reschedule";
      break;
  }
}

// Creates a calendar event using the submitted data
function updateCalendar(request){
  var event = calendar.createEvent(
    request.name,
    request.date,
    request.endTime
    )
}

function onFormSubmission(){
  var request = new Submission(selectRow);
  getConflicts(request,selectCol,selectRow);
  draftEmail(request);
  sendEmail(request);
  if (request.status == "New"){
    request.status = "New2";
    draftEmail(request);
    sendEmail(request);
  }
}
function sendEmail(request){
    MailApp.sendEmail({
    to: request.email,
    subject: request.subject,
    htmlBody: makeEmail(request)
  })
}

function onRealEdit()
{
while (x!=text && selectCol==col)
{
onEdit(selectRow,selectCol);
}
}
function onEdit(selectRow,selectCol){
  var statusChange = new StatusObject(selectRow,selectCol);

  while (true){
    getChangeIndex(statusChange,selectRow,selectCol);
    if (statusChange.statusArray[statusChange.statusArray.length-1]==""||x==text){
      return;
    } else {
      var request = new Submission(selectRow);
      if (statusChange.status){
        request.status = statusChange.status;
        x = statusChange.statusArray[statusChange.statusArray.length-1].toString();
        if(statusChange.notifiedArray[statusChange.notifiedArray.length-1]=="update")
        text = x;
        if (statusChange.status == "Accept"){
          updateCalendar(request);
        }
        else if(statusChange.status == "Reschedule"){
          deleteevents(request);
        }
        draftEmail(request);
        sendEmail(request);
      }
    }
  }

}

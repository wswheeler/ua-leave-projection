var leaveCalculator = {
    timeoff: {},
    rows: [],
    nextPayPeriodEndDate: null,
    calculateFirstPPE: function(){
        var epochPPE = new Date(2019, 1, 2);
        var today = new Date();
        var lengthOfDay = 1000*60*60*24;
        var daysBetweenEpochPPEAndToday = Math.floor((today-epochPPE)/lengthOfDay);
        this.nextPayPeriodEndDate = new Date(Date.now() + (14 - daysBetweenEpochPPEAndToday%14)*lengthOfDay);
        return this.nextPayPeriodEndDate
    },
    nextPayPeriodEndDateAfter: function(lastPPE){
        var nextDate = new Date(lastPPE );
        nextDate.setDate( nextDate.getDate() + 14);
        return (nextDate);
    },
    generateTable: function() {
      this.rows = []
      var totalRows = $('#payperiods').val();
      var nextPPEDate = this.calculateFirstPPE();
      var totalLeaveAccrued = parseFloat($('#currentAL').val());
      for(var i = 0; i < totalRows; i++ ){
          var pped = nextPPEDate;
          var payperiodHours = $('#hoursPerPayPeriod').val();
          var leaveAccrued = parseFloat($('#years').val());
          totalLeaveAccrued += leaveAccrued;

          this.rows[i]= {
              'payPeriodEndDate': pped,
              'hoursWorked': payperiodHours,
              'leaveAcrued': leaveAccrued,
              'totalLeaveAcrued': totalLeaveAccrued.toFixed(2)
          };

          nextPPEDate = this.nextPayPeriodEndDateAfter(nextPPEDate);
      }
      console.log(this.rows);
    },
    renderTable: function(divId){
      this.generateTable();
      var projectionTable ="<table border='1'>";
      projectionTable +="<tr><th>Pay Period Enddate</th><th>Hours Worked</th><th>Leave Accrued</th><th>Total Leave Available</th></tr>";

      for(var i = 0; i < this.rows.length; i++){
        projectionTable += "<tr><td>"+ this.rows[i].payPeriodEndDate +"</td>";
        projectionTable += "<td>"+ this.rows[i].hoursWorked +"</td>";
        projectionTable += "<td>"+ this.rows[i].leaveAcrued +"</td>";
        projectionTable += "<td>"+ this.rows[i].totalLeaveAcrued +"</td></tr>";

      }
      projectionTable += "</table>";
      $("#"+divId).html( projectionTable);
    }
}
$(document).ready( function() {
  function updateTable() {
      leaveCalculator.renderTable('table');
  }
  updateTable();
  $('#currentAL').focus();
  leaveCalculator.calculateFirstPPE();
  var lastPPE = leaveCalculator.nextPayPeriodEndDate;
  console.log(leaveCalculator.nextPayPeriodEndDate.toDateString());
  console.log(leaveCalculator.nextPayPeriodEndDateAfter(leaveCalculator.nextPayPeriodEndDate) );
  $('#showtable').click(updateTable);
    $('#currentAL,#years').change(updateTable);
    //$('#years').change(updateTable);

});
var arrGenderIssue = [];
var arrGADStatement = [];
var arrRelevantMFO = [];
var arrPerformanceIndicator = [];
var arrBudget = [];
var arrResponsibleOffices = [];
var arrFiles = [];

function checkForm() {
    var genderIssueAddress = $("#txtGenderIssueAddress").val();
    var gadAddress = $("#txtGADAddress").val();
    var count_tblGenderIssue = Number(tblGenderIssue.data().count());
    var count_tblGADStatement = Number(tblGADStatement.data().count());
    var count_tblRelevantMFO = Number(tblRelevantMFO.data().count());
    var gadActivity = $("#txtGADActivity").val();
    var count_tblPerformanceIndicator = Number(tblPerformanceIndicator.data().count());
    var count_tblBudget = Number(tblBudget.data().count());
    var count_tblResponsibleOffices = Number(tblResponsibleOffices.data().count());
    arrGenderIssue = [];
    arrGADStatement = [];
    arrRelevantMFO = [];
    arrPerformanceIndicator = [];
    arrBudget = [];
    arrResponsibleOffices = [];
    arrFiles = [];
    
    console.log(selectedGADID);
    console.log(selectedGenderID);

    
    $("#dvGenderIssueAddress").html(null);
    $("#dvGADAddress").html(null);
    $("#dvGenderIssue").html(null);
    $("#dvGADStatement").html(null);
    $("#dvGADActivity").html(null);
    $("#dvPerformanceIndicator").html(null);
    $("#dvBudget").html(null);
    $("#dvResponsibleOffices").html(null);
    $("#dvRelevantMFO").html(null);
    
    if (genderIssueAddress == "" && gadAddress == "") {
        $("#dvGenderIssueAddress").html(`<code class="cust-label">Please add details in Gender Issue or GAD</code>`);
    }
    
    if (count_tblGenderIssue == 0) {
        $("#dvGenderIssue").html(`<code class="cust-label">Please indicate atleast one cause of gender issue</code>`);
    }
    
    if (count_tblGADStatement == 0) {
        $("#dvGADStatement").html(`<code class="cust-label">Please indicate atleast one GAD result statement</code>`);
    }
    
    if (gadActivity == "") {
        $("#dvGADActivity").html(`<code class="cust-label">Please indicate GAD Activity</code>`);
    }
    
    if (count_tblPerformanceIndicator == 0) {
        $("#dvPerformanceIndicator").html(`<code class="cust-label">Please indicate atleast one Performance Indicator</code>`);
    }
    
    if (count_tblBudget == 0) {
        $("#dvBudget").html(`<code class="cust-label">Please indicate atleast one Budget</code>`);
    }
    
    if (count_tblResponsibleOffices == 0) {
        $("#dvResponsibleOffices").html(`<code class="cust-label">Please indicate atleast one Responsible Offices</code>`);
    }
    
    tblGenderIssue.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_genderIssue = $(`#txtGenderIssueAddress${data.id}`).val();
        
        if (row_genderIssue == "") {
            $("#dvGenderIssue").html(`<code class="cust-label">There is an empty field in Gender Issue Cause</code>`);
        } else {
            arrGenderIssue.push(`('${folderID}','${row_genderIssue.replaceAll("'","")}')`);
        }
    });
    
    tblGADStatement.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_gadStatement = $(`#txtGADStatement${data.id}`).val();
        
        if (row_gadStatement == "") {
            $("#dvGADStatement").html(`<code class="cust-label">There is an empty field in GAD Result Statement</code>`);
        } else {
            arrGADStatement.push(`('${folderID}','${row_gadStatement.replaceAll("'","")}')`);
        }
    });
    
    tblRelevantMFO.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_cmbRelevantMFO = $(`#cmbRelevantMFO${data.id}`).val();
        var row_txtRelevantMFO = $(`#txtRelevantMFO${data.id}`).val();

        if (row_cmbRelevantMFO == null || row_cmbRelevantMFO == "" || row_txtRelevantMFO == "") {
            $("#dvRelevantMFO").html(`<code class="cust-label">There is an empty field in Relevant MFO</code>`);
        } else {
            arrRelevantMFO.push(`('${folderID}','${row_cmbRelevantMFO.replaceAll("'","")}','${row_txtRelevantMFO.replaceAll("'","")}')`);
        }
    });

    
    tblPerformanceIndicator.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_txtPerformanceIndicator = $(`#txtPerformanceIndicator${data.id}`).val();
        var row_txtPerformanceTarget = $(`#txtPerformanceTarget${data.id}`).val();
        
        if (row_txtPerformanceIndicator == "" || row_txtPerformanceTarget == "") {
            $("#dvPerformanceIndicator").html(`<code class="cust-label">There is an empty field in Performance Indicator</code>`);
        } else {
            arrPerformanceIndicator.push(`('${folderID}','${row_txtPerformanceIndicator.replaceAll("'","")}','${row_txtPerformanceTarget.replaceAll("'","")}')`);
        }
    });
    
    tblBudget.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_cmbBudgetSource = $(`#cmbBudgetSource${data.id}`).val();
        var row_txtBudgetItem = $(`#txtBudgetItem${data.id}`).val();
        var row_txtBudgetAmount = $(`#txtBudgetAmount${data.id}`).val();
        
        if (row_cmbBudgetSource == "" || row_cmbBudgetSource == null || row_txtBudgetItem == ""
            || row_txtBudgetAmount == "" || row_txtBudgetAmount == 0) {
            $("#dvBudget").html(`<code class="cust-label">There is an empty field in Budget</code>`);
        } else {
            arrBudget.push(`('${folderID}','${row_cmbBudgetSource.replaceAll("'","")}','${row_txtBudgetItem.replaceAll("'","")}','${row_txtBudgetAmount.replaceAll("'","")}')`);
        }
    });
    
    tblResponsibleOffices.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_txtResponsibleOffices = $(`#txtResponsibleOffices${data.id}`).val();
        
        if (row_txtResponsibleOffices == "") {
            $("#dvResponsibleOffices").html(`<code class="cust-label">There is an empty field in Responsible Offices</code>`);
        } else {
            arrResponsibleOffices.push(`('${folderID}','${row_txtResponsibleOffices.replaceAll("'","")}')`);
        }
    });
    
    tblFiles.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_description = data.description;
        
        arrFiles.push(`('${folderID}','${row_description}')`);
    });

    if (
        $("#dvGenderIssueAddress").html() == '' && 
        $("#dvGADAddress").html() == '' && 
        $("#dvGenderIssue").html() == '' && 
        $("#dvGADStatement").html() == '' && 
        $("#dvGADActivity").html() == '' && 
        $("#dvPerformanceIndicator").html() == '' && 
        $("#dvBudget").html() == '' && 
        $("#dvResponsibleOffices").html() == '' &&
        $("#dvRelevantMFO").html() == ''
    ) {
        
        $("#btnSaveGBP").prop("disabled", true);
       
        
        $.ajax({
            url: "../program_assets/php/web/gbp",
            data: {
                command                 : 'save_gbp',
                folderID                : folderID,
                parentFolderID          : parentFolderID,
                genderIssueAddress      : selectedGenderID,
                gadAddress              : selectedGADID,
                gadActivity             : $("#txtGADActivity").val(),
                arrGenderIssue          : arrGenderIssue.join(","),
                arrGADStatement         : arrGADStatement.join(","),
                arrRelevantMFO          : arrRelevantMFO.join(","),
                arrPerformanceIndicator : arrPerformanceIndicator.join(","),
                arrBudget               : arrBudget.join(","),
                arrResponsibleOffices   : arrResponsibleOffices.join(","),
                arrFiles                : arrFiles.join(","),
                selectedTab             : selectedTab
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                $("#btnSaveGBP").prop("disabled", false);
                
                if (!data[0].error) {
                    clearInterval(checFormEverySecond);
                    $("#mdGBP").modal("hide");
                    loadClientFocus();
                    computeGAD();
                    
                    setTimeout(function() {
                        changeClientFocusRow($("#cmbClientXEntries").val())
                    }, 1500);
                }
            }
        });
    } else {
        JAlert("You have an error. Please check them all","red");
    }
}

$("#btnSaveGBP").click(function(){
    checkForm();
});

function downLoadFile(folderID,fileName) {
    if (fileName == "-") {
        JAlert("Nothing to download","red");
    } else {
        window.open(`../documents/${folderID}/${fileName}`,'_blank');
    }
}
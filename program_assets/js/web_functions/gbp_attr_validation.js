$("#btnSaveGBP_attr").click(function(){
    var program = $("#txtProgram").val();
    var count_tblBudget = Number(tblBudget_attr.data().count());
    
	arrBudget = [];
    arrFiles = [];
    
    $("#dvProgram").html(null);
    $("#dvBudget_attr").html(null);
    
    if (program == "") {
        $("#dvProgram").html(`<code class="cust-label">Please indicate the Program</code>`);
    }
    
    if (count_tblBudget == 0) {
        $("#dvBudget_attr").html(`<code class="cust-label">Please indicate atleast one Budget</code>`);
    }
    
    tblBudget_attr.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_cmbBudgetSource = $(`#cmbBudgetSource_attr${data.id}`).val();
        var row_txtBudgetItem = $(`#txtBudgetItem_attr${data.id}`).val();
        var row_txtBudgetAmount = $(`#txtBudgetAmount_attr${data.id}`).val();
        
        if (row_cmbBudgetSource == "" || row_cmbBudgetSource == null 
            || row_txtBudgetAmount == "" || row_txtBudgetAmount == 0) {
            $("#dvBudget_attr").html(`<code class="cust-label">There is an empty field in Budget</code>`);
        } else {
            arrBudget.push(`('${folderID}','${row_cmbBudgetSource.replaceAll("'","")}','${row_txtBudgetItem.replaceAll("'","")}','${row_txtBudgetAmount.replaceAll("'","")}')`);
        }
    });
    
    tblFiles_attr.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var row_description = data.description;
        
        arrFiles.push(`('${folderID}','${row_description}')`);
    });
    
    if (
        $("#dvProgram").html() == '' && 
        $("#dvBudget_attr").html() == ''
    ) {
        
        $("#btnSaveGBP_attr").prop("disabled", true);
        
        $.ajax({
            url: "../program_assets/php/web/gbp",
            data: {
                command                 : 'save_gbp_attr',
                folderID                : folderID,
                program                 : $("#txtProgram").val(),
                arrBudget               : arrBudget.join(","),
                arrFiles                : arrFiles.join(","),
                parentFolderID          : parentFolderID
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                $("#btnSaveGBP_attr").prop("disabled", false);
                
                if (!data[0].error) {
                    $("#mdAttr").modal("hide");
                    loadAttr();
                }
            }
        });
    } else {
        JAlert("You have an error. Please check them all","red");
    }
});
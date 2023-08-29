var parentFolderIDtoSubmit = "";

$("#btnSubmitGBPFinal").click(function(){
	var year = $("#cmbYear").val();
	var amount = $("#txtAllottedBudget").val();
	
	if (year == null || year == "" || amount == "") {
		JAlert("Please add year and total budget","red");
		return;
    }
	
	
	$("#btnSaveDraft").click();
	
	setTimeout(function() {
		showRemarks();
	}, 1500);
	
});

function showRemarks() {
    totalPrimarySource = 0;
    totalOtherSource = 0;
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'load_activity_parent',
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            for (var i = 0; i < data.length; i++) {
                parentFolderIDtoSubmit = data[i].parentFolderID;

                $("#mdSentApproval").modal();
                $("#txtGBPRemarks").val("");
            }
        }
    });
}

$("#btnProceedSubmit").click(function(){
	var parentFolderID = parentFolderIDtoSubmit;
    var remarks      = $("#txtGBPRemarks").val();
	
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'gbp_for_approval',
            parentFolderID : parentFolderID,
            remarks : remarks
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                $("#mdSentApproval").modal("hide");
				location.reload();
            }
        }
    });
});
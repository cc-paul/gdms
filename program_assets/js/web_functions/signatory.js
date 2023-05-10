$("#btnSignatory").click(function(){
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'show_signatory',
            parentFolderID  : parentFolderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            if (data.length != 0) {
                $("#txtPreparedBy").val(data[0].preparedBy);
                $("#txtPreparedByPosition").val(data[0].preparedByPosition);
                $("#txtApprovedBy").val(data[0].approvedBy);
                $("#txtApprovedByPosition").val(data[0].approvedByPosition);
            }
            
            $("#mdSignatory").modal();
        }
    });
});

$("#btnSaveSignatory").click(function(){    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'save_signatory',
            parentFolderID  : parentFolderID,
            preparedBy : $("#txtPreparedBy").val(),
            preparedByPosition : $("#txtPreparedByPosition").val(),
            approvedBy : $("#txtApprovedBy").val(),
            approvedByPosition : $("#txtApprovedByPosition").val()
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            if (!data[0].error) {
                $("#mdSignatory").modal("hide");
            }
        }
    });
});
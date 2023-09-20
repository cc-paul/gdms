var commentMotherID = "";

//openCommentModal('PFGBCVZHFF-col6-row0');

function openCommentModal(commentID) {
    commentMotherID = commentID;
    $("#txtComment").val(null);
    $("#txtCommentFile").val(null);
    $("#mdComments").modal();
    $("#dvComments").html(null);
    loadComments();
    
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'read_comment',
            commentMotherID : commentID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            if (!data[0].error) {
                //$("#" + commentID).hide();
            }
        }
    });
}

function loadComments() {
    var comments = "";
    
    $.ajax({
        url: "../program_assets/php/web/gbp.php",
        data: {
            command   : 'show_comments',
            commentMotherID : commentMotherID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            for (var i = 0; i < data.length; i++) {
                var color = "bg-gray";
                var postion = data[i].position;
                
                if (postion == "Encoder") {
                    color = "bg-primary";
                } else {
                    color = "bg-green";
                }
                
                comments += `
                    <div class="row">
                        <div class="col-md-12 col-sm-12">
                            <div class="alert `+ color +` cust-label">
                                <div class="row">
                                    <div class="col-md-12">
                                        <label>${data[i].fullName}</label>
                                        <br>
                                        <span>${data[i].comment}</span>
                                        <br>
                                        <i><span>${data[i].dateCreated}</span></i>
                                        <br>
                                        <br>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="btn-group pull-right">
                                            <button type="button" onclick="downLoadFile('${data[i].folderID}','${data[i].fileName}')" class="btn btn-default" ${data[i].fileName != null ? '' : 'disabled'}><i class="fa fa-download"></i></button>
                                            <button type="button" onclick="deleteComment(${data[i].id})" class="btn btn-default"><i class="fa fa-trash"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            console.log(comments);
            $("#dvComments").html(comments);
        }
    });
}



$("#btnSaveComment").click(function(){
	var comment = $("#txtComment").val();
    var file = $("#txtCommentFile").val();
    var folderID = Date.now();
    
    if (comment == "" || comment == null) {
        JAlert("Please add some comment","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/gbp.php",
            data: {
                command  : 'save_comment',
                commentMotherID : commentMotherID,
                comment : comment
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                if (!data[0].error) {
                    if (file == "") {
                        JAlert(data[0].message,data[0].color);
                        $("#txtComment").val(null);
                        loadComments();
                    } else {
                        attachFile(folderID,data[0].last_id);
                    }
                }
            }
        });
    }
});

function deleteComment(commentID) {
    $.ajax({
        url: "../program_assets/php/web/gbp.php",
        data: {
            command   : 'delete_comment',
            commentID : commentID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            loadComments();
        }
    });
}

function attachFile(folderID,updateID) {
    var file_data = $('#txtCommentFile').prop('files')[0];
    var fileInput = document.getElementById('txtCommentFile');   
    var filename = fileInput.files[0].name;
    var form_data = new FormData();
    
    form_data.append('commentMotherID', updateID);    
    form_data.append('file', file_data);    
    form_data.append('fileName', filename);
    form_data.append('folderID', folderID);
    form_data.append('command', 'upload_file_comment');
    $.ajax({
        url: "../program_assets/php/web/gbp",
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function(data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                $("#txtComment").val(null);
                $("#txtCommentFile").val(null);
                loadComments();
            }
        }
    });
}
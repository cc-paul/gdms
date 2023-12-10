var arrStudentIDs = [];
var tblAttachFiles;
var folderID;
var tblEmails;

$("#btnCompose").click(function(){
	prepareCompose();
});

$("#btnSend").click(function(){
    var header    = $("#txtHeader").val();
    var deadline  = $("#txtDeadline").val();
    var message   = $("#txtMessage").val();
    var fileCount = Number(tblAttachFiles.data().count());
    var arrSelectedStudent = [];
    
	
    for (var i = 0; i < arrStudentIDs.length; i++) {
        if (document.getElementById('chkActive' + arrStudentIDs[i]).checked) {
            arrSelectedStudent.push(arrStudentIDs[i]);
        }
    }
    
    if (header == "" || deadline == "" || message == "") {
        JAlert("Please fill in all required fields","red");
        return;
    }
    
    //if (fileCount == 0) {
    //    JAlert("Please upload at least 1 file","red");
    //    return;
    //}
    
    if (arrSelectedStudent.length == 0) {
        JAlert("Please select at least 1 student","red");
        return;
    }
    
    $.ajax({
        url: "../program_assets/php/web/messaging",
        data: {
            command  : 'send_message_a',
            folderID : folderID,
            header   : header.replace(",",""),
            deadline : deadline,
            message  : message,
            arrSelectedStudent : arrSelectedStudent.join(",")
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                $("#mdUpload").modal("hide");
				showSent();
            }
        }
    });
});



function prepareCompose() {
    folderID = makeid(10).toUpperCase();
    
	$("#txtHeader").val(null);
	//$("#txtDeadline").val(null);
	$("#txtMessage").val(null);
	
    $("#file_uploader").val(null);
    
    $("#mdUpload").modal();

    $.ajax({
        url: "../program_assets/php/web/messaging",
        data: {
            command : 'create_folder',
            folderID : folderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            if (data[0].error) {
                JAlert(data[0].message,data[0].error);
            }
        }
    });
    
    $.ajax({
        url: "../program_assets/php/web/messaging",
        data: {
            command   : 'load_student_checkbox'
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            $("#dvAssignedHolder").html("");
            var studentCheckbox = "";
            
            for (var i = 0; i < data.length; i++) {
                studentCheckbox += `
                    <div class="col-md-5 col-sm-12">
                        <label style="display: inline-block">
                            <input id="chkActive` + data[i].id + `" style="vertical-align: middle; margin-top: -4px;" type="checkbox" autocomplete="off">
                            <label for="chkActive` + data[i].id + `" style="vertical-align: middle" class="cust-label pointer">&nbsp;&nbsp;`+ data[i].fullName +`</label>
                        </label>
                    </div>
                `;
                
                arrStudentIDs.push(data[i].id);
            }
            
            if (data.length != 0) {
                studentCheckbox += `
                    <div class="col-md-5 col-sm-12">
                        <label style="display: inline-block">
                            <input id="chkActive_all" name="chkActive_all" onchange="checkAll(this);" style="vertical-align: middle; margin-top: -4px;" type="checkbox" autocomplete="off">
                            <label for="chkActive_all" style="vertical-align: middle" class="cust-label pointer">&nbsp;&nbsp;Select All</label>
                        </label>
                    </div>
                `;
            }
            
            $("#dvAssignedHolder").html(studentCheckbox);
        }
    });
    
    tblAttachFiles = 
    $('#tblAttachFiles').DataTable({
        'destroy'       : true,
        'paging'        : false,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        "language": {
            "emptyTable" : "Click the upload button to attach some emails"
        },
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-admin",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'aoColumns' : [
        	{ mData: 'fileName'},
            { mData: 'fileName',
                render: function (data,type,row) {
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list">' +
                           '		<i class="fa fa-trash"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
            { "width": "1%", "targets": [1] }
        ],
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnInitComplete": function (oSettings, json) {
            console.log('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
    
    tblAttachFiles.clear().draw();
}

showSent();
showInboxCount();

$('#txtSearchHere').keyup(function(){
    tblEmails.search($(this).val()).draw();
});

function showInbox() {
	showInboxCount();
	
	$("#dvTitle").html(`
        <i class="fa fa-inbox cust-label"></i>
        &nbsp;
        <label class="cust-label">Inbox</label>   
    `);
	
	$("#txtSearchHere").val("");
	
	tblEmails = 
    $('#tblEmails').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-admin",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'ajax'          : {
        	'url'       : "../program_assets/php/web/messaging",
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_message_inbox',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'fullName'},
            { mData: 'header',
				render: function (data,type,row) {					
					return  row.header.length >= 40 ? row.header.substring(0, 40) + '...' : row.header;
				}
			},
            { mData: 'message',
				render: function (data,type,row) {
					var message = row.message.length >= 120 ? row.message.substring(0, 120) + '...' : row.message;
					
					return `<b>
								<a href="#" class="list">${message}</a>
							</b>
							`;
				}
			},
            { mData: 'dateSent'}
        ],
        'aoColumnDefs': [
        //	{"className": "custom-center", "targets": [8]},
        //	{"className": "dt-center", "targets": [0,1,2,3,4,5,6,7]},
        	{ "width": "1%", "targets": [0,1,3] },
        //	{"className" : "hide_column", "targets": [9]} 
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        //"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //	console.log(aData["status"]);
        //	
        //	if (aData["status"] == "Pending") {
        //		count_pending++;
        //	} else if (aData["status"] == "Approved") {
        //		count_approved++;
        //	} else {
        //		count_rejected++;
        //	}
        //},
        "fnInitComplete": function (oSettings, json) {
            console.log('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}

function showInboxCount() {
	
	
	$.ajax({
		url: "../program_assets/php/web/messaging",
		data: {
			command   : 'load_message_inbox_count',
		},
		type: 'post',
		success: function (data) {
			var data = jQuery.parseJSON(data);
			var counter = 0;
			
			if (data.length != 0) {
				counter = data[0].isRead;
				
				$("#spMessageCounter").text(counter);
            } else {
				$("#spMessageCounter").hide();	
			}
		}
	});
}

function showSent() {
    $("#dvTitle").html(`
        <i class="fa fa-paper-plane cust-label"></i>
        &nbsp;
        <label class="cust-label">Sent Items</label>   
    `);
	
	$("#txtSearchHere").val("");
    
    tblEmails = 
    $('#tblEmails').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-admin",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'ajax'          : {
        	'url'       : "../program_assets/php/web/messaging",
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_message',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'fullName'},
            { mData: 'header',
				render: function (data,type,row) {					
					return  row.header.length >= 120 ? row.header.substring(0, 120) + '...' : row.header;
				}
			},
            { mData: 'message',
				render: function (data,type,row) {
					var message = row.message.length >= 120 ? row.message.substring(0, 120) + '...' : row.message;
					
					return `<b>
								<a href="#" class="list">${message}</a>
							</b>
							`;
				}
			},
            { mData: 'dateSent'}
        ],
        'aoColumnDefs': [
        //	{"className": "custom-center", "targets": [8]},
        //	{"className": "dt-center", "targets": [0,1,2,3,4,5,6,7]},
        	{ "width": "1%", "targets": [0,1,3] },
        //	{"className" : "hide_column", "targets": [9]} 
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        //"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //	console.log(aData["status"]);
        //	
        //	if (aData["status"] == "Pending") {
        //		count_pending++;
        //	} else if (aData["status"] == "Approved") {
        //		count_approved++;
        //	} else {
        //		count_rejected++;
        //	}
        //},
        "fnInitComplete": function (oSettings, json) {
            console.log('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}



$('#tblEmails tbody').on('click', '.list', function (){
	var data = tblEmails.row( $(this).parents('tr') ).data();
	var folderID = data.folderID;
	
	$("#spAuthor").text(data.fullName);
	$("#spTitle").text(data.header);
	$("#spTo").text(data.receivers);
	$("#txtMessageDetails").val(data.message);
	$("#spDeadline").text(data.deadline);
	$("#mdEmailDetails").modal();

	
	$.ajax({
		url: "../program_assets/php/web/messaging",
		data: {
			command   : 'load_file',
			folderID  : folderID
		},
		type: 'post',
		success: function (data) {
			var data = jQuery.parseJSON(data);
			
			var file = "";
			$("#dvFileHolder").html("");
			
			for (var i = 0; i < data.length; i++) {
				var fileName = data[i].fileName;
				
				file += `
					<div class="col-md-3 col-xs-12" onClick="downLoadFile('${folderID}','${fileName}')">
						<a class="btn btn-block btn-social btn-twitter cust-label">
							<i class="fa fa-dropbox"></i> ${fileName}
						</a>
						<br>
					</div>
				`;
			}
			
			$("#dvFileHolder").html(file);
		}
	});
	
	$.ajax({
		url: "../program_assets/php/web/messaging",
		data: {
			command   : 'read_message',
			id  : data.id
		},
		type: 'post',
		success: function (data) {
			var data = jQuery.parseJSON(data);
			
			if (!data[0].error) {
                showInboxCount();
            }
		}
	});
});

function downLoadFile(id,fileName) {
    if (fileName == "-") {
        JAlert("Nothing to download","red");
    } else {
        window.open(`../documents/${id}/${fileName}`,'_blank');
    }
}

$('#tblAttachFiles tbody').on('click', 'td button', function (){
	var data = tblAttachFiles.row( $(this).parents('tr') ).data();
    
    $.ajax({
        url: "../program_assets/php/web/messaging",
        data: {
            command  : 'remove_file',
            fileName : data.fileName,
            folderID : folderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            if (data[0].error) {
                JAlert(data[0].message,data[0].color);
            } else {
                tblAttachFiles.rows( '.selected' ).remove().draw();
            }
        }
    });
});

function openFile() {
    javascript:document.getElementById('file_uploader').click();
}

function uploadFile(id,filename,event) {
    var file_data = $('#file_uploader').prop('files')[0];
    var fileInput = document.getElementById('file_uploader');   
    var filename = fileInput.files[0].name;
    
	const fileSizeInMB = file_data.size / 1024 / 1024; 

	if (fileSizeInMB > 20) {
		JAlert('File size exceeds 20MB. Please choose a smaller file.','orange');
		$("#file_uploader").val(null);
		
		return;
	}
	
	var form_data = new FormData();
    form_data.append('file', file_data);    
    form_data.append('fileName', filename);
    form_data.append('folderName', folderID);
    form_data.append('command', 'upload_file');
    form_data.append('ext',getFileNameWithExt(event));
	$.ajax({
        url: "../program_assets/php/web/messaging",
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function(data) {
            var data = jQuery.parseJSON(data);
            
            if (data[0].error) {
                JAlert(data[0].message,data[0].color);
            } else {
                tblAttachFiles.row.add({
                    "fileName" : filename,
                }).draw( false );
                
                $("#file_uploader").val(null);
            }
        }
	});
}

function getFileNameWithExt(event) {

    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
        return;
    }
    
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const fileName = name.substring(0, lastDot);
  
    return name.substring(lastDot + 1);
}

function checkAll(event) {    
    for (var i = 0; i < arrStudentIDs.length; i++) {
        $('#chkActive' + arrStudentIDs[i]).prop('checked', $(event).is(":checked") ? true : false);
    }
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
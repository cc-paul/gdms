var tblAccount;
var userID;
var oldEmail;
var oldUsername;

loadAccount();

$("#btnExportAccount").click(function(){
	$(".btn-export-account").click();
});

$('#txtSearchAccount').keyup(function(){
    tblAccount.search($(this).val()).draw();
});

function loadAccount() {
    tblAccount = 
    $('#tblAccount').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-account",
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
        	'url'       : '../program_assets/php/web/account.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_account',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'username'},
            { mData: 'firstName'},
            { mData: 'middleName'},
            { mData: 'lastName'},
			{ mData: 'position'},
            { mData: 'mobileNumber'},
            { mData: 'email'},
            { mData: 'sex'},
            { mData: 'accountStatus'},
            { mData: 'dateCreated'},
            { mData: 'id',
                render: function (data,type,row) {
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list">' +
                           '		<i class="fa fa-edit"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
        //	{"className": "custom-center", "targets": [8]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5,6,7,8]},
        	{ "width": "1%", "targets": [9,10] },
        //	{"className" : "hide_column", "targets": [9]} 
        ],
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
}

$('#tblAccount tbody').on('click', 'td button', function (){
	var data = tblAccount.row( $(this).parents('tr') ).data();
    
    $("#txtFirstName").val(data.firstName);
	$("#txtMiddleName").val(data.middleName);
	$("#txtLastName").val(data.lastName);
	$("#txtBirthDate").val(data.birthDate);
	$("#cmbGender").val(data.sex).trigger("change");
	$("#txtMobileNumber").val(data.mobileNumber);
	$("#txtEmailAddress").val(data.email);
	$("#txtUsername").val(data.username);
    $("#cmbStatus").val(data.accountStatus).trigger("change");
	$("#cmbPosition").val(data.positionID).trigger("change");
    userID = data.id;
	oldUsername = data.username;
	oldEmail = data.email;
    
    $("#mdRegister").modal();
});

$("#btnSaveAccount").click(function(){
	var position = $("#cmbPosition").val();
	var fName = $("#txtFirstName").val();
	var mName = $("#txtMiddleName").val();
	var lName = $("#txtLastName").val();
	var bDate = $("#txtBirthDate").val();
	var gender = $("#cmbGender").val();
	var mobileNumber = $("#txtMobileNumber").val();
	var emailAddress = $("#txtEmailAddress").val();
	var username = $("#txtUsername").val();
    var status = $("#cmbStatus").val();
	var positionID = $("#cmbPosition").val();
	
	if (fName == "" || lName == "" || bDate == "" || gender == "" || mobileNumber == "" || emailAddress == "" || username == "" || status == "") {
		JAlert("Please fill in required fields","red");
		return;
    }
	
	if (mobileNumber.length != 11) {
		JAlert("Mobile Number must be 11 digit","red");
		return;
    }
	
	if (positionID == "" || positionID == null) {
		JAlert("Please add a position","red");
		return;
    }
	
    $.ajax({
        url: "../program_assets/php/web/account",
        data: {
            command   : 'update_user',
            userID : userID,
            accountStatus : $("#cmbStatus").val(),
			position : positionID,
			fName : fName,
			mName : mName,
			lName : lName,
			bDate : bDate,
			gender : gender,
			mobileNumber : mobileNumber,
			emailAddress : emailAddress,
			username : username,
			oldEmail : oldEmail,
			oldUsername : oldUsername
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                loadAccount();
                $("#mdRegister").modal("hide");
                
                $.ajax({
                    url: "https://apps.project4teen.online/email-service/send.php",
                    data: {
                        rEmail    : $("#txtEmailAddress").val(),
                        sEmail    : 'teamohmygad.system@gmail.com',
                        sName     : 'GDMS',
                        sPassword : 'hvaaijeopwczvoxf',
                        sSubject  : 'GDMS Account Status',
                        sBody     : "Please be informed that your account status has been changed to " + $("#cmbStatus").val()
                    },
                    type: 'post',
                    success: function (data) {
                        var data = jQuery.parseJSON(data);
                        
                        if (!data[0].error) {
                            
                        } else {
                            JAlert(data[0].message,data[0].color);
                        }
                    }
                });
            }
        }
    });
});
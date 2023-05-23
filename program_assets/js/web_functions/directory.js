var tblAccount;
var userID;

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
            { mData: 'firstName'},
            { mData: 'middleName'},
            { mData: 'lastName'},
            { mData: 'mobileNumber'},
            { mData: 'email'},
            { mData: 'sex'},
            { mData: 'dateCreated'}
        ],
        'aoColumnDefs': [
        //	{"className": "custom-center", "targets": [8]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5,6]},
        	{ "width": "1%", "targets": [5,6] },
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
	$("#cmbPosition").val(data.position).trigger("change");
    userID = data.id;
    
    $("#mdRegister").modal();
});

$("#btnSaveAccount").click(function(){
	var position = $("#cmbPosition").val();
	
	if (position == "" || position == null) {
		JAlert("Please add a position","red");
		return;
    }
	
    $.ajax({
        url: "../program_assets/php/web/account",
        data: {
            command   : 'update_user',
            userID : userID,
            accountStatus : $("#cmbStatus").val(),
			position : position
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
/* User Registration */
var tblAdmin;
var tblUser;
var isNewUser;
var oldEmpID;
var oldUsername;
var oldEmailAddress;
var userID;
var userType;

loadAdministrator();
loadUser();

function loadAdministrator() {
    tblAdmin = 
    $('#tblAdmin').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 12,
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
        	'url'       : '../program_assets/php/web/account.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'display_admin',
                search  : 'Administrator'
        	}    
        },
        'aoColumns' : [
        	{ mData: 'employeeID'},
            { mData: 'username'},
            { mData: 'firstName'},
            { mData: 'middleName'},
            { mData: 'lastName'},
            { mData: 'mobileNumber'},
            { mData: 'email'},
            { mData: 'status'},
            { mData: 'dateCreated'},
            { mData: 'id',
                render: function (data,type,row) {
                    return '' + 
                           '<button type="submit" class="btn btn-default btn-xs dt-button list">' +
                           '	<i class="fa fa-edit"></i>' +
                           '</button>' +
                           '';
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "custom-center", "targets": [9]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5,6,7,8]},
        	{ "width": "1%", "targets": [9] },
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnInitComplete": function (oSettings, json) {
            //alert('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}

function loadUser() {
    tblUser = 
    $('#tblUser').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 12,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-user",
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
        		command : 'display_user'
        	}    
        },
        'aoColumns' : [
        	{ mData: 'employeeID'},
            { mData: 'username'},
            { mData: 'firstName'},
            { mData: 'middleName'},
            { mData: 'lastName'},
            { mData: 'mobileNumber'},
            { mData: 'email'},
            { mData: 'status'},
            { mData: 'dateCreated'},
            { mData: 'id',
                render: function (data,type,row) {
                    return '' + 
                           '<button type="submit" class="btn btn-default btn-xs dt-button list">' +
                           '	<i class="fa fa-edit"></i>' +
                           '</button>' +
                           '';
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "custom-center", "targets": [9]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5,6,7,8]},
        	{ "width": "1%", "targets": [9] },
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnInitComplete": function (oSettings, json) {
            //alert('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}

$("#btnAddAdmin").click(function(){
    oldEmpID = 0;
    userID = 0;
    isNewUser = 1;
    oldEmpID = "";
    oldUsername = "";
    oldEmailAddress = "";
    //$('#cmbEmployeeType option[value="Administrator"]').attr("disabled", false);
    //$('#cmbEmployeeType option[value="Supervisor"]').attr("disabled", true);
    //$('#cmbEmployeeType option[value="Owner"]').attr("disabled", true);
    resetFields();
    $("#btnReset").hide();
	$("#mdAddUser").modal("show");
    userType = "admin";
});

$("#btnAddUser").click(function(){
    oldEmpID = 0;
    userID = 0;
    isNewUser = 1;
    oldEmpID = "";
    oldUsername = "";
    oldEmailAddress = "";
    $('#cmbEmployeeType option[value="Administrator"]').attr("disabled", true);
    $('#cmbEmployeeType option[value="Supervisor"]').attr("disabled", false);
    $('#cmbEmployeeType option[value="Owner"]').attr("disabled", false);
    resetFields();
    $("#btnReset").hide();
	$("#mdAddUser").modal("show");
    userType = "user";
});

$('#tblAdmin tbody').on('click', 'td button', function (){
	var data = tblAdmin.row( $(this).parents('tr') ).data();
    
    isNewUser = 0;
    userID = data.id;
    oldUsername = data.username;
    oldEmailAddress = data.email;
    oldEmpID = data.employeeID;
    
    $('#cmbEmployeeType option[value="Administrator"]').attr("disabled", false);
    $('#cmbEmployeeType option[value="Supervisor"]').attr("disabled", true);
    $('#cmbEmployeeType option[value="Owner"]').attr("disabled", true);
    
    setTimeout(function() {
        $("#txtEmployeeID").val(data.employeeID);
        $("#cmbPosition").val(data.positionID).trigger("change.select2");
        $("#txtFirstName").val(data.firstName);
        $("#txtMiddleName").val(data.middleName);
        $("#txtLastName").val(data.lastName);
        $("#txtEmailAdress").val(data.email);
        $("#txtUsername").val(data.username);
        $("#txtMobileNumber").val(data.mobileNumber);
        $("#chkActive").prop('checked',data.isActive == 1 ? true : false); 
        $("#chkActive").prop("disabled",false);
        $("#txtAddress").val(data.address);
        $("#cmbGender").val(data.gender).trigger("change.select2");
        $("#txtBirthday").val(data.birthday);
        $("#txtJoinDate").val(data.joinDate);
        $("#cmbEmployeeType").val(data.employeeType).trigger("change.select2");
        $("#txtContactName").val(data.contactName);
        $("#txtRelationship").val(data.relationship);
        $("#txtRelationshipContact").val(data.relationshipContact);
        $("#txtRelationshipAddress").val(data.relationshipAddress);
        
        $("#btnReset").show();
        $("#mdAddUser").modal("show");
        userType = "admin";
    }, 500);
});

$('#tblUser tbody').on('click', 'td button', function (){
	var data = tblUser.row( $(this).parents('tr') ).data();
    
    isNewUser = 0;
    userID = data.id;
    oldUsername = data.username;
    oldEmailAddress = data.email;
    oldEmpID = data.employeeID;
    
    $('#cmbEmployeeType option[value="Administrator"]').attr("disabled", false);
    $('#cmbEmployeeType option[value="Supervisor"]').attr("disabled", true);
    $('#cmbEmployeeType option[value="Owner"]').attr("disabled", true);
    
    setTimeout(function() {
        $("#txtEmployeeID").val(data.employeeID);
        $("#cmbPosition").val(data.positionID).trigger("change.select2");
        $("#txtFirstName").val(data.firstName);
        $("#txtMiddleName").val(data.middleName);
        $("#txtLastName").val(data.lastName);
        $("#txtEmailAdress").val(data.email);
        $("#txtUsername").val(data.username);
        $("#txtMobileNumber").val(data.mobileNumber);
        $("#chkActive").prop('checked',data.isActive == 1 ? true : false); 
        $("#chkActive").prop("disabled",false);
        $("#txtAddress").val(data.address);
        $("#cmbGender").val(data.gender).trigger("change.select2");
        $("#txtBirthday").val(data.birthday);
        $("#txtJoinDate").val(data.joinDate);
        $("#cmbEmployeeType").val(data.employeeType).trigger("change.select2");
        $("#txtContactName").val(data.contactName);
        $("#txtRelationship").val(data.relationship);
        $("#txtRelationshipContact").val(data.relationshipContact);
        $("#txtRelationshipAddress").val(data.relationshipAddress);
        
        $("#btnReset").show();
        $("#mdAddUser").modal("show");
        userType = "user";
    }, 500);
});

$('#tblUser tbody').on('click', 'td button', function (){
	var data = tblUser.row( $(this).parents('tr') ).data();
    
    isNewUser = 0;
    userID = data.id;
    oldUsername = data.username;
    oldEmailAddress = data.email;
    oldEmpID = data.employeeID;
    
    $('#cmbEmployeeType option[value="Administrator"]').attr("disabled", true);
    $('#cmbEmployeeType option[value="Supervisor"]').attr("disabled", false);
    $('#cmbEmployeeType option[value="Owner"]').attr("disabled", false);
    
    setTimeout(function() {
        $("#txtEmployeeID").val(data.employeeID);
        $("#cmbPosition").val(data.positionID).trigger("change.select2");
        $("#txtFirstName").val(data.firstName);
        $("#txtMiddleName").val(data.middleName);
        $("#txtLastName").val(data.lastName);
        $("#txtEmailAdress").val(data.email);
        $("#txtUsername").val(data.username);
        $("#txtMobileNumber").val(data.mobileNumber);
        $("#chkActive").prop('checked',data.isActive == 1 ? true : false); 
        $("#chkActive").prop("disabled",false);
        $("#txtAddress").val(data.address);
        $("#cmbGender").val(data.gender).trigger("change.select2");
        $("#txtBirthday").val(data.birthday);
        $("#txtJoinDate").val(data.joinDate);
        $("#cmbEmployeeType").val(data.employeeType).trigger("change.select2");
        $("#txtContactName").val(data.contactName);
        $("#txtRelationship").val(data.relationship);
        $("#txtRelationshipContact").val(data.relationshipContact);
        $("#txtRelationshipAddress").val(data.relationshipAddress);
        
        $("#btnReset").show();
        $("#mdAddUser").modal("show");
    }, 500);
});

$("#btnSaveUser").click(function(){
    var empID        = $("#txtEmployeeID").val();
    var firstName    = $("#txtFirstName").val();
    var middleName   = $("#txtMiddleName").val();
    var lastName     = $("#txtLastName").val();
    var emailAddress = $("#txtEmailAdress").val();
    var username     = $("#txtUsername").val();
    var mobileNumber = $("#txtMobileNumber").val();
    var address             = $("#txtAddress").val();
    var gender              = $("#cmbGender").val();
    var birthday            = $("#txtBirthday").val();
    var joinDate            = $("#txtJoinDate").val();
    var employeeType        = $("#cmbEmployeeType").val();
    var contactName         = $("#txtContactName").val();
    var relationship        = $("#txtRelationship").val();
    var relationshipContact = $("#txtRelationshipContact").val();
    var relationshipAddress = $("#txtRelationshipAddress").val();
    
    var isActive;
    
    if ($("#chkActive").prop('checked') == true) {
        isActive = 1;
    } else {
        isActive = 0;
    }

    
    if (empID == ""  || firstName == "" || lastName == "" || emailAddress == "" || username == "" || mobileNumber == "" || 
        address == "" || gender == "" || birthday == "" || joinDate == "" || employeeType == "" || contactName == "" ||
        relationship == "" || relationshipContact == "" || relationshipAddress == ""
        ) {
        JAlert("Please fill in required fields","red");
    } else if (!validateEmail(emailAddress)) {
        JAlert("Please provide a proper email","red");
    } else if (mobileNumber.length < 11 || relationshipContact.length < 11) {
        JAlert("Mobile number must be 11 digits","red");
    } else if (mobileNumber == relationshipContact) {
        JAlert("Please provide different contact in Basic Information and Emergency Contact","red");
    } else if (submitBday() < 18) {
        JAlert("Please provide proper birthday. The users age must be 18 and above","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/account.php",
            data: {
                command : "new_user",
                isNewUser : isNewUser,
                userID : userID,
                oldEmpID : oldEmpID,
                oldUsername : oldUsername,
                oldEmailAddress : oldEmailAddress,
                empID : empID,
                firstName : firstName,
                middleName : middleName,
                lastName : lastName,
                emailAddress : emailAddress,
                username : username,
                mobileNumber : mobileNumber,
                isActive : isActive,
                address : address,
                gender : gender,
                birthday : birthday,
                joinDate : joinDate,
                employeeType : employeeType,
                contactName : contactName,
                relationship : relationship,
                relationshipContact : relationshipContact,
                relationshipAddress : relationshipAddress
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {
                    
                    switch (userType) {
                        case "admin" :
                                loadAdministrator();
                            break;
                        case "user" :
                                loadUser();
                            break;
                    }
                    
                    $("#mdAddUser").modal("hide");
                }
            }
        });
    }
});

$("#btnExportAdmin").click(function(){
	$(".btn-export-admin").click();
});

$('#txtSearchAdmin').keyup(function(){
    tblAdmin.search($(this).val()).draw();
});

$("#btnExportUser").click(function(){
	$(".btn-export-user").click();
});

$('#txtSearchUser').keyup(function(){
    tblUser.search($(this).val()).draw();
});


$('#btnReset').click(function(){
    $.ajax({
        url: "../program_assets/php/web/account.php",
        data: {
            command : "reset_password",
            userID : userID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
        }
    });
});

function resetFields() {
    $("#txtEmployeeID").val(null);
    $("#txtFirstName").val(null);
    $("#txtMiddleName").val(null);
    $("#txtLastName").val(null);
    $("#txtEmailAdress").val(null);
    $("#txtUsername").val(null);
    $("#txtMobileNumber").val(null);
    $("#txtAddress").val(null);
    $("#txtBirthday").val(null);
    $("#txtJoinDate").val(0);
    $("#txtContactName").val(null);
    $("#txtRelationship").val(null);
    $("#txtRelationshipContact").val(null);
    $("#txtRelationshipAddress").val(null);
    //$("#cmbEmployeeType").val(null).trigger('change.select2');
    $("#cmbGender").val(null).trigger('change.select2');
    
    $("#chkActive").prop("checked", true);
    $("#chkActive").prop("disabled", true);
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
}

function numOnly(selector){
    selector.value = selector.value.replace(/[^0-9]/g,'');
}

function submitBday() {
    var Bdate = document.getElementById('txtBirthday').value;
    var Bday = +new Date(Bdate);
    return ((Date.now() - Bday) / (31557600000));
}

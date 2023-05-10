var tblGAD;

$("#btnAddGAD_").click(function(){
	$("#mdGADList").modal();
    $("#txtSearchGAD").val(null);
    loadGAD();
    selectedGADID = 0;
    selectedGAD = "";
});

function loadGAD() {
    tblGAD = 
    $('#tblGAD').DataTable({
        'destroy'       : true,
        'paging'        : false,
        'lengthChange'  : false,
        'pageLength'    : 100,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-gad",
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
        	'url'       : '../program_assets/php/web/masterfile.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_gad',
        	}    
        },
        'aoColumns' : [
            { mData: 'id',
                render: function (data,type,row) {
                    return `
                        <center>
                             <input id="gad${row.id}" name="gad${row.id}" class="gad-radio" type="radio">
                        </center>
                    `;
                }
            },
        	{ mData: 'year'},
            { mData: 'statement',
                render: function (data,type,row) {
                    return '<span style="white-space:normal">' + row.statement + "</span>";
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "dt-center", "targets": [0,1,2]},
            {"className": "custom-center", "targets": [0]}
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

$('#tblGAD tbody').on('click', 'td', function (){
	var data = tblGAD.row( $(this).parents('tr') ).data();
    
    tblGAD.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var row_data = this.data();
        
        $(`#gad${row_data.id}`).prop("checked", false);
    });
    
    selectedGADID = data.id;
    selectedGAD = data.statement;
    
    $(`#gad${data.id}`).prop("checked", true);
});

$('#txtSearchGAD').keyup(function(){
    tblGAD.search($(this).val()).draw();
});

$("#btnSelectGAD").click(function(){
	if (selectedGADID == 0) {
        JAlert("Please select GAD","orange");
    } else {
        $("#txtGADAddress").val(selectedGAD);
        $("#mdGADList").modal("hide");
    }
});


var tblGenderList;

$("#btnAddGender_").click(function(){
	$("#mdGenderList").modal();
    $("#txtSearchGenderList").val(null);
    loadGender();
    selectedGenderID = 0;
    selectedGender = "";
});

function loadGender() {
    tblGenderList = 
    $('#tblGenderList').DataTable({
        'destroy'       : true,
        'paging'        : false,
        'lengthChange'  : false,
        'pageLength'    : 1000,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-gender",
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
        	'url'       : '../program_assets/php/web/masterfile.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_gender',
        	}    
        },
        'aoColumns' : [
            { mData: 'id',
                render: function (data,type,row) {
                    return `
                        <center>
                             <input id="gender${row.id}" name="gad${row.id}" class="gad-radio" type="radio">
                        </center>
                    `;
                }
            },
        	{ mData: 'year'},
            { mData: 'statement',
                render: function (data,type,row) {
                    return '<span style="white-space:normal">' + row.statement + "</span>";
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "dt-center", "targets": [0,1,2]},
            {"className": "custom-center", "targets": [0]}
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

$('#tblGenderList tbody').on('click', 'td', function (){
	var data = tblGenderList.row( $(this).parents('tr') ).data();
    
    tblGenderList.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var row_data = this.data();
        
        $(`#gender${row_data.id}`).prop("checked", false);
    });
    
    selectedGenderID = data.id;
    selectedGender = data.statement;
    
    $(`#gender${data.id}`).prop("checked", true);
});

$('#txtSearchGenderList').keyup(function(){
    tblGenderList.search($(this).val()).draw();
});

$("#btnSelectGender").click(function(){
	if (selectedGenderID == 0) {
        JAlert("Please select Gender","orange");
    } else {
        $("#txtGenderIssueAddress").val(selectedGender);
        $("#mdGenderList").modal("hide");
    }
});


var tab;
var oldStatementID;

$("#btnAddGAD").click(function(){
	oldStatementID = 0;
    $("#mdDetails").modal();
    tab = "gad";
    
    $("#txtStatement").val("");
});

$("#btnAddGender").click(function(){
	oldStatementID = 0;
    $("#mdDetails").modal();
    tab = "gender";
    
    $("#txtStatement").val("");
});

$("#btnSaveStatement").click(function(){
	var statement = $("#txtStatement").val();
    
    if (statement == "") {
        JAlert("Please fill in required fields","red");
    } else{
        $.ajax({
            url: "../program_assets/php/web/masterfile",
            data: {
                command    : 'save_details',
                tab        : tab,
                statement  : statement.replace("'",""),
                id         : oldStatementID
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {
                    $("#mdDetails").modal("hide");
                    
                    if (tab == "gad") {
                        loadGAD();
                    } else if (tab == "gender") {
                        loadGender();
                    }
                }
            }
        });
    }
});
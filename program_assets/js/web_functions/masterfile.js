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

loadGAD();
loadGender();

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


$("#btnExportGAD").click(function(){
	$(".btn-export-gad").click();
});

$('#txtSearchGAD').keyup(function(){
    tblGAD.search($(this).val()).draw();
});

$('#tblGAD tbody').on('click', '.gad-edit', function (){
	var data = tblGAD.row( $(this).parents('tr') ).data();
    
    oldStatementID = data.id;
    $("#mdDetails").modal();
    tab = "gad";
    
    $("#txtStatement").val(data.statement);
});


$('#tblGAD tbody').on('click', '.gad-delete', function (){
	var data = tblGAD.row( $(this).parents('tr') ).data();

    oldStatementID = data.id;
    tab = "gad";
    
    JConfirm("Are you sure you want to delete this statement?-orange", () => {
        $.ajax({
            url: "../program_assets/php/web/masterfile",
            data: {
                command   : 'delete_gad',
                id : data.id
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {
                    if (tab == "gad") {
                        loadGAD();
                    } else if (tab == "gender") {
                        loadGender();
                    }
                }
            }
        });
    }, () => {
        //JAlert("Process has been cancelled","blue");
    });
});

function loadGAD() {
    tblGAD = 
    $('#tblGAD').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 5,
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
        	{ mData: 'year'},
            { mData: 'statement',
                render: function (data,type,row) {
                    return '<span style="white-space:normal">' + row.statement + "</span>";
                }
            },
            { mData: 'id',
                render: function (data,type,row) {
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list gad-edit">' +
                           '		<i class="fa fa-edit"></i>' +
                           '	</button>' +
                           '</div>' +
                           '&nbsp; &nbsp;' + 
                           '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list gad-delete">' +
                           '		<i class="fa fa-trash"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "dt-center", "targets": [0,1,2]},
			{"className": "custom-center", "targets": [2]},
        	{ "width": "1%", "targets": [0,2] },
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

$("#btnExportGender").click(function(){
	$(".btn-export-gender").click();
});

$('#txtSearchGender').keyup(function(){
    tblGender.search($(this).val()).draw();
});

$('#tblGender tbody').on('click', '.gender-edit', function (){
	var data = tblGender.row( $(this).parents('tr') ).data();
    
    oldStatementID = data.id;
    $("#mdDetails").modal();
    tab = "gender";
    
    $("#txtStatement").val(data.statement);
});


$('#tblGender tbody').on('click', '.gender-delete', function (){
	var data = tblGender.row( $(this).parents('tr') ).data();

    oldStatementID = data.id;
    tab = "gender";
    
    JConfirm("Are you sure you want to delete this statement?-orange", () => {
        $.ajax({
            url: "../program_assets/php/web/masterfile",
            data: {
                command   : 'delete_gad',
                id : data.id
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {
                    if (tab == "gad") {
                        loadGAD();
                    } else if (tab == "gender") {
                        loadGender();
                    }
                }
            }
        });
    }, () => {
        //JAlert("Process has been cancelled","blue");
    });
});


function loadGender() {
    tblGender = 
    $('#tblGender').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 5,
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
        	{ mData: 'year'},
            { mData: 'statement',
                render: function (data,type,row) {
                    return '<span style="white-space:normal">' + row.statement + "</span>";
                }
            },
            { mData: 'id',
                render: function (data,type,row) {
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list gender-edit">' +
                           '		<i class="fa fa-edit"></i>' +
                           '	</button>' +
                           '</div>' +
                           '&nbsp; &nbsp;' + 
                           '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list gender-delete">' +
                           '		<i class="fa fa-trash"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "dt-center", "targets": [0,1,2]},
			{"className": "custom-center", "targets": [2]},
        	{ "width": "1%", "targets": [0,2] },
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
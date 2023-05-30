var tblCollege;
var collegeID;
var college;
var oldCollege;

$("#btnAddCollege").click(function(){
    collegeID = 0;
    college = "";
    oldCollege = "";
    
    $("#txtCollege").val("");
    $("#mdCollege").modal();
});

$('#tblCollege tbody').on('click', '.col-edit', function (){
	var data = tblCollege.row( $(this).parents('tr') ).data();
    
    collegeID = data.id;
    college = data.college;
    oldCollege = data.college;
    
    $("#txtCollege").val(data.college);
    $("#mdCollege").modal();
});

$('#tblCollege tbody').on('click', '.col-delete', function (){
	var data = tblCollege.row( $(this).parents('tr') ).data();
    
    collegeID = data.id;
    
    $.ajax({
        url: "../program_assets/php/web/masterfile.php",
        data: {
            command    : 'delete_college',
            collegeID  : collegeID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                loadCollege();
            }
        }
    });
});

$("#btnSaveCollege").click(function(){
	var college = $("#txtCollege").val();
    
    if (college == "") {
        JAlert("Please input college","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/masterfile.php",
            data: {
                command    : 'save_college',
                collegeID  : collegeID,
                college    : college,
                oldCollege : oldCollege
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {
                    loadCollege();
                    $("#mdCollege").modal("hide");
                }
            }
        });
    }
});

loadCollege();

function loadCollege() {
    tblCollege = 
        $('#tblCollege').DataTable({
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
                className: "btn btn-default btn-sm hide btn-export-college",
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
                    command : 'load_college',
                }    
            },
            'aoColumns' : [
                { mData: 'college'},
                { mData: 'id',
                    render: function (data,type,row) {
                        return '<div class="input-group">' + 
                               '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list col-edit">' +
                               '		<i class="fa fa-edit"></i>' +
                               '	</button>' +
                               '</div>' +
                               '&nbsp; &nbsp;' + 
                               '<div class="input-group">' + 
                               '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list col-delete">' +
                               '		<i class="fa fa-trash"></i>' +
                               '	</button>' +
                               '</div>';
                    }
                }
            ],
            'aoColumnDefs': [
                {"className": "dt-center", "targets": [0,1]},
                {"className": "custom-center", "targets": [1]},
                { "width": "1%", "targets": [1] },
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

$("#btnExportCollege").click(function(){
	$(".btn-export-college").click();
});

$('#txtSearchCollege').keyup(function(){
    tblCollege.search($(this).val()).draw();
});
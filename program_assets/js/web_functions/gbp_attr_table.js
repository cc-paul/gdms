var tblAttrMain;

loadAttr();


$('#tblAttrMain tbody').on('click', '.delete', function (){
	var data = tblAttrMain.row( $(this).parents('tr') ).data();
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'delete_activity',
            id : data.id
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                loadAttr();
            }
        }
    });
});

$('#tblAttrMain tbody').on('click', '.copy', function (){
	var data = tblAttrMain.row( $(this).parents('tr') ).data();
    var newFolderID = makeid(5);
    var oldFolderID = data.folderID;
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command : 'create_folder_copy',
            oldFolderID : oldFolderID,
            newFolderID : newFolderID
        },
        type: 'post',
        success: function (data) {
            var data1 = jQuery.parseJSON(data);
            
            if (data[0].error) {
                JAlert(data[0].message,data[0].color);
            } else {
                $.ajax({
                    url: "../program_assets/php/web/gbp",
                    data: {
                        command   : 'copy_activity',
                        oldFolderID : oldFolderID,
                        newFolderID : newFolderID
                    },
                    type: 'post',
                    success: function (data) {
                        var data = jQuery.parseJSON(data);
                        
                        JAlert(data[0].message,data[0].color);
                        
                        if (!data[0].error) {
                            loadAttr();
                        }
                    }
                });
            }
        }
    });
});


$('#txtSearchAttr').keyup(function(){
    tblAttrMain.search($(this).val()).draw() ;
});


$("#cmbAttrXEntries").on("change", function() {
    var val = $(this).val();
    changeAttrRow(val);
});

function changeAttrRow(row) {
    tblAttrMain.page.len(row).draw('page');
    tblAttrMain.page.len(row).draw();
}

function loadAttr() {
    tblAttrMain = 
    $('#tblAttrMain').DataTable({
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
        	'url'       : '../program_assets/php/web/gbp.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_attr',
				parentFolderID : parentFolderID
        	}    
        },
        'aoColumns' : [
			 { mData: 'program',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal"><b>Gender Issue : </b>${row.program}</span>
                    `;
                }
            },
            { mData: 'budget'},
            { mData: 'source',
                render: function (data,type,row) {
                    var datas = "";
                    var str_array = row.source.split('~~');
                    var arr_data = [];
                    
                    for(var i = 0; i < str_array.length; i++) {
                        var [budgetSource,budgetItem,budget] = str_array[i].split('~');
                                            
                        arr_data.push(`
                            <label class="cust-label">Budget Source:&nbsp;</label>${budgetSource}
                            <br>
                            <label class="cust-label">Budget Item:&nbsp;</label>${budgetItem}
                            <br>
                            <label class="cust-label">Budget Amount:&nbsp;</label>${budget}              
                        `);
                    }
                    
                    return arr_data.join("<br><br>");
                }
            },
            { mData: 'files',
                render: function (data,type,row) {
                    var datas = "";
					var arr_data = [];
                    
					if (row.files != null) {
						var str_array = row.files.split(',');
                    
						for(var i = 0; i < str_array.length; i++) {           
							arr_data.push(`
								<a href="#" onclick="downLoadFile('${row.folderID}','${str_array[i]}')">
									${str_array[i]}
								</a>              
							`);
						}
                    }
                    
                    return arr_data.join("<br>");
                }
            },
            { mData: 'id',
                render: function (data,type,row) {
                    return `
                        <button type="button" class="btn btn-default edit">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-default copy">
                            <i class="fa fa-copy"></i>
                        </button>
                        <button type="button" class="btn btn-default delete">
                            <i class="fa fa-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        'aoColumnDefs': [
        	{ "width": "1%", "targets": [4] }
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
            //computeGAD();
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}
/* Meal Type */

var tblMeal;
var isNewMeal;
var oldMeal;
var mealID;

$("#btnMealMasterfile").click(function(){
    $("#txtSearchMeal").val("");
    $("#mdMealList").modal();
    loadMealList();
});

$("#btnAddMeal").click(function(){
	$("#txtMealName").val("");
    $("#txtMealDescription").val("");
    $("#chkMealActive").prop("checked", true);
    $("#chkMealActive").prop("disabled", true);
    $("#mdMealTypeForm").modal();
    $("#mdMealList").modal("hide");
    isNewMeal = 1;
    oldMeal = "";
    mealID = 0;
});

$('#tblMeal tbody').on('click', 'td button', function (){
	var data = tblMeal.row( $(this).parents('tr') ).data();
    
    $("#txtMealName").val(data.meal);
    $("#txtMealDescription").val(data.description);
    $("#chkMealActive").prop("checked", data.isActive == 1 ? true : false);
    $("#chkMealActive").prop("disabled", false);
    $("#mdMealTypeForm").modal();
    $("#mdMealList").modal("hide");
    isNewMeal = 0;
    oldMeal = data.meal;
    mealID = data.id;
});

$("#btnSaveMeal").click(function(){
    var meal        = $("#txtMealName").val();
    var description = $("#txtMealDescription").val();
    var isActive    = $("#chkMealActive").prop('checked') ? 1 : 0;
    
    if (meal == "" || description == "") {
        JAlert("Please fill in required fields","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/diet.php",
            data: {
                command     : 'new_meal',
                meal        : meal,
                description : description,
                isActive    : isActive,
                isNewMeal   : isNewMeal,
                oldMeal     : oldMeal,
                mealID      : mealID
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {                    
                    $("#mdMealTypeForm").modal("hide");
                    $("#mdMealList").modal();
                    loadMealList()
                }
            }
        });
    }
});

function loadMealList() {
    tblMeal = 
    $('#tblMeal').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-meal",
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
        	'url'       : '../program_assets/php/web/diet.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_meal_list',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'meal'},
            { mData: 'description',
                render: function (data,type,row) {
                    return row.description.length >= 70 ? row.description.substring(0, 70) + '...' : row.description;
                }
            },
            { mData: 'status'},
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
        	{"className": "custom-center", "targets": [4]},
        	{"className": "dt-center", "targets": [0,1,2,3,4]},
        	{ "width": "1%", "targets": [0,2,3,4] },
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

$('#txtSearchMeal').keyup(function(){
    tblMeal.search($(this).val()).draw();
});

$("#btnMealExport").click(function(){
	$(".btn-export-meal").click();
});

/* Meal Plan */
var tblRecipes;
var tblProcedure;
var isNewMealPlan;
var tblMealPlanList;
var tblMealPlanList2;
var oldMealPlan = "";
var oldMealPlanID = 0;

$('.tokenize').tokenize2();

$("#cmbMealType").on("tokenize:select", function () {
    $("#cmbMealType").trigger('tokenize:search', "");
});

loadMealPlanList();

$("#btnNewMealPlan").click(function(){
	$("#mdMealPlanForm").modal();
    prepareRecipeTable();
    prepareProcedureTable();
    tblRecipes.clear().draw();
    tblProcedure.clear().draw();
    $("#txtMealPlanName").val("");
    $("#txtCaloriesCount").val("");
    $("#cmbMealTime").val(null).trigger("change");
    $("#cmbMealType").tokenize2().trigger('tokenize:clear');
    $("#txtMealPlanDescription").val("");
    $("#chkMealPlanActive").prop("checked", true);
    $("#chkMealPlanActive").prop("disabled", false);
    isNewMealPlan = 1;
    $("#dvImageHolder").hide();
    $("#btnUploadPhoto").hide();
    $("#dvProgressHolder").hide();
});

$('#tblMealPlanList tbody').on('click', 'td button', function (){
	var data = tblMealPlanList.row( $(this).parents('tr') ).data();
    
    $("#mdMealPlanForm").modal();
    prepareRecipeTable();
    prepareProcedureTable();
    tblRecipes.clear().draw();
    tblProcedure.clear().draw();
    $("#txtMealPlanName").val(data.mealPlanName);
    oldMealPlan = data.mealPlanName;
    oldMealPlanID = data.id;
    $("#txtCaloriesCount").val(data.caloriesCount);
    $("#cmbMealTime").val(data.mealTime).trigger("change");
    $("#cmbMealType").tokenize2().trigger('tokenize:clear');
    
    var arrMealTypes = data.mealTypes.split(",");
    var arrRecipe    = data.recipes.split("~");
    var arrProcedure = data.procedure.split("~");
    
    for (var i = 0; i < arrMealTypes.length; i++) {
        var [id,mealType] = arrMealTypes[i].split('~');
        
        $('#cmbMealType').tokenize2().trigger('tokenize:tokens:add', [id,mealType, true]);
    }
    
    for (var i = 0; i < arrRecipe.length; i++) {    
        var rowCount = Number(tblRecipes.data().count()) + 1;
    
        tblRecipes.row.add({
            "id" : rowCount + "~" + arrRecipe[i]
        }).draw( false );
    }
    
    for (var i = 0; i < arrProcedure.length; i++) {    
        var rowCount = Number(tblProcedure.data().count()) + 1;
    
        tblProcedure.row.add({
            "id" : rowCount + "~" + arrProcedure[i]
        }).draw( false );
    }
    
    $("#txtMealPlanDescription").val(data.unf_description);
    $("#chkMealPlanActive").prop("checked", data.isActive == 1 ? true:false);
    $("#chkMealPlanActive").prop("disabled", false);
    isNewMealPlan = 0;
    $("#dvImageHolder").show();
    $("#btnUploadPhoto").show();
    $("#img-n-thumb").removeClass("image-no-thumb");
    $("#img-n-thumb").removeClass("image-w-thumb");
    $("#dvProgressHolder").show();
    $("#dvProgress").css("width","0%");
    

    if (data.hasThumbnail == 1) {
        $("#img-n-thumb").attr("src","../thumbnails/"+  data.id +".png?random" + Math.random());
        $("#img-n-thumb").addClass("image-w-thumb");
    } else {
        $("#img-n-thumb").attr("src","../thumbnails/photo.png");
        $("#img-n-thumb").addClass("image-no-thumb");
    }
    
    $.ajax({
        url: "../program_assets/php/web/diet",
        data: {
            command : 'create_folder',
            folderID : oldMealPlanID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            if (data[0].error) {
                JAlert(data[0].message,data[0].error);
            } else {
                loadPictures(oldMealPlanID);
            }
        }
    });
});

function loadPictures(cFolderID) {
    $.ajax({
        url: '../program_assets/php/web/diet.php',
        data: {
            command  : 'load_files',
            folderID : cFolderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            $("#dvImageHolder").html("");
            var images = "";
            
            
            for (var i = 0; i < data.length; i++) {
                var fileName = data[i].fileName;
                
                images += `
                    <div class="col-md-4 col-xs-12">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <img class="img-meal" src="../diet/${cFolderID}/${fileName}"></img>
                            </div>
                            <div class="panel-footer">
                                <button type="button" class="btn btn-block btn-danger btn-sm cust-textbox" onclick="deleteThisPhoto(${cFolderID},'${fileName}')">	
                                    <i class="fa fa-trash"></i>
                                    &nbsp;
                                    Delete Photo
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            $("#dvImageHolder").html(images);
        }
    });
}

function deleteThisPhoto(folderID,fileName) {
    $.ajax({
        url: '../program_assets/php/web/diet.php',
        data: {
            command  : 'delete_photo',
            fileName : fileName,
            folderID : folderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            if (!data[0].error) {
                loadPictures(folderID);
                loadMealPlanList();
            } else {
                JAlert(data[0].message,data[0].color);
            }
        }
    });
}

function uploadThumb() {
    var file_data = $('#image_uploader').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);    
    form_data.append('folderID', oldMealPlanID);
    form_data.append('command', 'upload_photo');
    $.ajax({
        url: '../program_assets/php/web/diet.php',
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        beforeSend: function(){
            //$("#file-progress-bar").width('0%');
            console.log(0);
            $("#dvProgress").css("width","0%");
            $("#btnUploadPhoto").prop("disabled", true);
        },
        xhr: function() {
            var xhr = new window.XMLHttpRequest();         
            xhr.upload.addEventListener("progress", function(element) {
               if (element.lengthComputable) {
                  var percentComplete = ((element.loaded / element.total) * 100);
                  //$("#file-progress-bar").width(percentComplete + '%');
                  //$("#file-progress-bar").html(percentComplete+'%');
                  console.log(percentComplete);
                  $("#dvProgress").css("width",percentComplete + "%");
               }
            }, false);
            return xhr;
        },
        success: function(data) {
         var data = jQuery.parseJSON(data);

            if (!data[0].error) {
                $("#image_uploader").val(null);
                
                
                setTimeout(function() {
                    $("#dvProgress").css("width","0%");
                    $("#btnUploadPhoto").prop("disabled", false);
                }, 1500);
                
                loadPictures(oldMealPlanID);
                loadMealPlanList();
            } else {
                JAlert(data[0].message,data[0].color);
            }
        }
    });
}

$("#btnAddRecipe").click(function(){
	var rowCount = Number(tblRecipes.data().count()) + 1;
    
    tblRecipes.row.add({
        "id" : rowCount + "~"
    }).draw( false );
});

$("#btnAddProcedure").click(function(){
	var rowCount = Number(tblProcedure.data().count()) + 1;
    
    tblProcedure.row.add({
        "id" : rowCount + "~"
    }).draw( false );
});

$('#tblRecipes tbody').on( 'click', '.delete_recipe', function () {
	tblRecipes.row($(this).parents('tr')).remove().draw();
});

$('#tblProcedure tbody').on( 'click', '.delete_proc', function () {
	tblProcedure.row($(this).parents('tr')).remove().draw();
});

$("#btnSaveMealPlan").click(function(){
    var mealPlanName      = $("#txtMealPlanName").val().replace("'","");
    var caloriesCount     = $("#txtCaloriesCount").val();
    var mealTime          = $("#cmbMealTime").val();
    var description       = $("#txtMealPlanDescription").val();
    var mealType          = $("#cmbMealType").val();
    var isActive          = $("#chkMealPlanActive").prop('checked') ? 1 : 0;
    var rowCountRecipe    = Number(tblRecipes.data().count());
    var rowCountProcedure = Number(tblProcedure.data().count());
    var hasEmptyRecipe    = false;
    var hasEmptyProcedure = false;
    var arrRecipes        = [];
    var arrProcedures     = [];
    var arrMealType       = [];    
    
    for (var i = 0; i < mealType.length; i++) {
        arrMealType.push("(fitNessID," + mealType[i] + ")");
    }
    
    if (mealPlanName == "" || caloriesCount == "" || mealTime == "" || description == "" || arrMealType.length == 0) {
        JAlert("Please fill in required fields","red");
        return;
    }
    
    if (rowCountRecipe == 0) {
        JAlert("Please add at least 1 recipe","red");
        return;
    }
    
    if (rowCountProcedure == 0) {
        JAlert("Please add at least 1 procedure","red");
        return;
    }
    
    tblRecipes.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        
        var [id,desc] = data.id.split('~');
        
        if ($("#recipe_" + id).val().trim().length == 0) {
            hasEmptyRecipe = true;
        } else {
            arrRecipes.push("(fitNessID,'" + $("#recipe_" + id).val().replace("'","") + "',1)");
        }
    });
    
    tblProcedure.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        
        var [id,desc] = data.id.split('~');
        
        if ($("#proc_" + id).val().trim().length == 0) {
            hasEmptyProcedure = true;
        } else {
            arrProcedures.push("(fitNessID,'" + $("#proc_" + id).val().replace("'","") + "',2)");
        }
    });
    
    if (hasEmptyRecipe) {
        JAlert("You have an empty field in recipe list","red");
        return;
    }
    
    if (hasEmptyProcedure) {
        JAlert("You have an empty field in procedure list","red");
        return;
    }
    
    
    
    $.ajax({
        url: "../program_assets/php/web/diet",
        data: {
            command        : 'save_mealplan',
            isNewMealPlan  : isNewMealPlan,
            mealPlanName   : mealPlanName.replace("'",""),
            caloriesCount  : caloriesCount,
            mealTime       : mealTime,
            description    : description.replace("'",""),
            arrMealType    : arrMealType.join(","),
            arrRecipes     : arrRecipes.join(","),
            arrProcedures  : arrProcedures.join(","),
            isActive       : isActive,
            oldMealPlan    : oldMealPlan.replace("'",""),
            oldMealPlanID  : oldMealPlanID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                $("#mdMealPlanForm").modal("hide");
                loadMealPlanList();
            }
        }
    });
    
});

function prepareRecipeTable() {
    tblRecipes = 
    $('#tblRecipes').DataTable({
        'destroy'       : true,
        'paging'        : false,
        'lengthChange'  : false,
        "ordering"      : false,
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        "language": {
            "emptyTable": "List down all recipes needed to made the meal"
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
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'aoColumns' : [
            {"data": "id",
                render: function(data, type, row) {
                    var [id,description] = row.id.split('~');
                    
                    return 	'<input type="text" id="recipe_' + id + '" name="recipe_' + id + '" class="form-control cust-label cust-textbox dt-textbox" style="width:100% !important;" value="'+ description +'" autocomplete="off">';				
                }
            },
            { mData: 'id',
                render: function (data,type,row) {
                   var [id,description] = row.id.split('~');
                    
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + id + '" type="submit" class="btn btn-default btn-xs dt-button list delete_recipe">' +
                           '		<i class="fa fa-trash"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
            {"className": "custom-center", "targets": [1]},
        	{ "width": "1%", "targets": [1] }
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

function prepareProcedureTable() {
    tblProcedure = 
    $('#tblProcedure').DataTable({
        'destroy'       : true,
        'paging'        : false,
        'lengthChange'  : false,
        "ordering"      : false,
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        "language": {
            "emptyTable": "List down all procedures needed to made the meal"
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
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'aoColumns' : [
            {"data": "id",
                render: function(data, type, row) {
                    var [id,description] = row.id.split('~');
                    
                    return 	'<input type="text" id="proc_' + id + '" name="proc_' + id + '" class="form-control cust-label cust-textbox dt-textbox" style="width:100% !important;" value="'+ description +'" autocomplete="off">';				
                }
            },
            { mData: 'id',
                render: function (data,type,row) {
                    var [id,description] = row.id.split('~');
                    
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + id + '" type="submit" class="btn btn-default btn-xs dt-button list delete_proc">' +
                           '		<i class="fa fa-trash"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
            {"className": "custom-center", "targets": [1]},
        	{ "width": "1%", "targets": [1] }
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

function loadMealPlanList() {
    tblMealPlanList = 
    $('#tblMealPlanList').DataTable({
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
            className: "btn btn-default btn-sm hide",
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
        	'url'       : "../program_assets/php/web/diet",
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_mealplan',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'mealPlanName',
                render: function (data,type,row) {
                    var image = row.hasThumbnail == 1 ? `<i class="fa fa-fw fa-file-image-o" style="margin-left:5px;"></i>` : ``;
                    return row.mealPlanName + image;
                }
            },
            { mData: 'caloriesCount'},
            { mData: 'mealTime'},
            { mData: 'fmealTypes',
                render: function (data,type,row) {
                    var mealTypeTag = "";
                    var splitMealType = row.fmealTypes.split(',');
                    
                    for (var i = 0; i < splitMealType.length; i++) {
                        mealTypeTag += '<small class="label bg-gray cust-label">' + splitMealType[i] + '</small>&nbsp;';
                    }
                    
                    return mealTypeTag;
                }    
            },
            { mData: 'description',
                render: function (data,type,row) {
                    return row.description.length >= 100 ? row.description.substring(0, 100) + '...' : row.description;
                }
            },
            { mData: 'status'},
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
        	{"className": "custom-center", "targets": [7]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5,6]},
            { "width": "20%", "targets": [3] },
        	{ "width": "1%", "targets": [0,1,2,5,6,7] },
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
    
    
    tblMealPlanList2 = 
    $('#tblMealPlanList2').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-mealplanlist",
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
        	'url'       : "../program_assets/php/web/diet",
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_mealplan',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'mealPlanName'},
            { mData: 'caloriesCount'},
            { mData: 'mealTime'},
            { mData: 'fmealTypes'},
            { mData: 'unf_description'},
            { mData: 'status'},
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
        	{"className": "custom-center", "targets": [7]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5,6]},
        	{ "width": "1%", "targets": [0,1,5,6,7] },
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

$("#btnExportMeal").click(function(){
	$(".btn-export-mealplanlist").click();
});

$('#txtSearchMealPlan').keyup(function(){
    tblMealPlanList.search($(this).val()).draw();
    tblMealPlanList2.search($(this).val()).draw();
});

function numOnly(selector){
    selector.value = selector.value.replace(/[^0-9]/g,'');
}

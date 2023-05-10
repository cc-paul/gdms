/* Target Body Masterfile */
var isNewTargetBody;
var oldBodyPart;
var tblTargetBody;
var bodyPartId;

$("#btnTargetBody").click(function(){
    $('#txtSearchBodyPart').val("");
    $("#mdTargetBody").modal();
    loadTargetBody();
});

$("#btnAddBodyPart").click(function(){
	$("#txtBodyPart").val("");
    $("#txtBodyPartDescription").val("");
    $("#chkBodyPartActive").prop("checked", true);
    $("#chkBodyPartActive").prop("disabled", true);
    $("#mdTargetBodyForm").modal();
    $("#mdTargetBody").modal("hide");
    isNewTargetBody = 1;
    oldBodyPart = "";
    bodyPartId = 0;
});

$('#tblTargetBody tbody').on('click', 'td button', function (){
	var data = tblTargetBody.row( $(this).parents('tr') ).data();
    
    $("#txtBodyPart").val(data.bodyPart);
    $("#txtBodyPartDescription").val(data.description);
    $("#chkBodyPartActive").prop("checked", data.isActive == 1 ? true : false);
    $("#chkBodyPartActive").prop("disabled", false);
    $("#mdTargetBodyForm").modal();
    $("#mdTargetBody").modal("hide");
    isNewTargetBody = 0;
    oldBodyPart = data.bodyPart;
    bodyPartId = data.id;
});

$("#btnSaveBodyPart").click(function(){
    var bodyPart    = $("#txtBodyPart").val();
    var description = $("#txtBodyPartDescription").val();
    var isActive    = $("#chkBodyPartActive").prop('checked') ? 1 : 0;
    
    if (bodyPart == "" || description == "") {
        JAlert("Please fill in required fields","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/workout.php",
            data: {
                command         : 'new_target_body',
                bodyPart        : bodyPart,
                description     : description,
                isActive        : isActive,
                isNewTargetBody : isNewTargetBody,
                oldBodyPart     : oldBodyPart,
                bodyPartId      : bodyPartId
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {
                    $("#mdTargetBodyForm").modal("hide");
                    loadTargetBody();
                    $("#mdTargetBody").modal();
                }
            }
        });
    }
});

function loadTargetBody() {
    tblTargetBody = 
    $('#tblTargetBody').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-bodypart",
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
        	'url'       : '../program_assets/php/web/workout.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_target_body',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'bodyPart'},
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

$('#txtSearchBodyPart').keyup(function(){
    tblTargetBody.search($(this).val()).draw();
});

$("#btnTargetBodyExport").click(function(){
	$(".btn-export-bodypart").click();
});

/* Fitness Plan */
var isNewFitnessPlan;
var tblFitnessPlan;
var tblFitnessPlan2;
var oldWorkOutName;
var fitnessID;

$('.tokenize').tokenize2();
loadFitnessPlan();

$("#cmbTargetBodyParts").on("tokenize:select", function () {
    $("#cmbTargetBodyParts").trigger('tokenize:search', "");
});

function loadFitnessPlan() {
    tblFitnessPlan = 
    $('#tblFitnessPlan').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-fitness-plan",
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
        	'url'       : '../program_assets/php/web/workout.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_workout',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'workOutName'},
            { mData: 'targetLooseWeight'},
            { mData: 'intensity'},
            { mData: 'bodyParts',
                render: function (data,type,row) {
                    var bodyPartsTag = "";
                    var splitBodyParts = row.bodyParts.split(',');
                    
                    for (var i = 0; i < splitBodyParts.length; i++) {
                        bodyPartsTag += '<small class="label bg-gray cust-label">' + splitBodyParts[i] + '</small>&nbsp;';
                    }
                    
                    return bodyPartsTag;
                }    
            },
            { mData: 'workOutDescription',
                render: function (data,type,row) {
                    return row.workOutDescription.length >= 75 ? row.workOutDescription.substring(0, 75) + '...' : row.workOutDescription;
                }    
            },
            { mData: 'workOutProcedure',
                render: function (data,type,row) {
                    return row.workOutProcedure.length >= 75 ? row.workOutProcedure.substring(0, 75) + '...' : row.workOutProcedure;
                }    
            },
            { mData: 'status'},
            { mData: 'dateCreatedF'},
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
        	{"className": "custom-center", "targets": [8]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5,6,7]},
        	{ "width": "1%", "targets": [8] },
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
    
    tblFitnessPlan2 = 
    $('#tblFitnessPlan2').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-fitness-plan2",
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
        	'url'       : '../program_assets/php/web/workout.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_workout',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'workOutName'},
            { mData: 'targetLooseWeight'},
            { mData: 'intensity'},
            { mData: 'bodyParts'},
            { mData: 'workOutDescription'},
            { mData: 'workOutProcedure'},
            { mData: 'status'},
            { mData: 'dateCreatedF'},
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
        	{"className": "custom-center", "targets": [8]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5,6,7]},
        	{ "width": "1%", "targets": [8] },
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

$("#btnExportFitness").click(function(){
	$(".btn-export-fitness-plan2").click();
});

$('#txtSearchFitNess').keyup(function(){
    tblFitnessPlan.search($(this).val()).draw();
    tblFitnessPlan2.search($(this).val()).draw();
});

$("#btnNewFitnessPlan").click(function(){
	$("#txtWorkOutName").val("");
    $("#txtTargetLooseWeight").val("");
    $("#cmbIntensity").val(null).trigger("change");
    $("#txtWorkOutDescription").val("");
    $("#txtWorkOutProcedure").val("");
    $("#chkWorkOutActive").prop("checked", true);
    $("#chkWorkOutActive").prop("disabled", false);
    $('#cmbTargetBodyParts').tokenize2().trigger('tokenize:clear');
    $("#mdFitnessPlan").modal();
    isNewFitnessPlan = 1;
    $("#dvReminder").hide();
    oldWorkOutName = "";
    fitnessID = 0;
});

$('#tblFitnessPlan tbody').on('click', 'td button', function (){
	var data = tblFitnessPlan.row( $(this).parents('tr') ).data();
    

    
    $("#txtWorkOutName").val(data.workOutName);
    $("#txtTargetLooseWeight").val(data.targetLooseWeight);
    $("#cmbIntensity").val(data.intensity).trigger("change");
    $("#txtWorkOutDescription").val(data.workOutDescriptionF);
    $("#txtWorkOutProcedure").val(data.workOutProcedureF);
    $("#chkWorkOutActive").prop("checked", data.isActive == 1 ? true : false);
    $("#chkWorkOutActive").prop("disabled", false);
    $('#cmbTargetBodyParts').tokenize2().trigger('tokenize:clear');
    $("#mdFitnessPlan").modal();
    isNewFitnessPlan = 0;
    oldWorkOutName = data.workOutName;
    fitnessID = data.id;
    $("#dvReminder").show();
    
    var arrTargetBodyParts = data.bodyPartSelect.split(",");
    
    for (var i = 0; i < arrTargetBodyParts.length; i++) {
        var [id,bodyPart] = arrTargetBodyParts[i].split('~');
        
        $('#cmbTargetBodyParts').tokenize2().trigger('tokenize:tokens:add', [id,bodyPart, true]);
    }
});

$("#btnSaveFitness").click(function(){
    var workOutName        = $("#txtWorkOutName").val().replace("'","");
    var targetLooseWeight  = $("#txtTargetLooseWeight").val();
    var intensity          = $("#cmbIntensity").val();
    var workOutDescription = $("#txtWorkOutDescription").val();
    var workOutProcedure   = $("#txtWorkOutProcedure").val();
    var isActive           = $("#chkWorkOutActive").prop('checked') ? 1 : 0;
    var arrTargetBodyParts = $("#cmbTargetBodyParts").val();
    
    
    if (workOutName == "" || targetLooseWeight == "" || targetLooseWeight == 0 || intensity == ""
        || workOutDescription == "" || workOutProcedure == "" || arrTargetBodyParts.length == 0) {
        JAlert("Please fill in required fields","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/workout.php",
            data: {
                command            : 'save_workout',
                workOutName        : workOutName,
                targetLooseWeight  : targetLooseWeight,
                intensity          : intensity, 
                workOutDescription : workOutDescription,
                workOutProcedure   : workOutProcedure,
                isActive           : isActive,
                arrTargetBodyParts : arrTargetBodyParts.join(","),
                isNewFitnessPlan   : isNewFitnessPlan,
                oldWorkOutName     : oldWorkOutName,
                fitnessID          : fitnessID
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                
                if (!data[0].error) {
                    $("#mdFitnessPlan").modal("hide");
                    loadFitnessPlan();
                }
            }
        });
    }
});

/* Video */
isThereAVideo = 0;
isThereALink  = 0;

loadVideos("");

$('#txtSearchVideo').on('input',function(e){
	loadVideos($('#txtSearchVideo').val());
});

$("#btnUploadVideo").click(function(){
   $.ajax({
		url: "../program_assets/php/web/workout.php",
		data: {
			command   : 'display_select_fitness'
		},
		type: 'post',
	}).done(function (data) {
		var data = jQuery.parseJSON(data);
		
		document.getElementById("cmbFitnessName").options.length = 0;
		
		$('#cmbFitnessName').append($('<option>', {
			value: null,
			text: "Please select an event",
			selected : true,
			disabled : true
		}));
		
		for (var i = 0; i < data.length; i++) {
			$('#cmbFitnessName').append($('<option>', {
				value: data[i].id,
				text: data[i].workOutName,
                'data-bodyparts' : data[i].bodyParts,
                'data-intensity' : data[i].intensity
			}));
		}
      
        $("#dvProgress").css("width","0%");
        $('#txtVideoName').val("");
        $('#txtVideo').val("");
        $('#txtTrainersName').val("");
        $('#txtIntensity').val("");
        $('#txtTargetBodyParts').val("");
        $('#txtYouTubeLink').val("");
        
        isThereAVideo = 0;
        isThereALink  = 0;
  
        $("#mdAddVideo").modal();
	});
});

function uploadFile() {
   isThereAVideo = 1;
   isThereALink  = 0;
   
   $('#txtYouTubeLink').val("");
}

$('#txtYouTubeLink').on('input',function(e){
    isThereAVideo = 0;
    isThereALink  = 1;
   
    $('#txtVideo').val("");
    
    if ($("#txtYouTubeLink").val() == "") {
        isThereAVideo = 0;
        isThereALink  = 0;
    }
});

$("#txtVideo").on("change", function () {
    const maxAllowedSize = 35 * 1024 * 1024;
   
    if(this.files[0].size > maxAllowedSize) {
        JAlert("Please upload file below 35mb","red");
        $(this).val('');
        isThereAVideo = 0;
    }
});

$("#btnSaveVideo").click(function() {
    var videoID      = getDateTime();
    var fitnessID    = $('#cmbFitnessName').val();
    var title        = $('#txtVideoName').val().replace("'","");
    var trainersName = $('#txtTrainersName').val();
    var youtubeLink  = $('#txtYouTubeLink').val();
    
    if (fitnessID == "" || title == "" || trainersName == "") {
        JAlert("Please fill in required fields","red");
        return;
    }
    
    if (isThereAVideo == 0 && isThereALink == 0) {
        JAlert("Please choose between uploading a video or paste a youtube link","red");
        return;
    }
    
    if (isThereALink != 0) {
        if (validateYouTubeUrl()) {
            JAlert("Please provide proper youtube link","red");
            return;
        }
    }
    
    if (isThereAVideo == 1) {
        var file_data = $('#txtVideo').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('videoID', videoID);
        $.ajax({
           url: '../program_assets/php/upload/upload_video.php',
           dataType: 'text',
           cache: false,
           contentType: false,
           processData: false,
           data: form_data,
           beforeSend: function(){
              //$("#file-progress-bar").width('0%');
              console.log(0);
              $("#dvProgress").css("width","0%");
              disableElement(true);
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
           type: 'post',
           success: function(data) {
              var data = jQuery.parseJSON(data);
              
              //JAlert(data[0].message,data[0].color);
              
              if (data[0].error) {
                $("#dvProgress").css("width","0%");
                disableElement(false);
              } else {
                saveVideoLinks(videoID);
              }
           },
           error: function(xhr, textStatus, error){
              $("#dvProgress").css("width","0%");
              disableElement(true);
              JAlert("Unable to upload. The file is too big","red");
           }
        });
    } else {
        saveVideoLinks(videoID);
    }
});

function saveVideoLinks(videoID) {
    var fitnessID    = $('#cmbFitnessName').val();
    var title        = $('#txtVideoName').val();
    var trainersName = $('#txtTrainersName').val();
    var youtubeLink  = $('#txtYouTubeLink').val();
    
    $.ajax({
        url: "../program_assets/php/web/workout.php",
        data: {
            command      : 'save_video',
            fitnessID    : fitnessID,
            fileName     : videoID,
            title        : title.replace("'",""),
            trainersName : trainersName,
            youtubeLink  : youtubeLink.replace("https://youtu.be/","")
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                if ($("#txtSearchVideo").val() == "") {
                   loadVideos("");
                }
                
                disableElement(false);
                $("#mdAddVideo").modal("hide");
            }
        }
    });
}

function loadVideos(search) {
    $.ajax({
      url: "../program_assets/php/web/workout.php",
      data: {
         command  : 'display_fitness_video',
         search   : search
      },
      type: 'post',
      success: function (data) {
         var data = jQuery.parseJSON(data);
         var dataVideos = "";
         
         $("#divVidHolder").html("");
         
         for (var i = 0; i < data.length; i++) {
            dataVideos += `
               <div id="dvVideo` + data[i].id + `" class="col-md-3 col-xs-12">
                  <div class="panel panel-default">
                     <div class="panel-body">
                        <div>
                            <div id="td` + data[i].id + `">
                            </div>
                            <br>
                            <div id="dvV` + data[i].id + `" style="margin-bottom: 8px;">
                                <a id="dv-n-thumb-`+ data[i].id +`" href="../videos/` + data[i].fileName + `.mp4" target="_blank">
                                    <img id="img-n-thumb-`+ data[i].id +`" src="../thumbnails/empty.png" class="image-no-thumb">
                                </a>
                                <a id="dv-w-thumb-`+ data[i].id +`" href="../videos/` + data[i].fileName + `.mp4" target="_blank">
                                    <img id="img-w-thumb-`+ data[i].id +`" src="../thumbnails/` + data[i].fileName + `.png?random=` + Math.random() + `" class="image-w-thumb">
                                </a>
                            </div>
                            <div id="dvYT` + data[i].id + `">
                                <iframe style="width:100%; height:183px; border-radius: 8px;"
                                    src="https://www.youtube.com/embed/`+ data[i].youtubeLink +`" allowfullscreen>
                                </iframe>
                            </div>
                           <br>
                           <div class="row">
                              <div class="col-md-2 col-xs-3" hidden>
                                 <img src="./../profile/` + data[i].userID + `.png" class="img-circle" alt="User Image" onerror="this.onerror=null; this.src='./../profile/Default.png'" style="width: 55px; height: 53px; object-fit: cover;">
                              </div>
                              <div class="col-md-10 col-xs-9">
                                 <label class="cust-label">Title : </label>
                                 <span class="cust-label">`+ data[i].title +`</span>
                                 <div hidden>
                                    <br>
                                    <label class="cust-label">Uploaded By : </label>
                                    <span class="cust-label">`+ data[i].uploadedBy +`</span>
                                    <br>
                                 </div>
                                 <label class="cust-label">Fitness Plan : </label>
                                 <span class="cust-label">`+ data[i].workOutName +`</span>
                                 <br>
                                 <label class="cust-label">Date Uploaded : </label>
                                 <span class="cust-label">`+ data[i].dateCreated +`</span>
                                 <br>
                                 <label class="cust-label">Trainer : </label>
                                 <span class="cust-label">`+ data[i].trainersName +`</span>
                                 <br>
                              </div>
                              <input type="file" id="image_uploader_`+ data[i].id +`" name="image_uploader_`+ data[i].id +`" accept="image/png, image/jpeg" onchange="uploadThumb(`+ data[i].id +`,'`+ data[i].fileName +`')" style="display:none;">
                           </div>
                           <br>
                           <div class="row">
                              <div class="col-md-6 col-xs-6">
                                 <button id="btnThumbnail-`+ data[i].id +`" type="button" class="btn btn-block btn-default btn-sm cust-textbox" onclick="openImage(`+ data[i].id +`)">
                                    <i class="fa fa-picture-o"></i>
                                    &nbsp;
                                    Thumbnail
                                 </button>
                              </div>
                              <div class="col-md-6 col-xs-6">
                                 <button id="btnDelete" type="button" class="btn btn-block btn-default btn-sm cust-textbox" onclick="deleteVideo(`+ data[i].id +`)">
                                    <i class="fa fa-trash"></i>
                                    &nbsp;
                                    Remove Video
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            `;
         }
         
         $("#divVidHolder").html(dataVideos);
         
         for (var i = 0; i < data.length; i++) {
            if (data[i].hasThumbnail == 1) {
               $("#dv-w-thumb-" + data[i].id).show();
               $("#dv-n-thumb-" + data[i].id).hide();
            } else {
               $("#dv-w-thumb-" + data[i].id).hide();
               $("#dv-n-thumb-" + data[i].id).show();
            }
            
            if (data[i].youtubeLink == "") {
                $("#dvV" + data[i].id).show();
                $("#dvYT" + data[i].id).hide();
                $("#btnThumbnail-" + data[i].id).prop("disabled", false); 
            } else {
                $("#dvV" + data[i].id).hide();
                $("#dvYT" + data[i].id).show();
                $("#btnThumbnail-" + data[i].id).prop("disabled", true);
            }
            
            var arrBodyParts = data[i].bodyParts.split('~');
            var tags = "";
            
            for (var a = 0; a < arrBodyParts.length; a++) {
                tags += `<small class="label bg-gray cust-label">` + arrBodyParts[a] + `</small>&nbsp;`;
            }
            
            $("#td" + data[i].id).html(tags);
            
            
            //console.log(tags);
         }
      }
   });
}

function uploadThumb(id,filename) {
    var file_data = $('#image_uploader_' + id).prop('files')[0];
	var form_data = new FormData();
    form_data.append('file', file_data);    
    form_data.append('id', id);
    form_data.append('filename', filename);
	$.ajax({
        url: '../program_assets/php/upload/upload_thumb.php',
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
               $("#image_uploader_" + id).val(null);
               $('#img-w-thumb-' + id).attr("src", "../thumbnails/" + filename + ".png?random=" + Math.random());
               $('#dv-w-thumb-' + id).show();
               $('#dv-n-thumb-' + id).hide();
            }
        }
	});
}

function openImage(id) {
    javascript:document.getElementById('image_uploader_' + id).click();
}

function deleteVideo(id) {
    $.ajax({
       url: "../program_assets/php/web/workout.php",
       data: {
           command   : 'delete_video',
           id : id
       },
       type: 'post',
       success: function (data) {
          var data = jQuery.parseJSON(data);
          
          JAlert(data[0].message,data[0].color);
              
          if (!data[0].error) {
             $("#dvVideo" + id).remove();
          }
       }
    });
}

function validateYouTubeUrl() {    
    var url   = $('#txtYouTubeLink').val();
    var error = true; 
    
    if (url != undefined || url != '') {        
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            error = false;
        }
    }
    
    return error;
}

function disableElement(isDisable) {
   $("#btnCloseVideoModal").prop("disabled", isDisable);
   $("#btnSaveVideo").prop("disabled", isDisable);
   $("#cmbFitnessName").prop("disabled", isDisable);
   $("#txtVideoName").prop("disabled", isDisable);
   $("#txtVideo").prop("disabled", isDisable);
   $("#txtYouTubeLink").prop("disabled", isDisable);
   $("#txtTrainersName").prop("disabled", isDisable);
}

$("#cmbFitnessName").on("change", function() {
    var id = $(this).val();
    var text  = $("#cmbFitnessName").find("option:selected").text();

    
    $('#txtIntensity').val($(this).children('option:selected').data('intensity'));
    $('#txtTargetBodyParts').val($(this).children('option:selected').data('bodyparts'));
});

function numOnly(selector){
    selector.value = selector.value.replace(/[^0-9]/g,'');
}

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   
    var dateTime = year+''+month+''+day+''+hour+''+minute+''+second;   
    return dateTime;
}
var tblGBPTable;
var totalPrimarySource = 0;
var totalOtherSource = 0;
var commentMotherID = "";
var selectParentFolderID = "";
var creatorEmail = "";
var arrCommentIDS = [];

loadGBPTable();

$("#btnGenerateReport").click(function(){
	loadGBPTable();
});

$("#btnExport").click(function(){
	$(".btn-export-gbp").click();
});

$("#aGeneralComments").click(function(){
	openCommentModal(`${selectParentFolderID}-generalcomment`);
});

$('#tblGBPTable tbody').on('click', '.gbp-table-view', function (){
	var data = tblGBPTable.row( $(this).parents('tr') ).data();
	
	$("#spOrg").text(data.college);
	$("#spOrgHi").text(data.college);
	$("#lblGAABudget").text(0);
	$("#lblFY").text(data.year);
	$("#lblApprovedByName").text(data.approvedBy);
	$("#lblApprovedByPosition").text(data.approvedByPosition);
	$("#lblPreparedByName").text(data.preparedBy);
	$("#lblPreparedByPosition").text(data.preparedByPosition);
	$("#lblDocReq").text(data.status);
	$("#cmbFinalStatus").val(data.status).trigger("change");
	creatorEmail = data.email;
	
	if (data.reportType == "Accomplishment Report") {
		$("#lblModalTitle").text("View Accomplishment Report");
		$("#lblModalHeader").text("ANNUAL GENDER AND DEVELOPMENT (GAD) ACCOMPLISHMENT REPORT");	
    } else {
		$("#lblModalTitle").text("View GBP");
		$("#lblModalHeader").text("ANNUAL GENDER AND DEVELOPMENT (GAD) PLAN AND BUDGET");	
	}
	
	
	$("#mdViewGBP").modal();
	
	showGBPView(data.parentFolderID);
});

$("#btnFinalize").click(function(){
	var currentStatus = $("#cmbFinalStatus").val();
	
	$.ajax({
		url: "../program_assets/php/web/gbp_report",
		data: {
			command   : 'change_status',
			status    : currentStatus,
			parentFolderID : selectParentFolderID
		},
		type: 'post',
		success: function (data) {
			var data = jQuery.parseJSON(data);
			
			JAlert(data[0].message,data[0].color);
			
			if (!data[0].error) {
                loadGBPTable();
				$("#mdViewGBP").modal("hide");
				
				$.ajax({
					url: "https://apps.project4teen.online/email-service/send.php",
					data: {
						rEmail    : creatorEmail,
						sEmail    : 'teamohmygad.system@gmail.com',
						sName     : 'GDMS',
						sPassword : 'bzecubyldgoctvtn',
						sSubject  : 'GDMS Preparation Status',
						sBody     : `The GBP you created has been changed to ${currentStatus}. Please check the details on the website.`
					},
					type: 'post',
					success: function (data) {
						var data = jQuery.parseJSON(data);
						
						if (data[0].error) {
							JAlert(data[0].message,data[0].color);
						} 
					}
				});
            }
		}
	});
});

function showGBPView(parentFolderID) {
	var countRows = 0;
	var countRows2 = 1;
	selectParentFolderID = parentFolderID;
    
	const tableBody_client = document.querySelector('#tblViewClientFocus tbody');
	tableBody_client.innerHTML = '';
	
	const tableBody_org = document.querySelector('#tblViewOrgFocus tbody');
	tableBody_org.innerHTML = '';
	
	$('.comment-count-general').attr('id', parentFolderID + "-generalcomment");
	arrCommentIDS = [];
	
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'load_activity_view',
            parentFolderID : parentFolderID,
            tab : 1
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            var newContent = "";
			
			console.log(data);
            
            $("#tblViewClientFocus tbody").append(newContent);
			
			if (data.length != 0) {
				var table = document.getElementById('tblViewClientFocus'); 
				var thead = table.tHead; 
				if (thead.rows.length >= 3) {
					thead.deleteRow(2); 
				}
				
				 $("#tblViewClientFocus thead").append(`
					<tr>
						<th colspan="15" style="background-color:#FFFDCC">
							<center>
								CLIENT FOCUSED
							</center>
						</th>
					</tr>									
				`);
            }
			
            
            for (var i = 0; i < data.length; i++) {
                var relevantOrg = "";
                var arrRelevantMFO = data[i].arrMFO.split("~~");
                
                for (var a = 0; a < arrRelevantMFO.length; a++) {
                    var [mfo,details] = arrRelevantMFO[a].split('~');
                    
                    relevantOrg += `<b>${mfo}</b> : ${details}<br><br>`;
                }
                
                var causeGender = "";
                var arrGenderIssue = data[i].arrGenderIssue.split("~~");
                
                for (var b = 0; b < arrGenderIssue.length; b++) {
                    causeGender += `${arrGenderIssue[b]}`;
                }
                
                var gadResult = "";
                var arrGadResult = data[i].arrGADResult.split("~~");
                
                for (var c = 0; c < arrGadResult.length; c++) {
                    gadResult += `${arrGadResult[c]}<br><br>`;
                }
                
                var performanceIndicator = "";
                var arrPerformanceIndicator = data[i].arrPerformanceIndicator.split('~~');
                
                for (var d = 0; d < arrPerformanceIndicator.length; d++) {
                    var [perf,target] = arrPerformanceIndicator[d].split('~');
                    
                    performanceIndicator += `${perf} - ${target}<br><br>`;
                }
                
                var office = "";
                var arrOffice = data[i].arrOffices.split('~~');
                
                for (var e = 0; e < arrOffice.length; e++) {
                    office += `${arrOffice[e]}<br><br>`;
                }
                
                var files = "";
                var arrFiles = data[i].arrFiles.split('~~');
                
                for (var f = 0; f < arrFiles.length; f++) {
                    files += `
                        <a
                            onclick="downLoadFile('${data[i].folderID}','${arrFiles[f]}')"
                            href="#">
                            ${arrFiles[f]}
                        </a>
                        <br>
                    `;
                }
                
                var budgetText = "";
                var arrBudget = data[i].arrBudget.split('~~');
                
                for (var g = 0; g < arrBudget.length; g++) {
                    var [budgetSource,budgetItem,budget] = arrBudget[g].split('~');
                    
                    if (budgetSource == "GAA") {
                        totalPrimarySource += Number(budget.replaceAll(",",""));
                    } else {
                        totalOtherSource += Number(budget.replaceAll(",",""));
                    }
                    
                    budgetText += `
                        <tr style="background-color:#D0E1DD">
                            <td style="width:50%;" align="right">${budget}</td>
                            <td style="width:50%;">
                                <center>
                                    ${budgetSource}
                                </center>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%;" align="right">${budgetItem}</td>
                            <td style="width:50%;">
                                <center>
                                    ${budgetSource}
                                </center>
                            </td>
                        </tr>
                    `;
                    
                    
                }
                
				var actualCostText = "";
                var arrActualCost = data[i].actualCost.split('~~');
				
				if (data[i].actualCost != "") {
					for (var h = 0; h < arrActualCost.length; h++) {
						var [source,item,expense] = arrActualCost[h].split('~');
                      
						actualCostText += `
						  <span style="white-space:normal"><b>Source : </b>${source}</span>
						  <br>
						  <span style="white-space:normal"><b>Item : </b>${item}</span>
						  <br>
						  <span style="white-space:normal"><b>Expense : </b>${expense}</span>
						  <br>
						  <br>
						`;
						
					}
                }
    
	
				var strVariance = "";
                  
				if (data[i].varianceRemarks != "") {
				  var arrVariance = data[i].varianceRemarks.split('~~');
				
				  for(var j = 0; j < arrVariance.length; j++) {
					var [variance,remarks] = arrVariance[j].split('~');
					
					strVariance += `
					  <span style="white-space:normal"><b>Variance : </b>${variance}</span>
					  <br>
					  <span style="white-space:normal"><b>Remarks : </b>${remarks}</span>
					  <br>
					  <br>
					`;
				  }
				}
                
                newContent += `
                    <tr>
                        <td>${ i + 1 }</td>
                        <td>
                            <b>Gender Issue : </b> ${data[i].gender}
                            <br>
                            <br>
                            <b>GAD Mandate : </b> ${data[i].gad}
                            <br>
                            <br>
							<small id="${parentFolderID}-col1-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col1-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${causeGender}
                            <br>
                            <br>
							<small id="${parentFolderID}-col2-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col2-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${gadResult}
                            <br>
                            <br>
							<small id="${parentFolderID}-col3-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col3-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${relevantOrg}
                            <br>
                            <br>
							<small id="${parentFolderID}-col4-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col4-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${ data[i].gadActivity }
                            <br>
                            <br>
							<small id="${parentFolderID}-col5-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col5-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${performanceIndicator}
                            <br>
                            <br>
							<small id="${parentFolderID}-col6-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col6-row${countRows}')">Comments</a>
                        </td>
                        <td colspan="2">
                            <table id="tbNotThis" style="width:100%;">
                                <tbody>
                                    ${budgetText}
                                </tbody>
                            </table>
                            <br>
                            <br>
							<small id="${parentFolderID}-col7-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col7-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${office}
                            <br>
                            <br>
							<small id="${parentFolderID}-col8-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col8-row${countRows}')">Comments</a>
                        </td>
						<td>
							${data[i].actualResult}
							<br>
                            <br>
							<small id="${parentFolderID}-col9-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col9-row${countRows}')">Comments</a>
						</td>
						<td>
							${actualCostText}
							<br>
                            <br>
							<small id="${parentFolderID}-col10-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col10-row${countRows}')">Comments</a>
						</td>
						<td>
							${strVariance}
							<br>
                            <br>
							<small id="${parentFolderID}-col11-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col11-row${countRows}')">Comments</a>
						</td>
                        <td>
                            ${files}
                            <br>
                            <br>
							<small id="${parentFolderID}-col12-row${countRows}" class="label pull-right bg-red comment-count">0</small>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col12-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            <div class="btn-group" style="width: 100px;">
                                <button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-lock"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
				
				arrCommentIDS.push("'" + `${parentFolderID}-col1-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col2-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col3-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col4-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col5-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col6-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col7-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col8-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col9-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col10-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col11-row${countRows}` + "'");
				arrCommentIDS.push("'" + `${parentFolderID}-col12-row${countRows}` + "'");
            }
            
            $("#tblViewClientFocus tbody").append(newContent);
			$(".comment-count").hide();
			countRows++;
        }
    });
    
	setTimeout(function() {
		$.ajax({
			url: "../program_assets/php/web/gbp",
			data: {
				command   : 'load_activity_view',
				parentFolderID : parentFolderID,
				tab : 2
			},
			type: 'post',
			success: function (data) {
				var data = jQuery.parseJSON(data);
				var newContent = "";
				
				//$("#tblViewClientFocus tbody:first").append(newContent);
				
				if (data.length != 0) {
					 $("#tblViewClientFocus tbody:first").append(`
						<tr>
							<th colspan="15" style="background-color:#FFFDCC">
								<center>
									ORGANIZATIONAL FOCUSED
								</center>
							</th>
						</tr>									
					`);
				}
				
				for (var i = 0; i < data.length; i++) {
					var relevantOrg = "";
					var arrRelevantMFO = data[i].arrMFO.split("~~");
					
					for (var a = 0; a < arrRelevantMFO.length; a++) {
						var [mfo,details] = arrRelevantMFO[a].split('~');
						
						relevantOrg += `<b>${mfo}</b> : ${details}<br><br>`;
					}
					
					var causeGender = "";
					var arrGenderIssue = data[i].arrGenderIssue.split("~~");
					
					for (var b = 0; b < arrGenderIssue.length; b++) {
						causeGender += `${arrGenderIssue[b]}`;
					}
					
					var gadResult = "";
					var arrGadResult = data[i].arrGADResult.split("~~");
					
					for (var c = 0; c < arrGadResult.length; c++) {
						gadResult += `${arrGadResult[c]}<br><br>`;
					}
					
					var performanceIndicator = "";
					var arrPerformanceIndicator = data[i].arrPerformanceIndicator.split('~~');
					
					for (var d = 0; d < arrPerformanceIndicator.length; d++) {
						var [perf,target] = arrPerformanceIndicator[d].split('~');
						
						performanceIndicator += `${perf} - ${target}<br><br>`;
					}
					
					var office = "";
					var arrOffice = data[i].arrOffices.split('~~');
					
					for (var e = 0; e < arrOffice.length; e++) {
						office += `${arrOffice[e]}<br><br>`;
					}
					
					var files = "";
					var arrFiles = data[i].arrFiles.split('~~');
					
					for (var f = 0; f < arrFiles.length; f++) {
						files += `
							<a
								onclick="downLoadFile('${data[i].folderID}','${arrFiles[f]}')"
								href="#">
								${arrFiles[f]}
							</a>
							<br>
						`;
					}
					
					var budgetText = "";
					var arrBudget = data[i].arrBudget.split('~~');
					
					for (var g = 0; g < arrBudget.length; g++) {
						var [budgetSource,budgetItem,budget] = arrBudget[g].split('~');
						
						if (budgetSource == "GAA") {
							totalPrimarySource += Number(budget.replaceAll(",",""));
						} else {
							totalOtherSource += Number(budget.replaceAll(",",""));
						}
						
						budgetText += `
							<tr style="background-color:#D0E1DD">
								<td style="width:50%;" align="right">${budget}</td>
								<td style="width:50%;">
									<center>
										${budgetSource}
									</center>
								</td>
							</tr>
							<tr>
								<td style="width:50%;" align="right">${budgetItem}</td>
								<td style="width:50%;">
									<center>
										${budgetSource}
									</center>
								</td>
							</tr>
						`;
						
						
					}
					
		
					
					var actualCostText = "";
					var arrActualCost = data[i].actualCost.split('~~');
					
					if (data[i].actualCost != "") {
						for (var h = 0; h < arrActualCost.length; h++) {
							var [source,item,expense] = arrActualCost[h].split('~');
						  
							actualCostText += `
							  <span style="white-space:normal"><b>Source : </b>${source}</span>
							  <br>
							  <span style="white-space:normal"><b>Item : </b>${item}</span>
							  <br>
							  <span style="white-space:normal"><b>Expense : </b>${expense}</span>
							  <br>
							  <br>
							`;
							
						}
					}
		
		
					var strVariance = "";
					  
					if (data[i].varianceRemarks != "") {
					  var arrVariance = data[i].varianceRemarks.split('~~');
					
					  for(var j = 0; j < arrVariance.length; j++) {
						var [variance,remarks] = arrVariance[j].split('~');
						
						strVariance += `
						  <span style="white-space:normal"><b>Variance : </b>${variance}</span>
						  <br>
						  <span style="white-space:normal"><b>Remarks : </b>${remarks}</span>
						  <br>
						  <br>
						`;
					  }
					}
					
					newContent += `
						<tr>
							<td>${ i + 1 }</td>
							<td>
								<b>Gender Issue : </b> ${data[i].gender}
								<br>
								<br>
								<b>GAD Mandate : </b> ${data[i].gad}
								<br>
								<br>
								<small id="${parentFolderID}-col1-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col1-row${countRows2}')">Comments</a>
							</td>
							<td>
								${causeGender}
								<br>
								<br>
								<small id="${parentFolderID}-col2-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col2-row${countRows2}')">Comments</a>
							</td>
							<td>
								${gadResult}
								<br>
								<br>
								<small id="${parentFolderID}-col3-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col3-row${countRows2}')">Comments</a>
							</td>
							<td>
								${relevantOrg}
								<br>
								<br>
								<small id="${parentFolderID}-col4-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col4-row${countRows2}')">Comments</a>
							</td>
							<td>
								${ data[i].gadActivity }
								<br>
								<br>
								<small id="${parentFolderID}-col5-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col5-row${countRows2}')">Comments</a>
							</td>
							<td>
								${performanceIndicator}
								<br>
								<br>
								<small id="${parentFolderID}-col6-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col6-row${countRows2}')">Comments</a>
							</td>
							<td colspan="2">
								<table id="tbNotThis" style="width:100%;">
									<tbody>
										${budgetText}
									</tbody>
								</table>
								<br>
								<br>
								<small id="${parentFolderID}-col7-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col7-row${countRows2}')">Comments</a>
							</td>
							<td>
								${office}
								<br>
								<br>
								<small id="${parentFolderID}-col8-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col8-row${countRows2}')">Comments</a>
							</td>
							<td>
								${data[i].actualResult}
								<br>
								<br>
								<small id="${parentFolderID}-col9-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col9-row${countRows2}')">Comments</a>
							</td>
							<td>
								${actualCostText}
								<br>
								<br>
								<small id="${parentFolderID}-col10-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col10-row${countRows2}')">Comments</a>
							</td>
							<td>
								${strVariance}
								<br>
								<br>
								<small id="${parentFolderID}-col11-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col11-row${countRows2}')">Comments</a>
							</td>
							<td>
								${files}
								<br>
								<br>
								<small id="${parentFolderID}-col12-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col12-row${countRows2}')">Comments</a>
							</td>
							<td>
								<div class="btn-group" style="width: 100px;">
									<button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-lock"></i></button>
								</div>
							</td>
						</tr>
					`;
					
					
					arrCommentIDS.push("'" + `${parentFolderID}-col1-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col2-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col3-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col4-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col5-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col6-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col7-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col8-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col9-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col10-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col11-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col12-row${countRows2}` + "'");
				}
				
				$("#tblViewClientFocus tbody:first").append(newContent);
				$(".comment-count").hide();
				countRows2++;
			}
		});
	}, 1000);
	
    
	
	
	setTimeout(function() {
		$.ajax({
			url: "../program_assets/php/web/gbp",
			data: {
				command   : 'load_attr_view',
				parentFolderID : parentFolderID,
				tab : 0
			},
			type: 'post',
			success: function (data) {
				var data = jQuery.parseJSON(data);
				var newContent = "";
				
				//$("#tblViewClientFocus tbody:first").append(newContent);
				
				if (data.length != 0) {
					 $("#tblViewClientFocus tbody:first").append(`
						<tr>
							<th colspan="15" style="background-color:#FFFDCC">
								<center>
									ATTRIBUTED PROGRAM
								</center>
							</th>
						</tr>									
					`);
				}
				
				for (var i = 0; i < data.length; i++) {
					var relevantOrg = "";
					var arrRelevantMFO = data[i].arrMFO.split("~~");
					
					for (var a = 0; a < arrRelevantMFO.length; a++) {
						var [mfo,details] = arrRelevantMFO[a].split('~');
						
						relevantOrg += `<b>${mfo}</b> : ${details}<br><br>`;
					}
					
					var causeGender = "";
					var arrGenderIssue = data[i].arrGenderIssue.split("~~");
					
					for (var b = 0; b < arrGenderIssue.length; b++) {
						causeGender += `${arrGenderIssue[b]}`;
					}
					
					var gadResult = "";
					var arrGadResult = data[i].arrGADResult.split("~~");
					
					for (var c = 0; c < arrGadResult.length; c++) {
						gadResult += `${arrGadResult[c]}<br><br>`;
					}
					
					var performanceIndicator = "";
					var arrPerformanceIndicator = data[i].arrPerformanceIndicator.split('~~');
					
					for (var d = 0; d < arrPerformanceIndicator.length; d++) {
						var [perf,target] = arrPerformanceIndicator[d].split('~');
						
						performanceIndicator += `${perf} - ${target}<br><br>`;
					}
					
					var office = "";
					var arrOffice = data[i].arrOffices.split('~~');
					
					for (var e = 0; e < arrOffice.length; e++) {
						office += `${arrOffice[e]}<br><br>`;
					}
					
					var files = "";
					var arrFiles = data[i].arrFiles.split('~~');
					
					for (var f = 0; f < arrFiles.length; f++) {
						files += `
							<a
								onclick="downLoadFile('${data[i].folderID}','${arrFiles[f]}')"
								href="#">
								${arrFiles[f]}
							</a>
							<br>
						`;
					}
					
					var budgetText = "";
					var arrBudget = data[i].arrBudget.split('~~');
					
					for (var g = 0; g < arrBudget.length; g++) {
						var [budgetSource,budgetItem,budget] = arrBudget[g].split('~');
						
						if (budgetSource == "GAA") {
							totalPrimarySource += Number(budget.replaceAll(",",""));
						} else {
							totalOtherSource += Number(budget.replaceAll(",",""));
						}
						
						budgetText += `
							<tr style="background-color:#D0E1DD">
								<td style="width:50%;" align="right">${budget}</td>
								<td style="width:50%;">
									<center>
										${budgetSource}
									</center>
								</td>
							</tr>
							<tr>
								<td style="width:50%;" align="right">${budgetItem}</td>
								<td style="width:50%;">
									<center>
										${budgetSource}
									</center>
								</td>
							</tr>
						`;
						
						
					}
					
					
					var actualCostText = "";
					var arrActualCost = data[i].actualCost.split('~~');
					
					if (data[i].actualCost != "") {
						for (var h = 0; h < arrActualCost.length; h++) {
							var [source,item,expense] = arrActualCost[h].split('~');
						  
							actualCostText += `
							  <span style="white-space:normal"><b>Source : </b>${source}</span>
							  <br>
							  <span style="white-space:normal"><b>Item : </b>${item}</span>
							  <br>
							  <span style="white-space:normal"><b>Expense : </b>${expense}</span>
							  <br>
							  <br>
							`;
							
						}
					}
		
		
					var strVariance = "";
					  
					if (data[i].varianceRemarks != "") {
					  var arrVariance = data[i].varianceRemarks.split('~~');
					
					  for(var j = 0; j < arrVariance.length; j++) {
						var [variance,remarks] = arrVariance[j].split('~');
						
						strVariance += `
						  <span style="white-space:normal"><b>Variance : </b>${variance}</span>
						  <br>
						  <span style="white-space:normal"><b>Remarks : </b>${remarks}</span>
						  <br>
						  <br>
						`;
					  }
					}
		
					
					newContent += `
						<tr>
							<td>${ countRows2 + 1 }</td>
							<td>
								
							</td>
							<td>
								
							</td>
							<td>
								
							</td>
							<td>
							   
							</td>
							<td>
								${ data[i].gadActivity }
								<br>
								<br>
								<small id="${parentFolderID}-col5-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col5-row${countRows2}')">Comments</a>
							</td>
							<td>
							   
							</td>
							<td colspan="2">
								<table style="width:100%;">
									<tbody>
										${budgetText}
									</tbody>
								</table>
								<br>
								<br>
								<small id="${parentFolderID}-col7-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col7-row${countRows2}')">Comments</a>
							</td>
							<td>
								
							</td>
							<td>
								${data[i].actualResult}
								<br>
								<br>
								<small id="${parentFolderID}-col9-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col9-row${countRows2}')">Comments</a>
							</td>
							</td>
							<td>
								${actualCostText}
								<br>
								<br>
								<small id="${parentFolderID}-col10-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col10-row${countRows2}')">Comments</a>
							</td>
							<td>
								${strVariance}
								<br>
								<br>
								<small id="${parentFolderID}-col11-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col11-row${countRows2}')">Comments</a>
							</td>
							<td>
								${files}
								<br>
								<br>
								<small id="${parentFolderID}-col12-row${countRows2}" class="label pull-right bg-red comment-count">0</small>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col12-row${countRows2}')">Comments</a>
							</td>
							<td>
								<div class="btn-group">
									<button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-lock"></i></button>
								</div>
							</td>
						</tr>
					`;
					
					
					arrCommentIDS.push("'" + `${parentFolderID}-col5-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col7-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col9-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col10-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col11-row${countRows2}` + "'");
					arrCommentIDS.push("'" + `${parentFolderID}-col12-row${countRows2}` + "'");
				}
				$(".comment-count").hide();
				$("#tblViewClientFocus tbody:first").append(newContent);
			}
		});
		
		arrCommentIDS.push("'" + `${parentFolderID}-col5-generalcomment` + "'");
		console.log(arrCommentIDS.join());
		
		
		setTimeout(function() {
			if (arrCommentIDS.length != 0) {
				$.ajax({
					url: "../program_assets/php/web/gbp",
					data: {
						command   : 'load_comment',
						query_where : arrCommentIDS.join()
					},
					type: 'post',
					success: function (data) {
						var data = jQuery.parseJSON(data);
						
						for (var i = 0; i < data.length; i++) {
							$("#" + data[i].commentMotherID).text(data[i].count);
							$("#" + data[i].commentMotherID).show();
						}
					}
				});
			}
		}, 1000);
	}, 2000);
	

    
    setTimeout(function() {
        var originalAmount = $("#lblGAABudget").text().replaceAll(",","");
        var amountRemoved = Number(totalPrimarySource) + Number(totalOtherSource);
		var percentageRemoved = (amountRemoved / originalAmount) * 100;
        
        $("#lblGADPercent").text(percentageRemoved.toFixed(2) + "%");
        
        if ($("#lblGADPercent").text() == "Infinity%" || $("#spPercent").text() == "NaN%") {
            $("#lblGADPercent").text("0.00%");
        }
        
        $("#lblPrimarySource").text(totalPrimarySource.toLocaleString('en-US', {maximumFractionDigits: 2}));
        $("#lblOtherSource").text(totalOtherSource.toLocaleString('en-US', {maximumFractionDigits: 2}));
		
		var generalTotal = Number(totalPrimarySource + totalOtherSource);
		$("#lblGAABudget").text(generalTotal.toLocaleString('en-US', {maximumFractionDigits: 2}));
		
		$("#lblPrimarySource2").text($("#lblPrimarySource").text());
		$("#lblOtherSource2").text($("#lblOtherSource").text());
		$("#lblGAABudget2").text($("#lblGAABudget").text());
    }, 3000);
}

function loadGBPTable() {
    tblGBPTable = 
    $('#tblGBPTable').DataTable({
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
            className: "btn btn-default btn-sm hide btn-export-gbp",
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
        	'url'       : '../program_assets/php/web/gbp_report.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_gbp_table_filter',
                report  : $("#cmbFilterReport").val(),
                year    : $("#cmbFilterYear").val(),
                status  : $("#cmbFilterStatus").val(),
                college : $("#cmbFilterCollege").val()
        	}    
        },
        'aoColumns' : [
        	{ mData: 'reportType'},
            { mData: 'remarks'},
            { mData: 'year'},
            { mData: 'status'},
            { mData: 'totalAmount'},
            { mData: 'fullName'},
            { mData: 'id',
                render: function (data,type,row) {
                    var enableEdit = row.status == 'Draft' ? '' : ' disabled';
                    var enableView = row.status != 'Draft' ? '' : ' disabled';
                    
                    //return '<div class="input-group">' + 
                    //       '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list gbp-table-view" '+ enableView +'>' +
                    //       '		<i class="fa fa-eye"></i>' +
                    //       '	</button>' +
                    //       '</div>';
					
					return `
						<div class="btn-group">
							<button type="button" class="btn btn-sm btn-default btn-row-pdf"><i class="fa fa-file-pdf-o"></i></button>
						</div>
					`;
                }
            }
        ],
        'aoColumnDefs': [
        //	{"className": "custom-center", "targets": [8]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5]},
        	{ "width": "1%", "targets": [6] },
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

var final_status;


$('#tblGBPTable tbody').on('click', 'td button', function (){
	var selected_data = tblGBPTable.row( $(this).parents('tr') ).data();
	final_status = selected_data.status;
	
	if (selected_data.reportType == "Accomplishment Report") {
        loadARAmount(selected_data.parentFolderID);
    } else {
		$.ajax({
			url: "../program_assets/php/web/sessioner.php",
			data: {
				command   : 'change_docu_status',
				docu_status : selected_data.status
			},
			type: 'post',
			success: function (data) {
				window.open('../pdf/gbp2.php?ref=' + selected_data.parentFolderID, '_blank');
			}
		});
	}
});

			
var total_gaa,act_gad,orig_bud,util_bud,per_gad;

function loadARAmount(parentFolderID) {
	$.ajax({
		url: "../program_assets/php/web/accomplishment",
		data: {
			command   : 'load_acc_details',
			parentFolderID : parentFolderID
		},
		type: 'post',
		success: function (data) {
			var data = jQuery.parseJSON(data);
			
			for (var i = 0; i < data.length; i++) {
				total_gaa = data[i].totalAmount;
				
				//$("#spOrg").text(data[i].college);
				//$("#spOrgHi").text(data[i].college);
				//$("#lblGAABudget").text();
				//$("#lblFY").text(data[i].year);
				//$("#lblApprovedByName").text(data[i].approvedBy);
				//$("#lblApprovedByPosition").text(data[i].approvedByPosition);
				//$("#lblPreparedByName").text(data[i].preparedBy);
				//$("#lblPreparedByPosition").text(data[i].preparedByPosition);
				//$("#lblDocReq").text(data[i].status);
				//$("#spRef").text(data[i].ref);
				//$("#spDateEndorse2").text(data[i].dateEndorse);
			}
			
			//$("#spTotalExpenditure_mirror").text($("#spTotalExpenditure").text());
			//$("#spOriginalBudget_mirror").text($("#spOriginalBudget").text());
			//$("#spUtilBudget_mirror").text($("#spUtilBudget").text());
			//$("#spGADExp_mirror").text($("#spGADExp").text());
			getTotalUtils(parentFolderID);
		}
	});
}

function getTotalUtils(parentFolderID) {
  $.ajax({
    url: "../program_assets/php/web/accomplishment",
    data: {
      command   : 'all_cost',
      parentFolderID : parentFolderID
    },
    type: 'post',
    success: function (data) {
      var data = jQuery.parseJSON(data);
      
      console.log(data);
      
	  act_gad = data[0].totalExpense;
	  orig_bud = data[0].totalBudget;
	  
	  var percent_util = (Number(data[0].totalExpense.replaceAll(",","")) / Number(data[0].totalBudget.replaceAll(",",""))) * 100;
      var percent_gad =  (Number(data[0].totalExpense.replaceAll(",","")) / Number(total_gaa.replaceAll(",",""))) * 100;
	  
	  util_bud = percent_util.toFixed(2);
	  per_gad = percent_gad.toFixed(2);
	  
	  
      //$("#spTotalExpenditure").text(data[0].totalExpense);
      //$("#spOriginalBudget").text(data[0].totalBudget);
      //
      //var percent_util = (Number(data[0].totalExpense.replaceAll(",","")) / Number(data[0].totalBudget.replaceAll(",",""))) * 100;
      //var percent_gad =  (Number(data[0].totalExpense.replaceAll(",","")) / Number($("#spTotalGAA").text().replaceAll(",",""))) * 100;
      //
      //$("#spUtilBudget").text(percent_util.toFixed(2));
      //$("#spGADExp").text(percent_gad.toFixed(2));
	  exportPDFAR(parentFolderID);
    }
  });
}


function exportPDFAR(parentFolderID) {
	$.ajax({
        url: "../program_assets/php/web/accomplishment",
        data: {
            command   : 'pdf_acc',
            total_gaa : total_gaa,
            act_gad : act_gad,
            orig_bud : orig_bud,
            util_bud : util_bud,
            per_gad : per_gad
        },
        type: 'post',
        success: function (data) {
            
            
			
			if (final_status == "Complete") {
                window.open('../pdf/ar.php?ref=' + parentFolderID, '_blank');
            } else {
				$.ajax({
					url: "../program_assets/php/web/sessioner.php",
					data: {
						command   : 'change_docu_status',
						docu_status : final_status
					},
					type: 'post',
					success: function (data) {
						window.open('../pdf/ar2.php?ref=' + parentFolderID, '_blank');
					}
				});
			}
        }
    });
}

function openCommentModal(commentID) {
    commentMotherID = commentID;
    $("#txtComment").val(null);
    $("#txtCommentFile").val(null);
    $("#mdComments").modal();
    $("#dvComments").html(null);
    loadComments();
	
	
	$.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'read_comment',
            commentMotherID : commentID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            if (!data[0].error) {
                $("#" + commentID).hide();
            }
        }
    });
}

function loadComments() {
    var comments = "";
    
    $.ajax({
        url: "../program_assets/php/web/gbp.php",
        data: {
            command   : 'show_comments',
            commentMotherID : commentMotherID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            for (var i = 0; i < data.length; i++) {
				
				var color = "bg-gray";
                var postion = data[i].position;
                
                if (postion == "Encoder") {
                    color = "bg-primary";
                } else {
                    color = "bg-green";
                }
                
                comments += `
                    <div class="row">
                        <div class="col-md-12 col-sm-12">
                            <div class="alert `+ color +` cust-label">
                                <div class="row">
                                    <div class="col-md-12">
                                        <label>${data[i].fullName}</label>
                                        <br>
                                        <span>${data[i].comment}</span>
                                        <br>
                                        <i><span>${data[i].dateCreated}</span></i>
                                        <br>
                                        <br>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="btn-group pull-right">
                                            <button type="button" onclick="downLoadFile('${data[i].folderID}','${data[i].fileName}')" class="btn btn-default" ${data[i].fileName != null ? '' : 'disabled'}><i class="fa fa-download"></i></button>
                                            <button type="button" onclick="deleteComment(${data[i].id})" class="btn btn-default"><i class="fa fa-trash"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            console.log(comments);
            $("#dvComments").html(comments);
        }
    });
}

$("#btnSaveComment").click(function(){
	var comment = $("#txtComment").val();
    var file = $("#txtCommentFile").val();
    var folderID = Date.now();
    
    if (comment == "" || comment == null) {
        JAlert("Please add some comment","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/gbp.php",
            data: {
                command  : 'save_comment',
                commentMotherID : commentMotherID,
                comment : comment
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                if (!data[0].error) {
                    if (file == "") {
                        JAlert(data[0].message,data[0].color);
                        $("#txtComment").val(null);
                        loadComments();
                    } else {
                        attachFile(folderID,data[0].last_id);
                    }
                }
            }
        });
    }
});

function deleteComment(commentID) {
    $.ajax({
        url: "../program_assets/php/web/gbp.php",
        data: {
            command   : 'delete_comment',
            commentID : commentID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            loadComments();
        }
    });
}

function attachFile(folderID,updateID) {
    var file_data = $('#txtCommentFile').prop('files')[0];
    var fileInput = document.getElementById('txtCommentFile');   
    var filename = fileInput.files[0].name;
    var form_data = new FormData();
    
    form_data.append('commentMotherID', updateID);    
    form_data.append('file', file_data);    
    form_data.append('fileName', filename);
    form_data.append('folderID', folderID);
    form_data.append('command', 'upload_file_comment');
    $.ajax({
        url: "../program_assets/php/web/gbp",
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
                $("#txtComment").val(null);
                $("#txtCommentFile").val(null);
                loadComments();
            }
        }
    });
}
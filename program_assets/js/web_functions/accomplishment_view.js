var tblGBPTable;
var totalPrimarySource = 0;
var totalOtherSource = 0;
var commentMotherID = "";
var selectParentFolderID = "";
var creatorEmail = "";

$("#btnViewGBP").click(function(){
	showGBPView(cur_parentFolderID);
	
	$.ajax({
		url: "../program_assets/php/web/accomplishment",
		data: {
			command   : 'load_acc_details',
			parentFolderID : cur_parentFolderID
		},
		type: 'post',
		success: function (data) {
			var data = jQuery.parseJSON(data);
			
			for (var i = 0; i < data.length; i++) {
				$("#spOrg").text(data[i].college);
				$("#spOrgHi").text(data[i].college);
				$("#lblGAABudget").text(0);
				$("#lblFY").text(data[i].year);
				$("#lblApprovedByName").text(data[i].approvedBy);
				$("#lblApprovedByPosition").text(data[i].approvedByPosition);
				$("#lblPreparedByName").text(data[i].preparedBy);
				$("#lblPreparedByPosition").text(data[i].preparedByPosition);
				$("#lblDocReq").text(data[i].status);
				$("#spRef").text(data[i].ref);
				$("#spDateEndorse2").text(data[i].dateEndorse);
			}
			
			$("#spTotalExpenditure_mirror").text($("#spTotalExpenditure").text());
			$("#spOriginalBudget_mirror").text($("#spOriginalBudget").text());
			$("#spUtilBudget_mirror").text($("#spUtilBudget").text());
			$("#spGADExp_mirror").text($("#spGADExp").text());
		}
	});
	
	$("#mdViewGBP").modal();
});

$("#aGeneralComments").click(function(){
	openCommentModal(`${cur_parentFolderID}-generalcomment`);
});

function showGBPView(parentFolderID) {
	var countRows = 0;
	var countRows2 = 1;
	selectParentFolderID = parentFolderID;
    
	const tableBody_client = document.querySelector('#tblViewClientFocus tbody');
	tableBody_client.innerHTML = '';
	
	const tableBody_org = document.querySelector('#tblViewOrgFocus tbody');
	tableBody_org.innerHTML = '';
	
	
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
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col1-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${causeGender}
                            <br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col2-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${gadResult}
                            <br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col3-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${relevantOrg}
                            <br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col4-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${ data[i].gadActivity }
                            <br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col5-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${performanceIndicator}
                            <br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col6-row${countRows}')">Comments</a>
                        </td>
						<td>
							${data[i].actualResult}
							<br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col9-row${countRows}')">Comments</a>
						</td>
                        <td colspan="2">
                            <table id="tbNotThis" style="width:100%;">
                                <tbody>
                                    ${budgetText}
                                </tbody>
                            </table>
                            <br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col7-row${countRows}')">Comments</a>
                        </td>
						<td>
							${actualCostText}
							<br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col10-row${countRows}')">Comments</a>
						</td>
						<td>
							${strVariance}
							<br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col11-row${countRows}')">Comments</a>
						</td>
						<td>
                            ${office}
                            <br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col8-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            ${files}
                            <br>
                            <br>
                            <a href="#" onclick="openCommentModal('${parentFolderID}-col12-row${countRows}')">Comments</a>
                        </td>
                        <td>
                            <div class="btn-group" style="width: 100px;">
                                <button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-lock"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            }
            
            $("#tblViewClientFocus tbody").append(newContent);
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
								<a href="#" onclick="openCommentModal('${parentFolderID}-col1-row${countRows}')">Comments</a>
							</td>
							<td>
								${causeGender}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col2-row${countRows}')">Comments</a>
							</td>
							<td>
								${gadResult}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col3-row${countRows}')">Comments</a>
							</td>
							<td>
								${relevantOrg}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col4-row${countRows}')">Comments</a>
							</td>
							<td>
								${ data[i].gadActivity }
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col5-row${countRows}')">Comments</a>
							</td>
							<td>
								${performanceIndicator}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col6-row${countRows}')">Comments</a>
							</td>
							<td>
								${data[i].actualResult}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col9-row${countRows}')">Comments</a>
							</td>
							<td colspan="2">
								<table id="tbNotThis" style="width:100%;">
									<tbody>
										${budgetText}
									</tbody>
								</table>
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col7-row${countRows}')">Comments</a>
							</td>
							<td>
								${actualCostText}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col10-row${countRows}')">Comments</a>
							</td>
							<td>
								${strVariance}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col11-row${countRows}')">Comments</a>
							</td>
							<td>
								${office}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col8-row${countRows}')">Comments</a>
							</td>
							<td>
								${files}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col12-row${countRows}')">Comments</a>
							</td>
							<td>
								<div class="btn-group" style="width: 100px;">
									<button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-lock"></i></button>
								</div>
							</td>
						</tr>
					`;
				}
				
				$("#tblViewClientFocus tbody:first").append(newContent);
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
								<a href="#" onclick="openCommentModal('${parentFolderID}-col7-row${countRows2}')">Comments</a>
							</td>
							<td>
								
							</td>
							<td>
								${data[i].actualResult}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col9-row${countRows2}')">Comments</a>
							</td>
							</td>
							<td>
								${actualCostText}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col10-row${countRows2}')">Comments</a>
							</td>
							<td>
								${strVariance}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col11-row${countRows2}')">Comments</a>
							</td>
							<td>
								${files}
								<br>
								<br>
								<a href="#" onclick="openCommentModal('${parentFolderID}-col12-row${countRows2}')">Comments</a>
							</td>
							<td>
								<div class="btn-group">
									<button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-lock"></i></button>
								</div>
							</td>
						</tr>
					`;
				}
				
				$("#tblViewClientFocus tbody:first").append(newContent);
			}
		});
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

function openCommentModal(commentID) {
    commentMotherID = commentID;
    $("#txtComment").val(null);
    $("#txtCommentFile").val(null);
    $("#mdComments").modal();
    $("#dvComments").html(null);
    loadComments();
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
                
                comments += `
                    <div class="row">
                        <div class="col-md-12 col-sm-12">
                            <div class="alert bg-gray cust-label">
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

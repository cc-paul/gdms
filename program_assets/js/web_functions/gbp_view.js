var totalPrimarySource;
var totalOtherSource;

$("#btnViewGBP").click(function(){
	showParentGBP();
});

function showParentGBP() {
    totalPrimarySource = 0;
    totalOtherSource = 0;
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'load_activity_parent',
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            for (var i = 0; i < data.length; i++) {
                showGBPView(data[i].parentFolderID);
                $("#mdViewGBP").modal();
                
                $("#lblFY").text(data[i].year);
                $("#lblGAABudget").text(data[i].totalAmount);
				
				$("#lblApprovedByName").text(data[i].approvedBy);
				$("#lblApprovedByPosition").text(data[i].approvedByPosition);
				$("#lblPreparedByName").text(data[i].preparedBy);
				$("#lblPreparedByPosition").text(data[i].preparedByPosition);
            }
        }
    });
}

function showGBPView(parentFolderID) {
    
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
            
            $("#tblViewClientFocus tbody").append(newContent);
            
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
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${causeGender}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${gadResult}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${relevantOrg}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${ data[i].gadActivity }
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${performanceIndicator}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td colspan="2">
                            <table style="width:100%;">
                                <tbody>
                                    ${budgetText}
                                </tbody>
                            </table>
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${office}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${files}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            <div class="btn-group">
                                <button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-edit"></i></button>
                                <button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-lock"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            }
            
            $("#tblViewClientFocus tbody").append(newContent);
        }
    });
    
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
            
            $("#tblViewOrgFocus tbody").append(newContent);
            
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
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${causeGender}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${gadResult}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${relevantOrg}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${ data[i].gadActivity }
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${performanceIndicator}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td colspan="2">
                            <table style="width:100%;">
                                <tbody>
                                    ${budgetText}
                                </tbody>
                            </table>
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${office}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            ${files}
                            <br>
                            <br>
                            <a href="#">Comments</a>
                        </td>
                        <td>
                            <div class="btn-group">
                                <button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-edit"></i></button>
                                <button type="button" class="btn btn-default" style="width: 43px"><i class="fa fa-lock"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            }
            
            $("#tblViewOrgFocus tbody").append(newContent);
        }
    });
    
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
    }, 1500);
}
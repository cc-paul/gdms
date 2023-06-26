<?php
	if(!isset($_SESSION)) { session_start(); } 
	if (!isset($_SESSION['id'])) {
		header( "Location: login" );
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title></title>
		<!-- Tell the browser to be responsive to screen width -->
		<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
		<!-- Bootstrap 3.3.7 -->
		<link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
		<!-- Font Awesome -->
		<link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
		<!-- Ionicons -->
		<link rel="stylesheet" href="../bower_components/Ionicons/css/ionicons.min.css">
		<!-- DataTables -->
  		<link rel="stylesheet" href="../bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
  		<link rel="stylesheet" href="../bower_components/datatables.select/select.dataTables.min.css">
		<!-- Select2 -->
  		<link rel="stylesheet" href="../bower_components/select2/dist/css/select2.min.css">
		<!-- Theme style -->
		<link rel="stylesheet" href="../dist/css/AdminLTE.min.css">
		<!-- AdminLTE Skins. Choose a skin from the css/skins
		folder instead of downloading all of them to reduce the load. -->
		<link rel="stylesheet" href="../dist/css/skins/_all-skins.min.css">
		<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
		<!--link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic"-->
		<link rel="stylesheet" href="../fonts/fonts.css">
		<!-- Custom Confirm -->
		<link rel="stylesheet" href="../bower_components/custom-confirm/jquery-confirm.min.css">
		<link href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css" rel="stylesheet">
		<!-- tokenize -->
		<link rel="stylesheet" href="../bower_components/tokenize2/tokenize2.css">
		
		<!-- StartUp Custom CSS (do not remove)  -->
		<link href="../plugins/bootoast/bootoast.css" rel="stylesheet" type="text/css">
		<link href="../program_assets/css/style.css" rel="stylesheet" type="text/css">
		<link
			rel="stylesheet"
			href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css"
			type="text/css"
		/>
		
		<style>
			.own-card {
				background: #f6f6f6;
				margin: 10px;
			}
			
			.pointer {
				cursor:pointer;
			}
			
			.full_modal-dialog {
				width: 90% !important;
				height: 92% !important;
				min-width: 90% !important;
				min-height: 92% !important;
				max-width: 90% !important;
				max-height: 92% !important;
				padding: 0 !important;
			}
			
			.full_modal-content {
				height: 99% !important;
				min-height: 99% !important;
				max-height: 99% !important;
			}
			
			.ellipsis {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		</style>
	</head>
	
	<!-- ADD THE CLASS fixed TO GET A FIXED HEADER AND SIDEBAR LAYOUT -->
	<!-- the fixed layout is not compatible with sidebar-mini -->
	<body class="hold-transition skin-black-light fixed sidebar-mini">
		<!-- Site wrapper -->
		<div class="wrapper">
			<header class="main-header">
				<!-- Logo -->
				<a href="#" class="logo">
					<!-- mini logo for sidebar mini 50x50 pixels -->
					<span class="logo-mini"></span>
					<!-- logo for regular state and mobile devices -->
					<span class="logo-lg"></span>
				</a>
				<!-- Header Navbar: style can be found in header.less -->
				<nav class="navbar navbar-static-top">
					<!-- Sidebar toggle button-->
					<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</a>
					<div class="navbar-custom-menu">
						<ul class="nav navbar-nav">
							<!--<li class="dropdown notifications-menu">
	    						<a href="#" class="dropdown-toggle" data-toggle="dropdown">
									<i class="fa fa-bell-o"></i>
									<span id="sp-notif-counter" name= "sp-notif-counter" class="label label-warning"></span>
					            </a>
					            <ul class="dropdown-menu">
					            	<li id="li-noti" name="li-noti" class="header">You have 0 notification(s)</li>
					            	<li>
					            		<ul class="menu">
					            		</ul>
					            	</li>
					            	<li class="footer"><a href="javascript:void(0);" id="read_all" name="read_all">Mark all as read</a></li>
					            </ul>
	    					</li>-->
							
							<!-- User Account: style can be found in dropdown.less -->
							<li class="dropdown user user-menu">
								<a href="#" class="dropdown-toggle" data-toggle="dropdown">
									<img src="./../profile/<?php  echo $_SESSION['id'] ?>.png?random=<?php echo rand(10,100);?>" class="user-image" alt="User Image" onerror="this.onerror=null; this.src='./../profile/Default.png'">
									<span class="hidden-xs">
										<?php
											$to_display = "name";
											require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
										?>
									</span>
								</a>
								<ul class="dropdown-menu">
									<!-- User image -->
									<li class="user-header">
										<img src="./../profile/<?php  echo $_SESSION['id'] ?>.png?random=<?php echo rand(10,100);?>" class="img-circle" alt="User Image" onerror="this.onerror=null; this.src='./../profile/Default.png'">
										<p>
											<?php
												$to_display = "name";
												require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
											?>
											&nbsp;-&nbsp;
											<?php
												$to_display = "branch";
												require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
											?>

											<small>
												Member since : 
												<?php
													$to_display = "date_created";
													require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
												?>
											</small>
										</p>
									</li>
									<!-- Menu Footer-->
									<li class="user-footer">
										<div class="pull-left">
											<a href="profile" class="btn btn-default btn-flat">Profile</a>
										</div>
										<div class="pull-right">
											<a href="logout" class="btn btn-default btn-flat">Sign out</a>
										</div>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</nav>
			</header>
			<!-- =============================================== -->
			<!-- Left side column. contains the sidebar -->
			<aside class="main-sidebar">
				<!-- sidebar: style can be found in sidebar.less -->
				<section class="sidebar">
					<!-- Sidebar user panel -->
					<div class="user-panel">
						<div class="pull-left image">
							<img src="./../profile/cs.png" class="img-circle" alt="User Image" onerror="this.onerror=null; this.src='./../profile/Default.png'" style="max-height: 50px;">
						</div>
						<div class="pull-left info">
							<p>
								<?php	
									$to_display = "name";
									require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
								?>
							</p>
							<a href="#"><i id="c_status" name="c_status" class="fa fa-circle text-success"></i> Online</a>
						</div>
					</div>
					<!-- search form -->
					<div class="sidebar-form">
						<div class="input-group">
							<input type="text" name="q" class="form-control" placeholder="Search...">
							<span class="input-group-btn">
								<button type="submit" name="search" id="search-btn" class="btn btn-flat">
									<i class="fa fa-search"></i>
								</button>
							</span>
						</div>
					</div>
					<!-- /.search form -->
					<!-- sidebar menu: : style can be found in sidebar.less -->
					<ul class="sidebar-menu" data-widget="tree">
						<li class="header">MAIN NAVIGATION</li>
						<?php
							include dirname(__FILE__,2) . '/program_assets/php/sidebar/sidebar.php';
						?>
					</ul>
				</section>
				<!-- /.sidebar -->
			</aside>
			<!-- =============================================== -->
			<!-- Content Wrapper. Contains page content -->
			<div class="content-wrapper">
				<!-- Content Header (Page header) -->
				<section class="content-header">
					<h1>
						@side_header
						<small>@side_desc</small>
					</h1>
					<ol class="breadcrumb page-order"></ol>
				</section>
				<!-- Main content -->
				<section class="content col-md-10 col-sm-12">
					<div class="nav-tabs-custom">
						<ul class="nav nav-tabs">
							<li class="active"><a href="#admin" data-toggle="tab" aria-expanded="true" class="cust-label">Endorsed GBP</a></li>
							<!--<li class=""><a href="#gender" data-toggle="tab" aria-expanded="true" class="cust-label">Gender Issues</a></li>-->
						</ul>
						<div class="tab-content">
							<div class="tab-pane active" id="admin">
								<div class="row" hidden>
									<div class="col-md-10 col-sm-12">
										<input id="txtSearchAcc" class="form-control input-sm cust-label" type="text" placeholder="Search accomplishment here..." autocomplete="off">
									</div>
									<div class="col-md-2 col-xs-6">
										<button id="btnExport" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
											<i class="fa fa-file-excel-o"></i>
											&nbsp;
											Export to Excel
										</button>
									</div>
								</div>
								<div class="row" hidden>
									<div class="col-md-12 col-sm-12">
										<div class="table-container">
											<table id="tblAccTable" name="tblAccTable" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
												<thead>
													<tr>
														<th>Report Type</th>
														<th>College</th>
														<th>Year</th>
														<th>Status</th>
														<th>Amount</th>
														<th>Created By</th>
														<th></th>
													</tr>
												</thead>
												<tbody></tbody>
											</table>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12 col-xs-12">
										<div class="btn-group pull-right">
											<button id="btnViewGBP" type="button" class="btn btn-default cust-label">
												&nbsp;
												<i class="fa fa-eye"></i>
												&nbsp;
												View AR
												&nbsp;
											</button>
											<!--<button id="btnSaveDraft" name="btnSaveDraft" type="button" class="btn btn-default cust-label" disabled="">
												&nbsp;
												<i class="fa fa-edit"></i>
												&nbsp;
												Save Draft
												&nbsp;
											</button>-->
											<button id="btnSubmitGBPFinal" name="btnSubmitGBPFinal" type="button" class="btn btn-default cust-label">
												&nbsp;
												<i class="fa fa-send"></i>
												&nbsp;
												Submit AR
												&nbsp;
											</button>
										</div>
									</div>
								</div>
								<br>
								<div class="row">
									<div class="col-md-3 col-xs-12">
										<label class="cust-label">Reference: </label>
										<span class="cust-label">No Reference ID</span>
									</div>
									<div class="col-md-3 col-xs-12">
										<label class="cust-label">Date Endoresed: </label>
										<span id="spDateEndorse" class="cust-label"></span>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12 col-xs-12">
										<label class="cust-label">Organization: </label>
										<span id="spCollege" class="cust-label"></span>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12 col-xs-12">
										<label class="cust-label">Total Budget/GAA of Organization: </label>
										<span id="spTotalGAA" class="cust-label"></span>
									</div>
								</div>
								<div class="row">
									<div class="col-md-3 col-xs-12">
										<label class="cust-label">Actual GAD Expenditure: </label>
										<br>
										<span id="spTotalExpenditure" class="cust-label">0</span>
									</div>
									<div class="col-md-3 col-xs-12">
										<label class="cust-label">Original Budget: </label>
										<br>
										<span id="spOriginalBudget" class="cust-label">0</span>
									</div>
									<div class="col-md-3 col-xs-12">
										<label class="cust-label">% of Util. of Budget: </label>
										<br>
										<span id="spUtilBudget" class="cust-label">0</span>
									</div>
									<div class="col-md-3 col-xs-12">
										<label class="cust-label">% of GAD Exp.: </label>
										<br>
										<span id="spGADExp" class="cust-label">0%</span>
									</div>
								</div>
								<br>
								<br>
								<div class="row">
									<div class="col-md-12 col-xs-12">
										<div class="nav-tabs-custom">
											<ul class="nav nav-tabs">
												<li class="active" id="liTabActive"><a href="#tab1" data-toggle="tab" aria-expanded="true" class="cust-label" onClick="selectTab(1);">Client Focused</a></li>
												<li class=""><a href="#tab1" data-toggle="tab" aria-expanded="true" class="cust-label" onClick="selectTab(2);">Organization Focused</a></li>
												<li class=""><a href="#tab3" data-toggle="tab" aria-expanded="true" class="cust-label" onClick="selectTab(3);">Attributed Program</a></li>
											</ul>
											<div class="tab-content">
												<div class="tab-pane active" id="tab1">
													<div class="row">
														<div class="col-md-10 col-xs-12">
															<div class="form-group">
																<input id="txtSearchClientFocus" class="form-control input-sm cust-label" type="text" placeholder="Search data here..." autocomplete="off">
															</div>
														</div>
														<div class="col-md-2 col-xs-12">
															<div class="form-group">
																<select id="cmbClientXEntries" name="cmbClientXEntries" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
																	<option value="5" selected>Showing 5 Entries</option>
																	<option value="10">Showing 10 Entries</option>
																	<option value="15">Showing 15 Entries</option>
																	<option value="20">Showing 20 Entries</option>
																	<option value="25">Showing 25 Entries</option>
																</select>
															</div>
														</div>
													</div>
													<div class="row" style="height:350px; overflow-x:auto;">
														<div class="col-md-12 col-sm-12">
															<div class="table-container">
																<table id="tblClientFocus" name="tblClientFocus" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
																	<thead>
																		<tr>
																			<th>Gender Issue / GAD Mandate</th>
																			<th>GAD Activity</th>
																			<th>Total Agency Approved Budget</th>
																			<th>Actual Cost / Expenditure</th>
																			<th>Variance / Remarks</th>
																			<th>Action</th>
																		</tr>
																	</thead>
																	<tbody></tbody>
																</table>
																
																<br>
																<div hidden>
																	<table id="tblClientFocus2" name="tblClientFocus2" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
																		<thead>
																			<tr>
																				<th>Gender Issue / GAD Mandate</th>
																				<th>GAD Activity</th>
																				<th>Total Agency Approved Budget</th>
																				<th>Actual Cost / Expenditure</th>
																				<th>Variance / Remarks</th>
																				<th>Action</th>
																			</tr>
																		</thead>
																		<tbody></tbody>
																	</table>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="tab-pane" id="tab3">
													<div class="row">
														<div class="col-md-10 col-xs-12">
															<div class="form-group">
																<input id="txtSearchAttr" class="form-control input-sm cust-label" type="text" placeholder="Search data here..." autocomplete="off">
															</div>
														</div>
														<div class="col-md-2 col-xs-12">
															<div class="form-group">
																<select id="cmbAttrXEntries" name="cmbAttrXEntries" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
																	<option value="5" selected>Showing 5 Entries</option>
																	<option value="10">Showing 10 Entries</option>
																	<option value="15">Showing 15 Entries</option>
																	<option value="20">Showing 20 Entries</option>
																	<option value="25">Showing 25 Entries</option>
																</select>
															</div>
														</div>
													</div>
													<div class="row" style="height:350px; overflow-x:auto;">
														<div class="col-md-12 col-sm-12">
															<div class="table-container">
																<table id="tblAttrMain" name="tblAttrMain" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
																	<thead>
																		<tr>
																			<th>Program</th>
																			<th>Budget</th>
																			<th>Budget Source</th>
																			<th>Attachments</th>
																			<th>Actual Cost / Expenditure</th>
																			<th>Variance / Remarks</th>
																			<th>Action</th>
																		</tr>
																	</thead>
																	<tbody></tbody>
																</table>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<!-- /.content -->
			</div>
			<!-- /.content-wrapper -->
			<footer class="main-footer">
				<div class="pull-right hidden-xs">
					<!-- Version or anything -->
				</div>
				<strong class="cust-label">Program created by: <a id="footer-cname" name="footer-cname" href="#">CompanyName</a> </strong> 
				<span class="cust-label">IT Department.</span>
			</footer>
			<!-- Add the sidebar's background. This div must be placed
			immediately after the control sidebar -->
			<div class="control-sidebar-bg"></div>
		</div>
		<!-- ./wrapper -->
		
		<div class="modal fade" id="mdViewGBP" name="mdViewGBP">
			<div class="modal-dialog full_modal-dialog">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">View GBP</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						
					</div>
					<div class="box-footer">
						
					</div>
				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdGBP" name="mdGBP" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog modal-custom">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">GBP Activity Form</label>
						<button id="btnCloseGBP" type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body" style="height: 720px !important; overflow-x: hidden; overflow-y: auto;">
						<div class="row">
							<div class="col-md-3 col-xs-6">
								<label id="lblFormTitle" class="cust-label">Client Focused</label>
							</div>
							<div class="col-md-9 col-xs-6">
								<button id="btnGuide" type="button" class="btn btn-default btn-sm cust-textbox pull-right" style="visibility: hidden;">
									&nbsp;&nbsp;
									<i class="fa fa-book"></i>
									&nbsp;
									Guide
									&nbsp;&nbsp;
								</button>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<label class="cust-label">Indicate the Gender Issue being addressed by the activity</label>
								
								<div class="btn-group pull-right" style="margin-bottom:3px;">
									<button  id="btnAddGender_" type="button" class="btn btn-default btn-sm" style="visibility: hidden;"><i class="fa fa-search"></i></button>
									<button onClick="clearContent('txtGenderIssueAddress');" type="button" class="btn btn-default btn-sm" style="visibility: hidden;"><i class="fa fa-trash"></i></button>
								</div>
								<textarea id="txtGenderIssueAddress" name="txtGenderIssueAddress" rows="5" class="form-control cust-label cust-textbox" placeholder="Please select Gender Issue" disabled></textarea>
								<div id="dvGenderIssueAddress"></div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<label class="cust-label">Indicate the GAD Mandate being addressed by the activity</label>
								
								<div class="btn-group pull-right" style="margin-bottom:3px;">
									<button id="btnAddGAD_" type="button" class="btn btn-default btn-sm" style="visibility: hidden;"><i class="fa fa-search"></i></button>
									<button onClick="clearContent('txtGADAddress');" type="button" class="btn btn-default btn-sm" style="visibility: hidden;"><i class="fa fa-trash"></i></button>
								</div>
								<textarea id="txtGADAddress" name="txtGADAddress" rows="5" class="form-control cust-label cust-textbox" placeholder="Please select GAD Mandate" disabled></textarea>
								<div id="dvGADAddress"></div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblGenderIssue" name="tblGenderIssue" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th>
													<i class="fa fa-fw fa-transgender-alt"></i>&nbsp;
													Indicate the cause of Gender Issue
													<label class="cust-label text-danger">*</label>
												</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="2">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvGenderIssue"></div>
														</div>
														<div class="col-md-6 col-xs-12">
															<button style="visibility: hidden;" id="btnAddGenderIssue" name="btnAddGenderIssue" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblGADStatement" name="tblGADStatement" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th>
													<i class="fa fa-fw fa-lightbulb-o"></i>&nbsp;
													GAD Result Statement / Objectives
													<label class="cust-label text-danger">*</label>
												</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="2">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvGADStatement"></div>								
														</div>
														<div class="col-md-6 col-xs-12">
															<button style="visibility: hidden;" id="btnAddGADStatement" name="btnAddGADStatement" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>							
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblRelevantMFO" name="tblRelevantMFO" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th colspan="3">
													<i class="fa fa-pencil"></i> &nbsp;
													Relevant MFO/PAP or PPA (Optional)
												</th>
											</tr>
											<tr>
												<th>Type</th>
												<th>MFO / PAP Statement</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="3">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvRelevantMFO"></div>								
														</div>
														<div class="col-md-6 col-xs-12">
															<button style="visibility: hidden;" id="btnAddRelevantMFO" name="btnAddRelevantMFO" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>								
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<label class="cust-label">GAD Activity</label>
								<label class="cust-label text-danger">*</label>
								<textarea id="txtGADActivity" name="txtGADActivity" rows="3" class="form-control cust-label cust-textbox" placeholder="Please Enter GAD Activity" disabled></textarea>
								<div id="dvGADActivity"></div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblPerformanceIndicator" name="tblPerformanceIndicator" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th colspan="3">
													<i class="fa fa-fw fa-gears"></i>&nbsp;
													Performance Indicator(s)
													<label class="cust-label text-danger">*</label>
												</th>
											</tr>
											<tr>
												<th>Perfomance Indicator</th>
												<th>Target</th>
												<th>Action</th>
											</tr>
											<tr style="background-color: aliceblue;">
												<td>No. of staff trained in Gender Analysis <i>(sample only)</i></td>
												<td>300 staff trained in Gender Analysis <i>(sample only)</i></td>
												<td></td>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="3">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvPerformanceIndicator"></div>								
														</div>
														<div class="col-md-6 col-xs-12">
															<button style="visibility: hidden;" id="btnAddPerformanceIndicator" name="btnAddPerformanceIndicator" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>								
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblBudget" name="tblBudget" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th colspan="4">
													<i class="fa fa-money"></i>&nbsp;
													Budget
													<label class="cust-label text-danger">*</label>
												</th>
											</tr>
											<tr>
												<th>Budget Source</th>
												<th>Budget Item</th>
												<th>Budget</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="4">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvBudget"></div>								
														</div>
														<div class="col-md-6 col-xs-12">
															<button style="visibility: hidden;" id="btnAddBudget" name="btnAddBudget" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>								
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblResponsibleOffices" name="tblResponsibleOffices" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th>
													<i class="fa fa-fw fa-building"></i>&nbsp;
													Responsible Offices
													<label class="cust-label text-danger">*</label>
												</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="2">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvResponsibleOffices"></div>									
														</div>
														<div class="col-md-6 col-xs-12">
															<button style="visibility: hidden;" id="btnAddResponsibleOffices" name="btnAddResponsibleOffices" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>								
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-7 col-sm-12">
								<div class="alert bg-gray cust-label" style="margin-top: 7px;">
									<strong>Reminder : </strong> Please check the following guidelines below
									<br>
									<br>
									1. Once a field has been added it will become required.
									<br>
									2. Delete a field by clicking trash button on the side
									<br>
									3. Fields with <code>*</code> are required
								</div>
								<input type="file" class="form-control cust-label cust-textbox"
									id="txtFile" name="txtFile" placeholder="Enter File Name"
									style="visibility:hidden	"
									accept=
									"application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
									text/plain, application/pdf,.doc,.docx">
								
							</div>
							<div class="col-md-5 col-sm-12">
								<div class="table-containerx">
									<table id="tblFiles" name="tblFiles" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th>
													<div style="margin-top: 6px;">
														<label class="cust-label">Accepted Files : </label>
														<i class="fa fa-fw fa-file-word-o"></i>
														<i class="fa fa-fw fa-file-excel-o"></i>
														<i class="fa fa-fw fa-file-pdf-o"></i>
														<i class="fa fa-fw fa-file-text-o"></i>
													</div>
												</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="2">
													<button style="visibility: hidden;" id="btnAddFiles" name="btnAddFiles" type="button" class="btn btn-default btn-sm cust-textbox pull-right" onclick="$('#txtFile').click();">
														&nbsp;&nbsp;
														<i class="fa fa-plus"></i>
														&nbsp;
														Add Another
														&nbsp;&nbsp;
													</button>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-9 col-xs-12">
							</div>
							<div class="col-md-3 col-xs-12">
								<button style="visibility: hidden;" id="btnSaveGBP" name="btnSaveGBP" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									<i class="fa fa-save"></i>
									&nbsp;
									Save All
								</button>
							</div>
						</div>
					</div>
				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdAttr" name="mdAttr" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog modal-custom">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Attributed Program Form</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<label class="cust-label">Major Program / Flagship Program</label>
								<label class="cust-label text-danger">*</label>
								<textarea
									id="txtProgram"
									name="txtProgram"
									rows="5"
									class="form-control cust-label cust-textbox"
									placeholder="Please Enter Program Details" disabled></textarea>
								<div id="dvProgram"></div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblBudget_attr" name="tblBudget_attr" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th colspan="4">
													<i class="fa fa-money"></i>&nbsp;
													Budget
													<label class="cust-label text-danger">*</label>
												</th>
											</tr>
											<tr>
												<th>Budget Source</th>
												<th>Budget Item (Optional)</th>
												<th>Budget</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="4">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvBudget_attr"></div>								
														</div>
														<div class="col-md-6 col-xs-12">
															<button style="visibility:hidden;" id="btnAddBudget_attr" name="btnAddBudget_attr" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>								
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-7 col-sm-12">
								<div class="alert bg-gray cust-label" style="margin-top: 7px;">
									<strong>Reminder : </strong> Please check the following guidelines below
									<br>
									<br>
									1. Once a field has been added it will become required.
									<br>
									2. Delete a field by clicking trash button on the side
									<br>
									3. Fields with <code>*</code> are required
								</div>
								<input type="file" class="form-control cust-label cust-textbox"
									id="txtFile_attr" name="txtFile_attr" placeholder="Enter File Name"
									style="visibility:hidden	"
									accept=
									"application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
									text/plain, application/pdf,.doc,.docx">
							</div>
							<div class="col-md-5 col-sm-12">
								<div class="table-containerx">
									<table id="tblFiles_attr" name="tblFiles_attr" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th>
													<div style="margin-top: 6px;">
														<label class="cust-label">Accepted Files : </label>
														<i class="fa fa-fw fa-file-word-o"></i>
														<i class="fa fa-fw fa-file-excel-o"></i>
														<i class="fa fa-fw fa-file-pdf-o"></i>
														<i class="fa fa-fw fa-file-text-o"></i>
													</div>
												</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="2">
													<button style="visibility:hidden;" id="btnAddFiles_attr" name="btnAddFiles_attr" type="button" class="btn btn-default btn-sm cust-textbox pull-right" onclick="$('#txtFile_attr').click();">
														&nbsp;&nbsp;
														<i class="fa fa-plus"></i>
														&nbsp;
														Add Another
														&nbsp;&nbsp;
													</button>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-9 col-xs-12">
							</div>
							<div class="col-md-3 col-xs-12">
								<button id="btnSaveGBP_attr" name="btnSaveGBP_attr" type="button" class="btn btn-block btn-default btn-sm cust-textbox" style="visibility:hidden;">
									<i class="fa fa-save"></i>
									&nbsp;
									Save All
								</button>
							</div>
						</div>
					</div>
				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdAccForm" name="mdAccForm" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog modal-custom">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Accomplishment Form</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<label class="cust-label">Actual Result (Outcome)</label>
								<label class="cust-label text-danger">*</label>
								<textarea id="txtGADActivity_acc" name="txtGADActivity_acc" rows="3" class="form-control cust-label cust-textbox" placeholder="Please Enter Actual Result"></textarea>
								<div id="dvGADActivity_acc"></div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblBudget_acc" name="tblBudget_acc" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th colspan="4">
													<i class="fa fa-money"></i>&nbsp;
													Actual Cost and Expenditure
													<label class="cust-label text-danger">*</label>
												</th>
											</tr>
											<tr>
												<th>Expense Source</th>
												<th>Expense Item</th>
												<th>Expense</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="4">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvBudget_acc"></div>								
														</div>
														<div class="col-md-6 col-xs-12">
															<button id="btnAddBudget_acc" name="btnAddBudget_acc" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>								
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-containerx">
									<table id="tblVariance_acc" name="tblVariance_acc" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th colspan="3">
													<i class="fa fa-minus"></i>&nbsp;
													Variance and Remarks
													<label class="cust-label text-danger">*</label>
												</th>
											</tr>
											<tr>
												<th>Variance</th>
												<th>Remarks</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody></tbody>
										<tfoot>
											<tr>
												<td colspan="3">
													<div class="row">
														<div class="col-md-6 col-xs-12">
															<div id="dvVariance_acc"></div>								
														</div>
														<div class="col-md-6 col-xs-12">
															<button id="btnAddVariance_acc" name="btnAddVariance_acc" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
																&nbsp;&nbsp;
																<i class="fa fa-plus"></i>
																&nbsp;
																Add Another
																&nbsp;&nbsp;
															</button>								
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-9 col-xs-12">
							</div>
							<div class="col-md-3 col-xs-12">
								<button id="btnSaveAcc" name="btnSaveAcc" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									<i class="fa fa-save"></i>
									&nbsp;
									Save All
								</button>
							</div>
						</div>
					</div>
				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>
		
		<!-- jQuery 3 -->
		<script src="../bower_components/jquery/dist/jquery.min.js"></script>
		<!-- Bootstrap 3.3.7 -->
		<script src="../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
		<!-- Select2 -->
		<script src="../bower_components/select2/dist/js/select2.full.min.js"></script>
		<!-- DataTables -->
		<script src="../bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
		<script src="../bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
		<script src="../bower_components/datatables.select/dataTables.select.min.js"></script>
		<script src="../bower_components/datatables.button/dataTables.buttons.min.js"></script>
		<script src="../bower_components/datatables.button/jszip.min.js"></script>
		<script src="../bower_components/datatables.button/buttons.html5.min.js"></script>
		<!-- SlimScroll -->
		<script src="../bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
		<!-- FastClick -->
		<script src="../bower_components/fastclick/lib/fastclick.js"></script>
		<!-- AdminLTE App -->
		<script src="../dist/js/adminlte.min.js"></script>
		<script src="../plugins/bootoast/bootoast.js"></script>
		<!-- Custom Confirm -->
		<script src="../bower_components/custom-confirm/jquery-confirm.min.js"></script>
		<script src="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js"></script>
		<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>
		<!-- tokenize  -->
		<script src="../bower_components/tokenize2/tokenize2.js"></script>
		
		<!-- StartUp Custom JS (do not remove)  -->
		<script src="../program_assets/js/site_essentials/sidebar.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/site_essentials/others.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/accomplishment.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/accomplishment_form.js?random=<?php echo uniqid(); ?>"></script>
		
	</body>
</html>
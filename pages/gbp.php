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
							<li class="active"><a href="#admin" data-toggle="tab" aria-expanded="true" class="cust-label">Prepare GBP</a></li>
						</ul>
						<div class="tab-content" style="height: 600px; overflow-x: hidden;">
							<div class="tab-pane active" id="admin">
								<div class="row">
									<div class="col-md-12 col-xs-12">
										<div class="btn-group pull-right">
											<button id="btnViewGBP" type="button" class="btn btn-default cust-label">
												&nbsp;
												<i class="fa fa-eye"></i>
												&nbsp;
												View GBP
												&nbsp;
											</button>
											<button id="btnViewReportFilter" type="button" class="btn btn-default cust-label">
												&nbsp;
												<i class="fa fa-file-word-o"></i>
												&nbsp;
												Report Filter
												&nbsp;
											</button>
											<button id="btnSignatory" type="button" class="btn btn-default cust-label">
												&nbsp;
												<i class="fa fa-thumbs-up"></i>
												&nbsp;
												Set Signatory
												&nbsp;
											</button>
											<button id="btnSaveDraft" name="btnSaveDraft" type="button" class="btn btn-default cust-label">
												&nbsp;
												<i class="fa fa-edit"></i>
												&nbsp;
												Save Draft
												&nbsp;
											</button>
											<button id="btnSubmitGBPFinal" name="btnSubmitGBPFinal" type="button" class="btn btn-default cust-label">
												&nbsp;
												<i class="fa fa-send"></i>
												&nbsp;
												Submit GBP
												&nbsp;
											</button>
										</div>
									</div>
								</div>
								<br>
								<br
								<div class="row">
									<div class="col-md-12" hidden>
										<?php
											include "../program_assets/php/connection/conn.php";
											$data_parentFolderID = "-";
											$data_year = "";
											$data_amount = "";
											$data_status = "";
											$data_approver = "";
											$id = $_SESSION["id"];
											
											$sql = "
												SELECT
													a.parentFolderID,
													a.`year`,
													FORMAT( a.totalAmount, 0 ) AS totalAmount,
													a.`status`,
													b.approvedBy
												FROM
													omg_gbp_parent a  
												LEFT JOIN 
													omg_signatory b 
												ON 
													a.parentFolderID = b.parentFolderID
												WHERE
													a.createdBy = $id 
												ORDER BY
													a.id DESC 
													LIMIT 1;
											";
											$result = mysqli_query($con,$sql);
											
											while ($row  = mysqli_fetch_assoc($result)) {
												$data_parentFolderID = $row["parentFolderID"];
												$data_year = $row["year"];
												$data_amount = $row["totalAmount"];
												$data_status = $row["status"];
												$data_approver = $row["approvedBy"];
											}
										?>
										<label id="lblParentFolderID" class="cust-label">
											<?php echo $data_parentFolderID ?>
										</label>
										
										<label id="lblParentYear" class="cust-label">
											<?php echo $data_year ?>
										</label>
										
										<label id="lblParentAmount" class="cust-label">
											<?php echo $data_amount ?>
										</label>
										
										<label id="lblParentStatus" class="cust-label">
											<?php echo $data_status ?>
										</label>
									</div>
								</div>
								<div class="row">
									<div class="col-md-3 col-xs-6">
										<div class="row">
											<div class="col-md-12 col-xs-12">
												<label class="cust-label">Organization</label>
											</div>
										</div>
										<div class="row">
											<div class="col-md-12 col-xs-12">
												<label class="cust-label">Year</label>
											</div>
										</div>
										<div class="row">
											<div class="col-md-12 col-xs-12">
												<label class="cust-label">Total GAA or Budget of Organization</label>
											</div>
										</div>
										<div class="row">
											<div class="col-md-12 col-xs-12">
												<label class="cust-label">Total GAD Budget : </label>
												<label class="cust-label">PHP</label>
												<span id="lblTotalBudget" name="lblTotalBudget" class="cust-label">0.00</span>
											</div>
										</div>

									</div>
									<div class="col-md-9 col-xs-6">
										<div class="row">
											<div class="col-md-12 col-xs-12">
												<span class="cust-label"><?php echo $_SESSION["college"]; ?></span>
											</div>
										</div>
										<div class="row">
											<div class="col-md-2 col-xs-12">
												<select id="cmbYear" name="cmbYear" class="form-control select2 cust-label cust-textbox">
													<option value="" selected disabled>Select Year</option>
												</select>
											</div>
										</div>
										<div class="row">
											<div class="col-md-3 col-xs-12">
												<div class="form-groupX">
													<input id="txtAllottedBudget" class="form-control input-sm cust-label" type="text" placeholder="Enter Amount Here" autocomplete="off">
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col-md-12 col-xs-12">
												<b>
													<span class="cust-label">Total PHP</span>
												</b>
												<span id="spTotalBudget" name="spTotalBudget" class="cust-label">0.00</span>
												<div id="dvGadAllocated">
													
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-3 col-xs-6">
										<div class="row">
											<div class="col-md-12 col-xs-12">
												<label class="cust-label">% of GAD Allocation</label>
											</div>
										</div>
									</div>
									<div class="col-md-9 col-xs-6">
										<div class="row">
											<div class="col-md-12 col-xs-12">
												<span id="spPercent" name="spPercent" class="cust-label">0.00%</span>
											</div>
										</div>
									</div>
								</div>
								<br>
								<div class="row">
									<div class="col-md-8 col-xs-12">
									</div>
									<div class="col-md-2 col-xs-12">
										<button id="btnAddActivity" name="btnAddActivity" type="button" class="btn btn-block btn-default btn-sm cust-textbox pull-right">
											<i class="fa fa-file-text-o"></i>
											&nbsp;
											New Activity
										</button>		
									</div>
									<div class="col-md-2 col-xs-12">
										<button id="btnDeleteActivity" name="btnDeleteActivity" type="button" class="btn btn-block btn-default btn-sm cust-textbox pull-right">
											<i class="fa fa-trash"></i>
											&nbsp;
											Delete All
										</button>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-12 col-xs-12">
										<div class="nav-tabs-custom">
											<ul class="nav nav-tabs">
												<li class="active"><a href="#tab1" data-toggle="tab" aria-expanded="true" class="cust-label" onClick="selectTab(1);">Client Focused</a></li>
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
													<div class="row">
														<div class="col-md-12 col-sm-12">
															<div class="table-container">
																<table id="tblClientFocus" name="tblClientFocus" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
																	<thead>
																		<tr>
																			<th>Gender Issue / GAD Mandate</th>
																			<th>GAD Activity</th>
																			<th>Performance Indicators</th>
																			<th>Budget</th>
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
																				<th>Performance Indicators</th>
																				<th>Budget</th>
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
												<div class="tab-pane" id="tab3" style="height: 350px; overflow-x: hidden;">
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
													<div class="row">
														<div class="col-md-12 col-sm-12">
															<div class="table-container">
																<table id="tblAttrMain" name="tblAttrMain" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
																	<thead>
																		<tr>
																			<th>Program</th>
																			<th>Budget</th>
																			<th>Budget Source</th>
																			<th>Attachments</th>
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
								<div class="row" id="dvReminder">
									<div class="col-md-12 col-xs-12">
										<div class="alert alert-info alert-dismissible">
											<h4><i class="icon fa fa-info"></i> Alert!</h4>
											<!--Unable to create GBP. There is an ongoing approval. You can create/edit once it is returned to you.-->
											The <?php echo $data_year; ?> GAD Plan and Budget Report has been submitted to <?php echo $data_approver; ?> of Gender and 
Development Resource Center for review and may not be edited until it has been returned to you.
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
					
				</div>
				<strong class="cust-label">Program created by: <a id="footer-cname" name="footer-cname" href="#">CompanyName</a> </strong> 
				<span class="cust-label">IT Department.</span>
			</footer>
			<!-- Add the sidebar's background. This div must be placed
			immediately after the control sidebar -->
			<div class="control-sidebar-bg"></div>
		</div>
		<!-- ./wrapper -->
		
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
								<button id="btnGuide" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
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
									<button  id="btnAddGender_" type="button" class="btn btn-default btn-sm"><i class="fa fa-search"></i></button>
									<button onClick="clearContent('txtGenderIssueAddress');" type="button" class="btn btn-default btn-sm"><i class="fa fa-trash"></i></button>
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
									<button id="btnAddGAD_" type="button" class="btn btn-default btn-sm"><i class="fa fa-search"></i></button>
									<button onClick="clearContent('txtGADAddress');" type="button" class="btn btn-default btn-sm"><i class="fa fa-trash"></i></button>
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
															<button id="btnAddGenderIssue" name="btnAddGenderIssue" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
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
															<button id="btnAddGADStatement" name="btnAddGADStatement" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
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
															<button id="btnAddRelevantMFO" name="btnAddRelevantMFO" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
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
								<textarea id="txtGADActivity" name="txtGADActivity" rows="3" class="form-control cust-label cust-textbox" placeholder="Please Enter GAD Activity"></textarea>
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
															<button id="btnAddPerformanceIndicator" name="btnAddPerformanceIndicator" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
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
															<button id="btnAddBudget" name="btnAddBudget" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
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
															<button id="btnAddResponsibleOffices" name="btnAddResponsibleOffices" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
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
													<button id="btnAddFiles" name="btnAddFiles" type="button" class="btn btn-default btn-sm cust-textbox pull-right" onclick="$('#txtFile').click();">
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
								<button id="btnSaveGBP" name="btnSaveGBP" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
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
		<div class="modal fade" id="mdGADList" name="mdGADList">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">GAD List Selection</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-9 col-xs-6">
								<div class="form-groupx">
									<input id="txtSearchGAD" class="form-control input-sm cust-label" type="text" placeholder="Search GAD here...">
								</div>
							</div>
							<div class="col-md-3 col-xs-6">
								<div class="form-group">
									<button id="btnAddGAD" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
										<i class="fa fa-gear"></i>
										&nbsp;
										New GAD
									</button>
								</div>
							</div>
						</div>
					</div>
					<div class="box-body" style="height: 500px; overflow-x: hidden; overflow-y: auto;">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<table id="tblGAD" name="tblGAD" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th></th>
												<th>Year</th>
												<th>Statement</th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-9 col-xs-12"></div>
							<div class="col-md-3 col-xs-12">
								<button id="btnSelectGAD" name="btnSelectGAD" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									&nbsp;&nbsp;
									<i class="fa fa-edit"></i>
									&nbsp;
									Select
									&nbsp;&nbsp;
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
		<div class="modal fade" id="mdGenderList" name="mdGenderList">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Gender List Selection</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-9 col-xs-6">
								<div class="form-groupx">
									<input id="txtSearchGenderList" class="form-control input-sm cust-label" type="text" placeholder="Search Gender here...">
								</div>
							</div>
							<div class="col-md-3 col-xs-6">
								<div class="form-group">
									<button id="btnAddGender" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
										<i class="fa fa-transgender"></i>
										&nbsp;
										New Gender
									</button>
								</div>
							</div>
						</div>
					</div>
					<div class="box-body" style="height: 500px; overflow-x: hidden; overflow-y: auto;">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<table id="tblGenderList" name="tblGenderList" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th></th>
												<th>Year</th>
												<th>Statement</th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-9 col-xs-12"></div>
							<div class="col-md-3 col-xs-12">
								<button id="btnSelectGender" name="btnSelectGender" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									&nbsp;&nbsp;
									<i class="fa fa-edit"></i>
									&nbsp;
									Select
									&nbsp;&nbsp;
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
									placeholder="Please Enter Program Details"></textarea>
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
															<button id="btnAddBudget_attr" name="btnAddBudget_attr" type="button" class="btn btn-default btn-sm cust-textbox pull-right">
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
													<button id="btnAddFiles_attr" name="btnAddFiles_attr" type="button" class="btn btn-default btn-sm cust-textbox pull-right" onclick="$('#txtFile_attr').click();">
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
								<button id="btnSaveGBP_attr" name="btnSaveGBP_attr" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
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
		<div class="modal fade" id="mdDetails" name="mdDetails">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Masterfile Details</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<label class="cust-label">Statement</label>
								<label class="cust-label text-danger">*</label>
								<textarea id="txtStatement" name="txtStatement" rows="6" class="form-control cust-label cust-textbox" placeholder="Enter Statement Details"></textarea>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-9 col-xs-12"></div>
							<div class="col-md-3 col-xs-12">
								<button id="btnSaveStatement" name="btnSaveStatement" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									<i class="fa fa-save"></i>
									&nbsp;
									Save Changes
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
		<div class="modal fade" id="mdViewGBP" name="mdViewGBP">
			<div class="modal-dialog full_modal-dialog">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">View GBP</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-12 col-xs-12">
								<div class="btn-group">
									<button type="button" class="btn btn-default"><i class="fa fa-file-excel-o"></i></button>
									<button type="button" class="btn btn-default"><i class="fa fa-file-pdf-o"></i></button>
									<button type="button" class="btn btn-default"><i class="fa fa-file-word-o"></i></button>
								</div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12">
								<center>
									<label class="cust-label">ANNUAL GENDER AND DEVELOPMENT (GAD) PLAN AND BUDGET</label>
									<br>
									<label class="cust-label">FY</label>
									<label id="lblFY" class="cust-label" style="margin-left:10px;">0000</label>
									<br>
									<a href="#" class="cust-label">General Comments</a>
								</center>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<table id="table_name" name="table_name" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<td colspan="4">
													<span class="cust-label">
														<b>Organization:</b> 
													</span>
													<span class="cust-label">
														<?php echo $_SESSION["college"]; ?>
													</span>
												</td>
												<td colspan="4">
													<span class="cust-label">
														<b>Organization Category:</b> 
													</span>
													<span class="cust-label">
														<?php echo $_SESSION["college"]; ?>
													</span>
												</td>
											</tr>
											<tr>
												<td colspan="5">
													<span class="cust-label">
														<b>Organization Hierarchy:</b> 
													</span>
													<span class="cust-label">
														<?php echo $_SESSION["college"]; ?>
													</span>
												</td>
											</tr>
											<tr>
												<td style="width: 250px;">
													<span class="cust-label">
														<b>Total Budget/GAA of Organization</b> 
													</span>
												</td>
												<td>
													<span id="lblGAABudget" class="cust-label">
														0
													</span>
												</td>
												<td>
													<span class="cust-label">
														<b>Primary Source</b> 
													</span>
												</td>
												<td colspan="2">
													<span id="lblPrimarySource" class="cust-label">
														0
													</span>
												</td>
											</tr>
											<tr>
												<td colspan="2"></td>
												<td>
													<span class="cust-label">
														<b>Other Source</b> 
													</span>
												</td>
												<td colspan="2">
													<span id="lblOtherSource" class="cust-label">
														0
													</span>
												</td>
											</tr>
											<tr>
												<td>
													<span class="cust-label">
														<b>% of GAD Allocation</b> 
													</span>
												</td>
												<td colspan="2">
													<span id="lblGADPercent" class="cust-label">
														0.00%
													</span>
												</td>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<div style="height: 300px">
										<table id="tblViewClientFocus" name="tblViewClientFocus" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
											<thead>
												<tr>
													<th style="vertical-align: middle; width:104px;"></th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Gender Issue / <br> GAD Mandate
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Cause of Gender Issue
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															GAD Result Statement / <br> GAD Objective
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Relevant Organization <br> MFO/PAP or PPA
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															GAD Activity
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Performance Indicator / <br> Targets
														</center>
													</th>
													<th style="vertical-align: middle; width:151px;">
														<center>
															GAD Budget
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Source of Budget
														</center>
													</th>
													<th style="vertical-align: middle; width:200px;">
														<center>
															Responsible Unit / <br> Offices
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Attachments
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Action
														</center>
													</th>
												</tr>
												<tr>
													<th></th>
													<th style="vertical-align: middle;">
														<center>
															1
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															2
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															3
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															4
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															5
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															6
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															7
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															8
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															9
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															10
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															
														</center>
													</th>
												</tr>
												<!--<tr>
													<th colspan="12" style="background-color:#FFFDCC">
														<center>
															CLIENT FOCUSED
														</center>
													</th>
												</tr>-->
											</thead>
											<tbody></tbody>
											<tfoot>
												<tr>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td colspan="2">
														<b>SUB TOTAL</b>
													</td>
													<td>
														<span id="lblPrimarySource2" class="cust-label"></span>
													</td>
													<td>GAA</td>
													<td></td>
													<td></td>
												</tr>
												<tr>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td>
														<span id="lblOtherSource2" class="cust-label"></span>
													</td>
													<td>ODA</td>
													<td></td>
													<td></td>
												</tr>
												<tr>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td colspan="2">
														<b>TOTAL GAD BUDGET</b>
													</td>
													<td>
														<span id="lblGAABudget2" class="cust-label"></span>
													</td>
													<td></td>
													<td></td>
													<td></td>
												</tr>
											</tfoot>
										</table>
									</div>
								</div>
							</div>
						</div>
						<br>
						<div class="row" hidden>
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<div style="width:2806px">
										<table id="tblViewOrgFocus" name="tblViewOrgFocus" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
											<thead>
												<tr>
													<th style="vertical-align: middle; width:104px;"></th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Gender Issue / <br> GAD Mandate
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Cause of Gender Issue
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															GAD Result Statement / <br> GAD Objective
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Relevant Organization <br> MFO/PAP or PPA
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															GAD Activity
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Performance Indicator / <br> Targets
														</center>
													</th>
													<th style="vertical-align: middle; width:151px;">
														<center>
															GAD Budget
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Source of Budget
														</center>
													</th>
													<th style="vertical-align: middle; width:200px;">
														<center>
															Responsible Unit / <br> Offices
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Attachments
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Action
														</center>
													</th>
												</tr>
												<tr>
													<th></th>
													<th style="vertical-align: middle;">
														<center>
															1
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															2
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															3
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															4
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															5
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															6
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															7
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															8
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															9
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															10
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															
														</center>
													</th>
												</tr>
												<tr>
													<th colspan="12" style="background-color:#FFFDCC">
														<center>
															ORGANIZATIONAL FOCUSED
														</center>
													</th>
												</tr>
											</thead>
											<tbody></tbody>
											<tfoot>
												
											</tfoot>
										</table>
									</div>
								</div>
							</div>
						</div>
						<br>
						<br>
						<div class="row">
							<div class="col-md-4 col-xs-12">
								<div class="row">
									<div class="col-md-6 col-xs-12">
										<label class="cust-label">Prepared By : </label>
									</div>
									<div class="col-md-6 col-xs-12">
										<label class="cust-label">Approved By : </label>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4 col-xs-12">
								<div class="row">
									<div class="col-md-6 col-xs-12">
										<label id="lblPreparedByName" class="cust-label"></label>
									</div>
									<div class="col-md-6 col-xs-12">
										<label id="lblApprovedByName" class="cust-label"></label>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4 col-xs-12">
								<div class="row">
									<div class="col-md-6 col-xs-12">
										<label id="lblPreparedByPosition" class="cust-label"></label>
									</div>
									<div class="col-md-6 col-xs-12">
										<label id="lblApprovedByPosition" class="cust-label"></label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-3 col-xs-4 pull-right">
								<div class="pull-right">
									<label class="cust-label">
										Document Status : 
									</label>
									<span id="lblDocReq"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdSignatory" name="mdSignatory">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Set Signatory</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-6 col-sm-12">
								<div class="form-group">
								  <label for="txtPreparedBy" class="cust-label">Prepared By</label>
								  <input type="text" class="form-control cust-label cust-textbox" id="txtPreparedBy" name="txtPreparedBy" placeholder="Enter Prepared By Name" autocomplete="off">
								</div>
							</div>
							<div class="col-md-6 col-sm-12">
								<div class="form-group">
								  <label for="txtPreparedByPosition" class="cust-label">Position</label>
								  <input type="text" class="form-control cust-label cust-textbox" id="txtPreparedByPosition" name="txtPreparedByPosition" placeholder="Enter Postion" autocomplete="off">
								</div>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-6 col-sm-12">
								<div class="form-group">
								  <label for="txtApprovedBy" class="cust-label">Approved By</label>
								  <input type="text" class="form-control cust-label cust-textbox" id="txtApprovedBy" name="txtApprovedBy" placeholder="Enter Approvers Name" autocomplete="off">
								</div>
							</div>
							<div class="col-md-6 col-sm-12">
								<div class="form-group">
								  <label for="txtApprovedByPosition" class="cust-label">Position</label>
								  <input type="text" class="form-control cust-label cust-textbox" id="txtApprovedByPosition" name="txtApprovedByPosition" placeholder="Enter Position" autocomplete="off">
								</div>
							</div>
						</div>			
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-4 col-xs-12 pull-right">
								<button id="btnSaveSignatory" name="btnSaveSignatory" type="button" class="btn btn-block btn-default btn-sm cust-textbox pull-right">
									<i class="fa fa-save"></i>
									&nbsp;
									Save Signatory
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
		<div class="modal fade" id="mdComments" name="mdComments">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Comments</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div id="dvComments" class="box-body" style="height: 334px; overflow-y: auto; overflow-x: hidden;">
						
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<textarea id="txtComment" name="txtComment" rows="4" class="form-control cust-label cust-textbox" placeholder="Enter Comment Details"></textarea>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-8 col-sm-12">
								
							</div>
							<div class="col-md-4 col-sm-12">
								<div class="form-group">
									<input
										type="file"
										class="form-control cust-label cust-textbox cust-label"
										id="txtCommentFile"
										name="txtCommentFile"
										accept=
										"application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
										text/plain, application/pdf,.doc,.docx"
									>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-8 col-xs-12"></div>
							<div class="col-md-4 col-xs-12">
								<button id="btnSaveComment" name="btnSaveComment" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									<i class="fa fa-save"></i>
									&nbsp;
									Save Changes
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
		<div class="modal fade" id="mdSentApproval" name="mdSentApproval">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">GBP Approval</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<textarea id="txtGBPRemarks" name="txtGBPRemarks" rows="6" class="form-control cust-label cust-textbox" placeholder="Before submitting, Please provide any remarks or detailed instruction"></textarea>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-8 col-xs-12"></div>
							<div class="col-md-4 col-xs-12">
								<button id="btnProceedSubmit" name="btnProceedSubmit" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									<i class="fa fa-send"></i>
									&nbsp;
									Proceed to Submission
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
		<div class="modal fade" id="mdGBPFilter" name="mdGBPFilter">
			<div class="modal-dialog modal-lg">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">GBP Filter</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-4 col-sm-12">
								<label class="cust-label">Report</label>
								<select id="cmbFilterReport" name="cmbFilterReport" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
									<option value="-" selected>Select All Report</option>
									<?php
										$to_filter = "report";
										require dirname(__FILE__,2) . '/program_assets/php/dropdown/filter.php';
									?>
								</select>
							</div>
							<div class="col-md-4 col-sm-12">
								<label class="cust-label">Year</label>
								<select id="cmbFilterYear" name="cmbFilterYear" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
									<option value="-" selected>Select All Year</option>
									<?php
										$to_filter = "year";
										require dirname(__FILE__,2) . '/program_assets/php/dropdown/filter.php';
									?>
								</select>
							</div>
							<div class="col-md-4 col-sm-12">
								<label class="cust-label">Status</label>
								<select id="cmbFilterStatus" name="cmbFilterStatus" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
									<option value="-" selected>Select All Status</option>
									<?php
										$to_filter = "status";
										require dirname(__FILE__,2) . '/program_assets/php/dropdown/filter.php';
									?>
								</select>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<table id="tblGBPTable" name="tblGBPTable" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th>Report Type</th>
												<th>Year</th>
												<th>Status</th>
												<th>Amount</th>
												<th>Remarks</th>
												<th></th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer"></div>
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
		<script src="../program_assets/js/web_functions/gbp.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_selection.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_validation.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_data.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_attr.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_attr_validation.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_attr_table.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_view.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/signatory.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_comments.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_submit.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_filter.js?random=<?php echo uniqid(); ?>"></script>
	</body>
</html>
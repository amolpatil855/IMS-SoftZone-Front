//== Class definition

var DatatableDataLocalDemo = function () {
	//== Private functions

	// demo initializer
	var demo = function () {

		 var dataJSONArray1 = JSON.parse('[{"StudentCode":"54473-200","Students Name":"Test Test","Fathers Name":"Test Test","Mothers Name":"Test Test","Gender":"Male","Date Of Birth":"25-04-1992","Date Of Joining":"25-04-2000","Address":"Test Test TEst","Phone":"1245784512","Country":"India","State":"Maharashtra","Religion":"Hindu","Caste":"Brahmin","Blood Group":"B+","Email":"test@test.com"},{"StudentCode":"54473-251","Students Name":"Test Test","Fathers Name":"Test Test","Mothers Name":"Test Test","Gender":"Male","Date Of Birth":"25-04-1992","Date Of Joining":"25-04-2000","Address":"Test Test TEst","Phone":"1245784512","Country":"India","State":"Maharashtra","Religion":"Hindu","Caste":"Brahmin","Blood Group":"B+","Email":"test@test.com"},{"StudentCode":"54473-251","Students Name":"Test Test","Fathers Name":"Test Test","Mothers Name":"Test Test","Gender":"Male","Date Of Birth":"25-04-1992","Date Of Joining":"25-04-2000","Address":"Test Test TEst","Phone":"1245784512","Country":"India","State":"Maharashtra","Religion":"Hindu","Caste":"Brahmin","Blood Group":"B+","Email":"test@test.com"},{"StudentCode":"54473-251","Students Name":"Test Test","Fathers Name":"Test Test","Mothers Name":"Test Test","Gender":"Male","Date Of Birth":"25-04-1992","Date Of Joining":"25-04-2000","Address":"Test Test TEst","Phone":"1245784512","Country":"India","State":"Maharashtra","Religion":"Hindu","Caste":"Brahmin","Blood Group":"B+","Email":"test@test.com"},{"StudentCode":"54473-251","Students Name":"Test Test","Fathers Name":"Test Test","Mothers Name":"Test Test","Gender":"Male","Date Of Birth":"25-04-1992","Date Of Joining":"25-04-2000","Address":"Test Test TEst","Phone":"1245784512","Country":"India","State":"Maharashtra","Religion":"Hindu","Caste":"Brahmin","Blood Group":"B+","Email":"test@test.com"},{"StudentCode":"54473-251","Students Name":"Test Test","Fathers Name":"Test Test","Mothers Name":"Test Test","Gender":"Male","Date Of Birth":"25-04-1992","Date Of Joining":"25-04-2000","Address":"Test Test TEst","Phone":"1245784512","Country":"India","State":"Maharashtra","Religion":"Hindu","Caste":"Brahmin","Blood Group":"B+","Email":"test@test.com"}]');

		var datatable = $('.m_datatable').mDatatable({
			// datasource definition
			data: {
				type: 'local',
				source: dataJSONArray1,
				pageSize: 10
			},

			// layout definition
			layout: {
				theme: 'default', // datatable theme
				class: '', // custom wrapper class
				scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
				height: 450, // datatable's body's fixed height
				footer: false // display/hide footer
			},

			// column sorting
			sortable: true,

			pagination: true,

			// inline and bactch editing(cooming soon)
			// editable: false,

			// columns definition
			columns: [{
				field: "StudentCode",
				title: "StudentCode",
				width: 50,
				sortable: false,
				selector: false,
				textAlign: 'center'
			}, {
				field: "Students Name",
				title: "Students Name"
			}, {
				field: "Fathers Name",
				title: "Fathers Name",
				responsive: {visible: 'lg'}
			}, {
				field: "Mothers Name",
				title: "Mothers Name",
				width: 100
			}, {
				field: "Gender",
				title: "Gender",
				responsive: {visible: 'lg'}
			}, {
				field: "Date Of Birth",
				title: "Date Of Birth",
				type: "date",
				format: "MM/DD/YYYY"
			}, {
				field: "Date Of Joining",
				title: "Date Of Joining",
				type: "date",
				format: "MM/DD/YYYY"
			}, {
				field: "Address",
				title: "Address"
			}, {
				field: "Phone",
				title: "Phone"
			}, {
				field: "Country",
				title: "Country"
			}, {
				field: "State",
				title: "State"
			}, {
				field: "Religion",
				title: "Religion"
			}, {
				field: "Caste",
				title: "Caste"
			}, {
				field: "Blood Group",
				title: "Blood Group"
			}, {
				field: "Email",
				title: "Email"
			}
		]
		});

		var query = datatable.getDataSourceQuery();

		$('#m_form_search').on('keyup', function (e) {
			datatable.search($(this).val().toLowerCase());
		}).val(query.generalSearch);

		$('#m_form_status').on('change', function () {
			datatable.search($(this).val(), 'Status');
		}).val(typeof query.Status !== 'undefined' ? query.Status : '');

		$('#m_form_type').on('change', function () {
			datatable.search($(this).val(), 'Type');
		}).val(typeof query.Type !== 'undefined' ? query.Type : '');

		$('#m_form_status, #m_form_type').selectpicker();

	};

	return {
		//== Public functions
		init: function () {
			// init dmeo
			demo();
		}
	};
}();

jQuery(document).ready(function () {
	DatatableDataLocalDemo.init();
});
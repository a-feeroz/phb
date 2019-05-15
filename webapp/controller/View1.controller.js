sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator"

], function (Controller, Filter, MessageBox, FilterOperator) {
	"use strict";

	return Controller.extend("com.sap.booking.controller.View1", {
		onInit: function () {
			var jsonModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(jsonModel, "jsonmodel");
		},

		handleValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.sap.booking.view.Approve",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter(
				"ProjectName",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"ProjectName",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function (evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {

				var projectInput = this.getView().byId(this.inputId);
				projectInput.setValue(oSelectedItem.getDescription());
				this.projectId = oSelectedItem.getTitle();
			}
			evt.getSource().getBinding("items").filter([]);
		},

		onSearch: function (oEvent) {
			var Project = this.getView().byId("idProject").getValue();
			var Year = this.getView().byId("idYear").getSelectedItem();
			var BookingType = this.getView().byId("idBookingType").getSelectedItem();

			if (!Project || !Year || !BookingType) {
				MessageBox.error("Please Select all filters to Procced.");
				return;
			}
			this.getView().byId("idTableVisibility").setVisible(true);
			var aFilter ;
			this.yearValue = this.getView().byId("idYear").getSelectedItem().getKey();
			this.bookingTypeValue = this.getView().byId("idBookingType").getSelectedItem().getKey();
			aFilter =[ new Filter({
				and: true,
				filters: [
					new Filter("ProjectId", FilterOperator.EQ, this.projectId),
					new Filter("Year", FilterOperator.EQ, this.yearValue),
					new Filter("BookingTypeId", FilterOperator.EQ, this.bookingTypeValue)
				]
			})];

			this.getData(aFilter);

			/*	
				var table = this.getView().byId("idTableVisibility");
				var binding = table.getBinding("rows");
				binding.filter(aFilter);*/

		},

		getData: function (aFilter) {
			var oModel = this.getView().getModel();
			oModel.read("/BookingSet", {
				filters : aFilter,
				success: function (oData, oResponse) {
					var x = oData.results;
					var finalData = [];
					for (var i = 0; i < oData.results.length; i++) {
						var key = x[i].ProjectId + x[i].Year + x[i].BookingTypeId + x[i].ResourceId;
						
						var y = this.checkPresense(finalData, key);
						if (y == null) {
							var newData = {};

							newData.Identifier = key;
							newData.ProjectId = x[i].ProjectId;
							newData.Year = x[i].Year;
							newData.BookingTypeId = x[i].BookingTypeId;
							newData.ResourceId = x[i].ResourceId;
							newData.TaskId = x[i].TaskId;
							newData["Week" + x[i].Week] = x[i].Hours;

							finalData.push(newData);

						} else {
							finalData[y]["Week" + x[i].Week] = x[i].Hours;
						}
					}
					var jsonModel = this.getView().getModel("jsonmodel");
					jsonModel.setProperty("/bookingSet", finalData);
				}.bind(this),
				error: function (oError) {

				}
			});

		},

		checkPresense: function (finalData, key) {
			if (finalData.length) {
				for (var i = 0; i < finalData.length; i++) {
					if (finalData[i].Identifier == key) {
						return i;
					}
				}
				return null;
			} else {
				return null;
			}

		},

		onSelectYear: function (oEvent) {
			var mondays = this._getmondays(oEvent);

			var data = [];
			for (var i = 0; i < mondays.length; i++) {

				var x = {
					"day": mondays[i]
				};
				data.push(x);
			}
			var oModel = this.getView().getModel("jsonmodel");
			oModel.setProperty("/weeks", data);
		},

		_getmondays: function (year) {
			// Copy d if provided
			var Year = year.getSource().getSelectedKey();
			// Set to start of month
			var d = new Date(Year, 0, 1);

			var endYear = d.getFullYear() + 1;

			// Set to first Monday
			d.setDate(d.getDate() + (8 - (d.getDay() || 7)) % 7);
			var mondays = [];
			/*	var firstMonday = new Date(d).toDateString().substring(4, 11);
				var mondays = [firstMonday];*/

			// Create Dates for all Mondays up to end year and month
			while (d.getFullYear() < endYear) {
				var date = new Date(d.setDate(d.getDate())).toDateString().substring(4, 11);
				mondays.push(date);
				d.setDate(d.getDate() + 7);
			}
			return mondays;
		},

		onPressAddButton: function (oEvent) {

			var newData = {};

			newData.ProjectId = this.projectId;
			newData.Year = this.yearValue;
			newData.BookingType = this.bookingTypeValue;

			var jsonModel = this.getView().getModel("jsonmodel");
			var oBooking = jsonModel.getProperty("/bookingSet");
			oBooking.push(newData);
			jsonModel.setProperty("/bookingSet", oBooking);

		},

		onPressDeleteButton: function (oEvent) {
			var index = this.getView().byId("idTableVisibility").getSelectedIndex();
			if (index == -1) {
				MessageBox.error("Please Select an item to delete");
			} else {
				var bookingSet = this.getView().getModel("jsonmodel").getProperty("/bookingSet");
				bookingSet.splice(index, 1);
				this.getView().getModel("jsonmodel").setProperty("/bookingSet",bookingSet);

			}
		},
		
		onPressSaveButton : function(oEvent){
			var x = this.getView().getModel("jsonmodel").getProperty("/bookingSet");
			var finalData=[];
			for(var i=0;i<x.length;i++){
				var key = x[i].ProjectId + x[i].Year + x[i].BookingType + x[i].Resource;
				var z = x[i];
				for(var user in z){
					var y= user;
				}
			 for(var j = 1; j <= 52 ; j++){
			 	var week = "Week" + j;
			 	  if(x[i][week] !== undefined){
			    	var newData = {};

							newData.identifier = key;
							newData.ProjectId = x[i].ProjectId;
							newData.Year = x[i].Year;
							newData.BookingType = x[i].BookingType;
							newData.Resource = x[i].Resource;
							newData.Task = x[i].Task;
							newData.Week = j;
							newData.hours = x[i][week];        
						

							finalData.push(newData);
			 	  }
			  }
			}
		}

	});
});
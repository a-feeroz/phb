sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.sap.booking.controller.View1", {
		onInit: function () {

		},

		onValueHelpRequest: function() {
			var that = this;
			this.TypeDialog = new sap.m.SelectDialog({
				title: "Site Change",
				growingThreshold: 1000,
				growingScrollToLoad: true,
				growing: true,
				noDataText: "No Entries Found",

				liveChange: [that.typeSearch, that],
				confirm: [that.typeConfrm, that]
			});
		}
	});
});
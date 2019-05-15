function getNewData() {
	var Data = {
		results: [{
				"identifier": "12019PR11",
				"ProjectID": "1",
				"Year": "2019",
				"Btype": "P",
				"Resource": "R1",
				"Task": "T1",
				"Week": "1",
				"Hours": "40"
			}, {
				"identifier": "12019PR13",
				"ProjectID": "1",
				"Year": "2019",
				"Btype": "P",
				"Resource": "R1",
				"Task": "T1",
				"Week": "3",
				"Hours": "40"
			}, {
				"identifier": "12019PR21",
				"ProjectID": "1",
				"Year": "2019",
				"Btype": "P",
				"Resource": "R2",
				"Task": "T2",
				"Week": "1",
				"Hours": "40"
			}, {
				"identifier": "12019PR22",
				"ProjectID": "1",
				"Year": "2019",
				"Btype": "P",
				"Resource": "R2",
				"Task": "T2",
				"Week": "2",
				"Hours": "40"
			}

		]

	};

	var x = Data.results;
	var finalData = [];
	for (var i = 0; i < Data.results.length; i++) {
		var key = x[i].ProjectID + x[i].Year + x[i].Btype + x[i].Resource;
		var y = checkPresense(finalData, key);
		if (y == null) {
			var newData = {};

			newData.identifier = key;
			newData.ProjectID = x[i].ProjectID;
			newData.Year = x[i].Year;
			newData.Btype = x[i].Btype;
			newData.Resource = x[i].Resource;
			newData.Task = x[i].Task;
			newData["Week" + x[i].Week] = x[i].Hours;

			finalData.push(newData);

		}
		else{
			finalData[y]["Week" + x[i].Week]=x[i].Hours;
		}

	}
}

function checkPresence(finalData, key) {

	if (finalData.length) {
		for (var i = 0; i <finalData.length; i++) {
			if (finalData[i].identifier == key) {
				return i;
			}

		}
		return null;

	} else {
		return null;
	}

};


var x = this.getView().getModel("jsonmodel").getProperty("/bookingSet");
			var finalData=[];
			for(var i=0;i<x.length;i++){
				var key = x[i].ProjectId + x[i].Year + x[i].BookingType + x[i].Resource;
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
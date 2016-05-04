var obj={
	init:function(){
		obj.getData(false);
		obj.getOverheads(false);
		obj.getRequests(false);
	},
	getFile:function(url,func){
		var xhr=new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange=function(){
			if(xhr.status==200 && xhr.readyState ==4){
				func(xhr.responseText);
			}
		};
		xhr.send(null);
	},
	rewriteFile:function(func){

	},
	authorization:function(responseText){
		if(responseText!=false){
			var users = JSON.parse(responseText);

			users.map(function(user){
				if(user.login == obj.user.login && user.password == obj.user.password){
					return true;
				}
			});

			return false;
		}
		else{
			obj.getFile("json/users.json",function(string){
				obj.authorization(string);
			});
		}
	},
	getData:function(responseText){
		if(responseText!=false){
			console.log(responseText);
			obj.data=JSON.parse(responseText);
		}
		else{
			obj.getFile("json/products.json",function(string){
				obj.getData(string);
			});
		}
	},
	getOverheads:function(responseText){
		if(responseText!=false){
			obj.overheads=JSON.parse(responseText);
		}
		else{
			obj.getFile("json/overheads.json",function(string){
				obj.getOverheads(string);
			});
		}
	},
	getRequests:function(responseText){
		if(responseText!=false){
			obj.requests=JSON.parse(responseText);
		}
		else{
			obj.getFile("json/requests.json",function(string){
				obj.getRequests(string);
			});
		}
	},
	dataRequest:function(rights, tableId){

	}
};
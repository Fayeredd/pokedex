/**
 * 
 */
var pokeMon = {
		name : null,
		pokeindex : null,
		types : [],
		sprite : null,
		baseStats : [], 
		abilities : [], 
		moves : [],
		evolutions : [],
		relations : {
					null_from : [],
					quarter_from : [],
					half_from : [],
					double_from : [], 
					quad_from : []
					},
		games: []
};

var localPokes = [];

var getPoke = (function(input){

	pokeMon = {
			name : null,
			pokeindex : null,
			types : [], 
			sprite : null,
			baseStats : [], 
			abilities : [], 
			moves : [],
			evolutions : [],
			relations : {
						null_from : [],
						quarter_from : [],
						half_from : [],
						double_from : [], 
						quad_from : []
						},
			games: []
	};
	
	var local = false;
	
	for(h=0;h<localPokes.length;h++){
		if(localPokes[h].name === input){
			local = true;
			pokeMon = localPokes[h];
			displayMethod();
			break;
		}
	}
	
	if(!local){
		
		var counter = 0;
		var myData = null;
		var mySpec = null;
		
		var ajax1 = $.ajax({
			method : "GET",
			url : "https://pokeapi.co/api/v2/pokemon/" + input + "/"
		});
		
		
		var ajax2 = $.ajax({
			method : "GET",
			url : "https://pokeapi.co/api/v2/pokemon-species/" + input + "/"
		});
		
		function ajax3(c, types){
			return $.ajax({
				method : "GET",
				url : "https://pokeapi.co/api/v2/type/" +  myData.types[c].type.name + "/"
			});
		}
		
		function ajax4(address){
			return $.ajax({
				method : "GET",
				url : address
			});
		}
		
		$.when(ajax1,ajax2).done(function(lData, lSpec){
			
			myData = lData[0];
			mySpec = lSpec[0];
			
			$.when(ajax4(mySpec.evolution_chain.url)).done(function(lEvo){
				console.log(lEvo);
				pokeMon.evolutions.push({name : lEvo.chain.species.name, min_level : 0});
				
				if(lEvo.chain.evolves_to.length > 0){
					for(z=0;z<lEvo.chain.evolves_to.length;z++){
						if(lEvo.chain.evolves_to.length > 0 && typeof lEvo.chain.evolves_to !== undefined){
							if(lEvo.chain.evolves_to[z].evolves_to.length > 0 && typeof lEvo.chain.evolves_to[z].evolves_to !== undefined){
								if(lEvo.chain.evolves_to[z].evolves_to[0].evolves_to.length > 0 && typeof lEvo.chain.evolves_to[z].evolves_to[0].evolves_to !== undefined){
									pokeMon.evolutions.push({name : lEvo.chain.evolves_to[z].evolves_to[0].evolves_to[0].species.name,
										min_level : lEvo.chain.evolves_to[z].evolves_to[0].evolves_to[0].evoltion_details[0].min_level});
								}
								pokeMon.evolutions.push({name : lEvo.chain.evolves_to[z].evolves_to[0].species.name,
									min_level : lEvo.chain.evolves_to[z].evolves_to[0].evolution_details[0].min_level});
							 }
							pokeMon.evolutions.push({name : lEvo.chain.evolves_to[z].species.name,
								min_level : lEvo.chain.evolves_to[z].evolution_details[0].min_level});
						 }
					 }
				} else {
					if(lEvo.chain.evolves_to.length > 0 && typeof lEvo.chain.evolves_to !== undefined){
						if(lEvo.chain.evolves_to[0].evolves_to.length > 0 && typeof lEvo.chain.evolves_to[0].evolves_to !== undefined){
							if(lEvo.chain.evolves_to[0].evolves_to[0].evolves_to.length > 0 && typeof lEvo.chain.evolves_to[0].evolves_to[0].evolves_to !== undefined){
								pokeMon.evolutions.push({name : lEvo.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name,
									min_level : lEvo.chain.evolves_to[0].evolves_to[0].evolves_to[0].evoltion_details[0].min_level});
							}
							pokeMon.evolutions.push({name : lEvo.chain.evolves_to[0].evolves_to[0].species.name,
								min_level : lEvo.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level});
						 }
						pokeMon.evolutions.push({name : lEvo.chain.evolves_to[0].species.name,
							min_level : lEvo.chain.evolves_to[0].evolution_details[0].min_level});
					 }
				}
				
				pokeMon.evolutions.sort(function (a,b){
					return a.min_level - b.min_level;
				});
				
				
				//Name
				pokeMon.name = myData.name;
				
				//Types
				for(i=0;i<myData.types.length;i++){
					pokeMon.types[i] = myData.types[i].type.name;
				}
				
				//Sprite
				
				var img = new Image();
				img.src = myData.sprites.front_default;
				pokeMon.sprite = img;
				
				//Stats
				for(j=0;j<myData.stats.length;j++){
					var thisOb = {name : myData.stats[j].stat.name, value : myData.stats[j].base_stat}
					pokeMon.baseStats[j] = thisOb;
				}
				
				//Abilities
				for(k=0;k<myData.abilities.length;k++){
					pokeMon.abilities[k] = myData.abilities[k].ability.name;
	/*					For battle
						pokeMon.abilities[k , 1] = data.abilities[k].ability.url;
	*/				}
				
				//Moves
				for(l=0;l<myData.moves.length;l++){
					pokeMon.moves[l] = {name : myData.moves[l].move.name,
							learn_method : myData.moves[l].version_group_details[0].move_learn_method.name,
							level_learned : myData.moves[l].version_group_details[0].level_learned_at
							};
	/*					For battle
						pokeMon.moves[l, 1] = data.moves[l].move.url;
	*/				}
				
				//Sort moves by level learned
				pokeMon.moves.sort(function (a,b){
					return b.level_learned - a.level_learned;
				});
				
				//Games
				for(m=0;m<myData.game_indices.length;m++){
					pokeMon.games[m] = myData.game_indices[m].version.name;
				}
				
				//Pokedex Index
				pokeMon.pokeindex = mySpec.pokedex_numbers[mySpec.pokedex_numbers.length-1].entry_number;
	
				//Type Relations
				for(o=0;o<pokeMon.types.length;o++){
					$.when(ajax3(o, pokeMon.types)).done(function(myRel){
						for(v=0;v<myRel.damage_relations.double_damage_from.length;v++){
							if(pokeMon.types[o] === "flying"){
								if(myRel.damage_relations.double_damage_from[v].name !== "ground"){
									pokeMon.relations.double_from.push(myRel.damage_relations.double_damage_from[v].name);
								}
								
								if($.inArray("ground", double_from)){
									pokeMon.relations.double_from.splice(pokeMon.relations.double_from.indexOf("ground"),1);
								}
								
								if(!$.inArray("ground", null_from)){
									pokeMon.relations.null_from.push("ground");
								}
							} else {
								pokeMon.relations.double_from.push(myRel.damage_relations.double_damage_from[v].name);
							}
						}
						
	/*					for(q=0;q<myRel.damage_relations.double_damage_to.length;q++){
							double_to.push(myRel.damage_relations.double_damage_to[q].name);
						}
	*/					
						for(w=0;w<myRel.damage_relations.half_damage_from.length;w++){
							if(pokeMon.types[o] === "flying"){
								if(myRel.damage_relations.half_damage_from[w].name !== "ground"){
									pokeMon.relations.half_from.push(myRel.damage_relations.half_damage_from[w].name);
								}
								
								if($.inArray("ground", half_from)){
									pokeMon.relations.half_from.splice(pokeMon.relations.half_from.indexOf("ground"),1);
								}
								
								if(!$.inArray("ground", null_from)){
									pokeMon.relations.null_from.push("ground");
								}
							} else {
								pokeMon.relations.half_from.push(myRel.damage_relations.half_damage_from[w].name);
							}
						}
						
	/*					for(e=0;e<myRel.damage_relations.half_damage_to.length;e++){
							half_to.push(myRel.damage_relations.half_damage_to[e].name);
						}
	*/					
						for(r=0;r<myRel.damage_relations.no_damage_from.length;r++){
							pokeMon.relations.null_from.push(myRel.damage_relations.no_damage_from[r].name);
						}
						
	/*					for(y=0;y<myRel.damage_relations.no_damage_to.length;y++){
							null_to.push(myRel.damage_relations.no_damage_to[y].name);
						}
	*/					
						counter += 1;
						if (counter === pokeMon.types.length){
							adjust();
						}
					});
				}
			});
		})
	}
});


function adjust(){
	var localMon = pokeMon;
	
	function fixRels(arr1, arr2, into){
		for(x=0;x<arr1.length;x++){
			for(y=0;y<arr2.length;y++){
				if(into === undefined){
					if(arr1[x] === arr2[y]){
						arr2.splice(y, 1);	
					}
				}else if (into === null){
					if(arr1[x] === arr2[y]){
						arr1.splice(x, 1);
						arr2.splice(y, 1);
						fixRels(arr1,arr2,null);
					}
				}else if (into !== null & into !== undefined){
					if(x !== y){
						if(arr1[x] === arr2[y]){
							into.push(arr1[x]);
							arr2.splice(y, 1);
							arr1.splice(x, 1);
						}
					}
				}
			}
		}
	}
	
	fixRels(localMon.relations.double_from, localMon.relations.half_from, null);
	fixRels(localMon.relations.double_from, localMon.relations.double_from, localMon.relations.quad_from);
	fixRels(localMon.relations.half_from, localMon.relations.half_from, localMon.relations.quarter_from);
	fixRels(localMon.relations.double_from, localMon.relations.null_from, localMon.relations.half_from);
	fixRels(localMon.relations.null_from, localMon.relations.half_from);
	pokeMon = localMon;
	
	var found = false;
	
	for(d=0;d<localPokes.length;d++){
		if(localPokes[d].name === pokeMon.name){
			found = true;
		}
	}
	
	if(!found){
		localPokes.push(pokeMon);
	}
	
	setTimeout(displayMethod(),1000);
}


function displayMethod(){
	
	var image = document.getElementById("sprite");
	image.parentNode.removeChild(image);
	
	if(document.getElementsByClassName("clearMe").innerHTML !== ""){
		$(".clearMe").html('');
	}
	
	function relationLooper(arr1,arr2,arr3,arr4,arr5){
		
		var headers = ["No Damage From",
			"1/4 Damage From",
			"1/2 Damage From",
			"2x Damage From",
			"4x Damage From"];
		
		var table = $("<table class = 'table table-condensed table-responsive' />");
		table[0].border = '1';
		
		var header = $("<thead />");
		table.append(header);
		
		var body = $("<tbody />");
		table.append(body);
		
		var row = $(table[0].tHead.insertRow(0));
		
		for(y=0;y<5;y++){
			var headerCell = $("<th />");
			headerCell.html(headers[y]);
			row.append(headerCell);
		}
		
		var len = Math.max(arr1.length,arr2.length,arr3.length,arr4.length,arr5.length);
		
		for(r=0;r<len;r++){
			//MAKE THIS A LIST LOOPER
			var row2 = $(table[0].tBodies[0].insertRow(r));
			if(arr1[r] !== undefined && arr1[r] !== null){
				var cell = $("<td />");
				cell.html(arr1[r]);
				row2.append(cell);
			} else {
				var cell = $("<td />");
				cell.html(" ");
				row2.append(cell);
			}
			
			if(arr2[r] !== undefined && arr2[r] !== null){
				var cell = $("<td />");
				cell.html(arr2[r]);
				row2.append(cell);
			} else {
				var cell = $("<td />");
				cell.html(" ");
				row2.append(cell);
			}
			
			if(arr3[r] !== undefined && arr3[r] !== null){
				var cell = $("<td />");
				cell.html(arr3[r]);
				row2.append(cell);
			} else {
				var cell = $("<td />");
				cell.html(" ");
				row2.append(cell);
			}
			
			if(arr4[r] !== undefined && arr4[r] !== null){
				var cell = $("<td />");
				cell.html(arr4[r]);
				row2.append(cell);
			} else {
				var cell = $("<td />");
				cell.html(" ");
				row2.append(cell);
			}
			
			if(arr5[r] !== undefined && arr5[r] !== null){
				var cell = $("<td />");
				cell.html(arr5[r]);
				row2.append(cell);
			} else {
				var cell = $("<td />");
				cell.html(" ");
				row2.append(cell);
			}
			
			var myTable = $("#relations_from");
			myTable.html("");
			myTable.append("<h2 class = 'col-sm-12'>Damage Relations</h2>");
			myTable.append(table);
		}
	}
	
	function statLooper(arr1){
		
		var table = $("<table class = 'table table-condensed table-responsive' />");
		table[0].border = '1';
		
		var header = $("<thead />");
		table.append(header);
		
		var body = $("<tbody />");
		table.append(body);
		
		var row = $(table[0].tHead.insertRow(0));
		
		for(y=0;y<arr1.length;y++){
			var headerCell = $("<th />");
			headerCell.html(pokeMon.baseStats[y].name);
			row.append(headerCell);
		}
		
		var row2 = $(table[0].tBodies[0].insertRow(0));
		
		for(s=0;s<arr1.length;s++){
			var cell = $("<td />");
			cell.html(pokeMon.baseStats[s].value);
			row2.append(cell);
		}
		
		var myTable = $("#base_stats");
		myTable.html("");
		myTable.append("<h2 class = 'col-sm-12'>Base Stats</h2>");
		myTable.append(table);
	}
	
	function moveLooper(arr1){
		var table = $("<table class = 'table table-condensed table-responsive' id = 'countTable' />");
		table[0].border = '1';
		
		var header = $("<thead />");
		table.append(header);
		
		var body = $("<tbody />");
		table.append(body);
		
		var headers = ["Name","Learned By","Level"];
		
		var row = $(table[0].tHead.insertRow(0));
		
		for(y=0;y<3;y++){
			var headerCell = $("<th />");
			headerCell.html(headers[y]);
			row.append(headerCell);
		}
		
		for(s=0;s<arr1.length;s++){
			var row2 = $(table[0].tBodies[0].insertRow(s));
			var cell1 = $("<td />");
			var cell2 = $("<td />");
			var cell3 = $("<td />");
			cell1.html(arr1[s].name);
			cell2.html(arr1[s].learn_method);
			cell3.html(arr1[s].level_learned);
			row2.append(cell1);
			row2.append(cell2);
			row2.append(cell3);
		}
		
		var myTable = $("#moves");
		myTable.html("");
		myTable.append("<h2 class = 'col-sm-12'>Moves</h2>");
		myTable.append(table);
	}
	
	$("#poke_name").append("<h2 class = 'capital'>" + pokeMon.name + "</h2>");
	
	$("#pokedex_index").append("<p class = 'capital'>National Pokedex Index: " + pokeMon.pokeindex + "</p>");
	
	if(pokeMon.types.length > 1){
		$("#poke_types").append("<p class = 'capital'>Types : " + pokeMon.types[0] + " ~ " + pokeMon.types[1] + "</p>");
	} else {
		$("#poke_types").append("<p class = 'capital'>Type : " + pokeMon.types[0] + "</p>");
	}
	
	$("#poke_sprite").append("<p class = 'image' id = 'sprite'></p>");
	
	$("#sprite").append(pokeMon.sprite);
	
	relationLooper(pokeMon.relations.null_from,pokeMon.relations.quarter_from,
			pokeMon.relations.half_from,pokeMon.relations.double_from,
			pokeMon.relations.quad_from);
	
	statLooper(pokeMon.baseStats);
	
	$("#abilities").append("<h2 class = 'col-sm-12'>Abilities</h2>");
	for(a=0;a<pokeMon.abilities.length;a++){
		$("#abilities").append("<p class = 'capital col-sm-2'>" + pokeMon.abilities[a] + "</p>");
	}
	
	moveLooper(pokeMon.moves);

	for(g=0;g<pokeMon.games.length;g++){
		$("#generations").append("<p class = 'capital'>Seen in: " + pokeMon.games[g] + "</p>");
	}
	
	$("#evolutions").append("<h2 class = 'capital container'>Evolution Chain</h2>");
	for(e=0;e<pokeMon.evolutions.length;e++){
		$("#evolutions").append("<p class = 'capital'>" + pokeMon.evolutions[e].name + " ~ min level to evolve: " + pokeMon.evolutions[e].min_level + "</p>");
	}
	
	$('.capital').each(function(){
	    var string = $(this).text().split(' ');
	    var result = "";
	    for (var x=0; x<string.length; x++)
	        result+=string[x].substring(0,1).toUpperCase()+string[x].substring(1)+' ';
	    $(this).text(result.substring(0, result.length-1));
	});
	
	$('#countTable').dataTable({
		"ordering" : false,
		buttons : {
			id: 'example_paginate',
			className : 'paging_simple_numbers'
		}
	});
}

$(document).ready(function(){
	//DOM is ready
	
	$("#submitButton").click(function(){
		
		var initInput = $("#userInput").val();
		initInput = initInput.toString();
		var input = initInput.toLowerCase();
		
		getPoke(input);
	});
});
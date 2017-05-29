const foodApp = {};

foodApp.init = function() {
	foodApp.packery();
	foodApp.getRecipes();
	foodApp.popUp();
	foodApp.searchBox();
	foodApp.buttonUp();
}

foodApp.packery = function(){
	var $grid = $('.grid').packery({
		  itemSelector: '.grid-item',
		  stagger: 30,
		  percentPosition: true,
		});

	$grid.on( 'click', '.grid-item', function(event) {
		// change size of item by toggling large class
		$(event.currentTarget).toggleClass('grid-item--large');
		// trigger layout after item size changes
		$grid.packery('layout');
	});
};


foodApp.getRecipes = function(query){
	$.ajax({
		url: "http://api.yummly.com/v1/api/recipes?_app_id=ccf55414&_app_key=f481d434dd10db31f2601b7ed3107869",
		method: "GET",
		dataType: "JSONP",
		data:{
			q: query,
			requirePicture: 'true',
		}
	}).then(function(res){
		var matches = res.matches;
		console.log(matches);
		foodApp.fixedUrl(matches);

		$('.grid-item').empty();
		$('.searchbox-input').val("");

		if (matches.length === 0){

			swal("No result", "Try another ingredient!");

		} else{
			for (var i = 0; i < matches.length; i++) {
				$(`.grid-item:nth-child(${i})`).prepend(`<h2>${matches[i].recipeName}</h2>`);

				var time = matches[i].totalTimeInSeconds/60;

				if (time > 180){
					$(`.grid-item:nth-child(${i})`).append('<p>3+ hours</p>');
				} else {
					$(`.grid-item:nth-child(${i})`).append(`<p>${time} mins</p>`);	
				};
				
				if (matches[i].rating === 5){
						$(`.grid-item:nth-child(${i})`).append('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
					} else if (matches[i].rating === 4){
						$(`.grid-item:nth-child(${i})`).append('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
					} else if (matches[i].rating === 3){
						$(`.grid-item:nth-child(${i})`).append('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
					} else if (matches[i].rating === 2){
						$(`.grid-item:nth-child(${i})`).append('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
					} else 
						$(`.grid-item:nth-child(${i})`).append('<i class="fa fa-star" aria-hidden="true"></i>');

				$(`.grid-item:nth-child(${i})`).css('background', `linear-gradient(rgba(0, 0, 0, 0.25),rgba(0, 0, 0, 0.8)), url(${matches[i].smallImageUrls}) no-repeat center/cover`);
				
				$(`.grid-item:nth-child(${i})`).append('<ul>');
				
				for (var j = 0; j < matches[i].ingredients.length; j++){
					$(`.grid-item:nth-child(${i}) ul`).append(`<li>${matches[i].ingredients[j]}</li>`);
				}
			}
		}
	});
}

foodApp.fixedUrl = function(match){
	match.forEach(function(obj){
		obj.smallImageUrls = obj.smallImageUrls.toString().replace('=s90', '')
	})
}

foodApp.popUp = function(){
	swal({
	  title: "Create from scratch",
	  imageUrl: "assets/logo.png",
	  imageSize: "250x100",
	  type: "input",
	  // showCancelButton: "true",
	  closeOnConfirm: "false",
	  animation: "slide-from-top",
	  inputPlaceholder: "Search your ingredients"
	},
	function(inputValue){
	  if (inputValue.length > 2) {
	  	foodApp.getRecipes(inputValue)
	  	$('.grid').css('visibility', 'visible');
	  	return false;
	  }
	  if (inputValue.length <= 1 ) {
	    swal.showInputError("You need to write something!");
	    return false
	  }
	})
}

foodApp.searchBox = function() {
	var submitIcon = $('.searchbox-icon');
	var inputBox = $('.searchbox-input');
	var searchBox = $('.searchbox');
	var isOpen = false;
	submitIcon.click(function(){
	    if(isOpen == false){
	        searchBox.addClass('searchbox-open');
	        inputBox.focus();
	        isOpen = true;
	    } else {
	        searchBox.removeClass('searchbox-open');
	        inputBox.focusout();
	        isOpen = false;
	    }
	});  
	 submitIcon.mouseup(function(){
	        return false;
	    });
	searchBox.mouseup(function(){
	        return false;
	    });
	$(document).mouseup(function(){
	        if(isOpen == true){
	            $('.searchbox-icon').css('display','block');
	            submitIcon.click();
	        }
	    });

	$('.searchbox').on('submit', function(e){
		e.preventDefault();
		var usersChoice = $('.searchbox-input').val();
		foodApp.getRecipes(usersChoice);
	});
}

foodApp.buttonUp = function(){
	var inputVal = $('.searchbox-input').val();
	inputVal = $.trim(inputVal).length;
	if( inputVal !== 0){
	    $('.searchbox-icon').css('display','none');
	} else {
	    $('.searchbox-input').val('');
	    $('.searchbox-icon').css('display','block');
	}		
}

$(function(){
	foodApp.init();
});










//************************************************ Accordion	**********************************************

$('.accordion_one').on('click', '.accordion-control', function(e) {
	
	e.preventDefault();
	$(this)
		.next('.accordion-panel')
		.not(':animated')
		.slideToggle()
		;

});

//************************************************ Panel kart	*************************************************

$('.tab-list').on('click', '.tab-control', function(e) {

	e.preventDefault();
	
	let $this = $(this);
	let activeTab = $('.tab-list li.active');
	let id = $this.attr('href');
	
	if(id && !$this.is('.active')) {
		let $panel = $('.tab-panel.active');
		
		activeTab.removeClass('active');
		$panel.removeClass('active');
		
		activeTab = $this.parent();
		activeTab.addClass('active');
		
		$panel = $('#' + id).addClass('active');
		
		//alert($panel.text());
	}
});


//********************************************* Przeglądarka zdjęć	*****************************************************

// wersja light
/*
$('#thumbnails').on('click', 'a', function(e) {

	e.preventDefault();
	
	let photoViewer = $('#photo_viewer');
	let $this = $(this);
	let picture = $this.attr('href');
	let alt_text = $this.attr('alt');
	let content = $('<img src="' + picture + '" alt="' + alt_text + '" />');
	
	photoViewer.html('');
	photoViewer.append(content);
	
	$('.thumb_active').removeClass('thumb_active');
	$this.addClass('thumb_active');
}); */

// wersja  pro, tzn. z asynchronicznym wczytywaniem i buforowaniem obrazów

(function() {

	var request, $current;		//odniesienia do aktualnego oraz ostatnio żądanego obrazu
	var $frame = $('#photo_viewer');		//kontenery dla obrazu i miniatur
	var $thumbs = $('.thumb');
	var cache = {									//obiekt będący odpowiednikiem pamięci podręcznej, gdzie przechowujemy wszystkie obrazki z "galerii"
		
		//"1.jpg": {"$img": null, "isLoading": false},
		//"2.jpg": {"$img": null, "isLoading": false},
		//"wallpaper.jpg": {"$img": null, "isLoading": false},
		//"planet.jpg": {"$img": null, "isLoading": false}
		
	};

	
	function crossfade($img) {					//funkcja realizuje przejścia między obrazami
		
		if($current) {
			$current.stop().fadeOut('slow');
		}
		
		$img.stop().fadeTo('slow', 1);
		
		$current = $img;
	}
	
	$('#thumbnails').on('click', 'a', function(e) {
		
		e.preventDefault();
		
		var $img;
		var src = this.href;
		var src_relative = src.split('/').pop();
		request = src;
		
		$thumbs.removeClass('thumb_active');
		$(this).addClass('thumb_active');
		
		if (cache.hasOwnProperty(src_relative)) {
			if (cache[src_relative].isLoading === false) {
				crossfade(cache[src_relative].$img);
			}
		}
		else {
			$img = $('<img />');
			cache[src_relative] = {
				$img: $img,
				isLoading: true
			};
				
			$img.on('load', function() {											//kiedy obraz zostanie wczytany
				
				$img.hide();																	//nieży najpierw go ukryć
				window.setTimeout(function() {
					$frame.removeClass('is_loading').append($img);		//potem usunąć z kontenera klasę is_loading oraz wrzucić tam nowy obraz
					}, 1500);
				cache[src_relative].isLoading = false;							// onaczenie końca wczytywania
				if(request === src) crossfade($img);
			});	
			
			$frame.addClass('is_loading');
			
			$img.attr({
				'src': src,
				'alt': this.title
			});
		}
	});
}());


//********************************************* SLAJDY	*****************************************************

(function() {
	
	var $slider = $('.slide_viewer');
	var $group = $slider.find('.slide_group');
	
	var $slides = $slider.find('.slide');
	var buttonArray = [];
	var currentIndex = 0;
	var timeout;
	
	function advance() {
	
		clearTimeout(timeout);
		timeout = setTimeout(function() {
	
			if(currentIndex < ($slides.length-1)) {
				move(currentIndex + 1);
			}
			
			else {move(0);}
	
		}, 3000);
			
	}
	
	function move(newIndex) {
	
		var animateLeft, slideLeft;
		
		advance();
		
		if ($group.is(':animated') || currentIndex === newIndex ) {return;}		//jeżeli mamy animację w trakcie albo bieżący slajd, to się nie dzieje
		
		buttonArray[currentIndex].removeClass('slide_button_active');
		buttonArray[newIndex].addClass('slide_button_active');
		
		if(newIndex > currentIndex) {
			slideLeft = '100%';							//jeżeli newIndex jest większy od bieżącego, to nowy slajd będzie umiejscowiony po prawej stronie
			animateLeft = '-100%';					//i będzie przesuwał się w lewo
		} else {
			slideLeft = '-100%';
			animateLeft = '100%';
		}
		
		$slides.eq(newIndex).css({
			'left': slideLeft,							//nowy slajd przesuwa się poza krawędź kontenera
			'display': 'block'							//w tym miejscu staje się widoczny (ale nadal poza krawędzią kontenera)
		});
		
		$group.animate(							//przesuwasz tutaj cały kontener ze slajdami, a nie same slajdy bezpośrednio;
			{left: animateLeft},					//to konieczne, bo slajdy mają position: absolute (żeby wyciąć je z rozkładu normalnego)
			'slow',
			'swing',
			function() {
				$slides.eq(currentIndex).css({'display': 'none'});		//stary slajd staje się niewidoczny
				$slides.eq(newIndex).css({'left': 0});							//ustawiamy nowy slajd na pozycji zerowej względem kontenera
				$group.css({'left': 0});											//kontener wraca na swoje miejsce
				
				currentIndex = newIndex;
			}
		)
	
	}
	
	//dodawanie buttonów + obsługa zdarzeń
	$.each($slides, function(index) {
	
		var $button = $('<button type="button" class="slide_button">&#x25CF</button>');
		
		if(index === currentIndex) {
			$button.addClass('slide_button_active');
		}
		
		$button.on('click', function() {
		
			move(index);
		
		}).appendTo('.slide_buttons');
		buttonArray.push($button);
	
	});
	
	advance();
	
}());

//********************************************* WTYCZKA ACCORDION	*****************************************************

(function($) {

	$.fn.accordion = function(speed) {
		
		$(this).on('click', '.accordion-control', function(e) {
		
			e.preventDefault();
			$(this)
				.next('.accordion-panel')
				.not(':animated')
				.slideToggle(speed)
				;
		});
		
		return this;
	}

}(jQuery));


$('.accordion_two').accordion(500);
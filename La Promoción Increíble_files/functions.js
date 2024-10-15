var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

$(document).ready(function() {
	jQuery(window).scroll(function() {
		var $cog = $('.container.logor'),
				$body = $(document.body),
				bodyHeight = $body.height();
		$cog.css({
			'transform': 'rotate(' + (jQuery(window).scrollTop() / bodyHeight * 360) + 'deg)'
		});
	});

	$('#myCarousel').carousel({
		interval: 4000
	})

	$('#myCarousel.carousel .item').each(function() {
		var next = $(this).next();
		if (!next.length) {
			next = $(this).siblings(':first');
		}
		next.children(':first-child').clone().appendTo($(this));

		for (var i = 0;
				i < 1;
				i++) {
			next = next.next();
			if (!next.length) {
				next = $(this).siblings(':first');
			}

			next.children(':first-child').clone().appendTo($(this));
		}
	});

	$('.windowed').click(function(event) {
		var width = 575,
				height = 400,
				left = ($(window).width() - width) / 2,
				top = ($(window).height() - height) / 2,
				url = this.href,
				opts = 'status=1' +
				',width=' + width +
				',height=' + height +
				',top=' + top +
				',left=' + left;

		window.open(url, 'windowed', opts);

		return false;
	});
	$('.sprite_2').click(function(event) {
		$('#carouselLlamadas').fadeOut();
		$('.sprite_2').removeClass('active');
		$(this).addClass('active');
	});
	$('.android, .apple').click(function(event) {
		$('#carouselFijo').fadeOut();
		$('#carouselMobile, .btnMobile').fadeIn();
		$('#carouselMobile, .btnMobile').carousel(0);
	});
	$('.telefono').click(function(event) {
		$('#carouselMobile, .btnMobile').fadeOut();
		$('#carouselFijo').fadeIn();
		$('#carouselFijo').carousel(0);
	});
	$('.android').click(function(event) {
		$('.appstore_button').hide();
		$('.googleplay_button').show();
	});
	$('.apple').click(function(event) {
		$('.googleplay_button').hide();
		$('.appstore_button').show();
	});

	$('#autocomplete').autocomplete({
		lookup: cities,
		autoSelectFirst: true,
		onSelect: function(suggestion) {
			var thehtml = '<br><p class="two"> Marca al número <span>' + suggestion.data + '</span> cada que desees llamar y sigue las instrucciones de la operadora virtual.</p>';
			$('#outputcontent').html(thehtml);
			$('#carouselFijo').carousel(1);
			$('#autocomplete').val('');
		}
	});
});

var cities = [
	{
		value: 'Mexico D.F., Mexico D.F',
		data: '1204-0358'
	},
	{
		value: 'Monterrey, Nuevo Leon',
		data: '1107-0006'
	},
	{
		value: 'Guadalajara, Guadalajara',
		data: '1031-0936'
	},
	{
		value: 'Hermosillo, Sonora',
		data: '800-1076'
	},
	{
		value: 'Tijuana, Baja California',
		data: '231-7700'
	},
	{
		value: 'Cd. Juarez, Chihuahua',
		data: '139-2397'
	},
	{
		value: 'Cuernavaca, Morelos',
		data: '150-4475'
	},
	{
		value: 'Mazatlan, Sinaloa',
		data: '200-4628'
	},
	{
		value: 'Nogales, Sonora',
		data: '151-2624'
	},
	{
		value: 'Culiacan, Sinaloa',
		data: '454-2585'
	},
	{
		value: 'Toluca, Estado de Mexico',
		data: '268-4142'
	},
	{
		value: 'Veracruz, Veracruz',
		data: '272-7068'
	},
	{
		value: 'Merida, Yucatán',
		data: '801-1073'
	},
	{
		value: 'Aguascalientes, Aguascalientes',
		data: '131-2087'
	},
	{
		value: 'Cd. Acuña, Tamaulipas',
		data: '125-3006'
	},
	{
		value: 'Cd. Victoria, Tamaulipas',
		data: '183-4608'
	},
	{
		value: 'Celaya, Guanajuato',
		data: '213-8096'
	},
	{
		value: 'Chihuahua, Chihuahua',
		data: '291-5987'
	},
	{
		value: 'Durango, Durango',
		data: '202-4554'
	},
	{
		value: 'Guanajuato, Guanajuato',
		data: '130-3736'
	},
	{
		value: 'Guaymas, Sonora',
		data: '137-6109'
	},
	{
		value: 'Irapuato, Guanajuato',
		data: '172-5138'
	},
	{
		value: 'Leon, Guanajuato',
		data: '170-3423'
	},
	{
		value: 'Matamoros, Tamaulipas',
		data: '212-4506'
	},
	{
		value: 'Morelia, Michoacán',
		data: '291-5001'
	},
	{
		value: 'Nuevo Laredo, Tamaulipas',
		data: '195-4648'
	},
	{
		value: 'Pachuca, Hidalgo',
		data: '778-3311'
	},
	{
		value: 'Piedras Negras, Tamaulipas',
		data: '131-3241'
	},
	{
		value: 'Puebla, Puebla',
		data: '647-7315'
	},
	{
		value: 'Queretaro, Queretaro',
		data: '161-1542'
	},
	{
		value: 'Reynosa, Tamaulipas',
		data: '280-7034'
	},
	{
		value: 'Saltillo, Coahuila',
		data: '249-5816'
	},
	{
		value: 'San Luis Potosi, San Luis Potosi',
		data: '258-8241'
	},
	{
		value: 'Tampico, Tamaulipas',
		data: '361-5509'
	},
	{
		value: 'Tepic, Nayarit',
		data: '171-6116'
	},
	{
		value: 'Torreon, Coahuila',
		data: '293-8608'
	},
	{
		value: 'Zacatecas, Zacatecas',
		data: '157-3215'
	},
	{
		value: 'Cancun, Quinta Roo',
		data: '800-1087'
	},
	{
		value: 'Xalapa, Veracruz',
		data: '201-5999'
	},
	{
		value: 'Acapulco, Guerrero',
		data: '250-1013'
	},
	{
		value: 'Mexicali, Baja California',
		data: '159-1012'
	}
];
var json_cities = JSON.stringify(cities);
var NoResultsLabel = '<br><p class="two"> Marca al número <span> 01-800-269-4419 </span> cada que desees llamar y sigue las instrucciones de la operadora virtual. </p>';
function checkInfo() {
	if (json_cities.match(document.getElementById('autocomplete').value)) {
		$('#carouselFijo').carousel(1);
		document.getElementById('autocomplete').value = "";
	} else {
		$('#outputcontent').html(NoResultsLabel);
		$('#carouselFijo').carousel(1);
	}
	return false;
}


}
/*
     FILE ARCHIVED ON 14:56:03 Dec 16, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 19:46:13 Jan 22, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 428.965
  exclusion.robots: 0.108
  exclusion.robots.policy: 0.095
  cdx.remote: 0.086
  esindex: 0.012
  LoadShardBlock: 380.35 (3)
  PetaboxLoader3.datanode: 313.328 (4)
  load_resource: 74.159
  PetaboxLoader3.resolve: 30.717
*/
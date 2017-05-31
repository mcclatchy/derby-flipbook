var targetModel = 1;
var currentModel = 0;
var loopLength;


/***************************************************************************
Gets model playlist
***************************************************************************/

$('#dia-turntable').turntable();
$('#nicole-turntable').turntable();
$('#clark-turntable').turntable();
$('#scott-turntable').turntable();
$('#dianet-turntable').turntable();
$('#kristen-turntable').turntable();
$('#mary-turntable').turntable();
$('#sally-turntable').turntable();
$('#vicki-turntable').turntable();

/* Every time the window is scrolled ... */
// $(window).scroll( function(){
//
//     /* Check the location of each desired element */
//     $('.hc-card:not(:first)').each(function(i){
//
//         var bottom_of_object = $(this).offset().top + $(this).outerHeight();
//         var bottom_of_window = $(window).scrollTop() + $(window).height() + 800;
//
//         var turntableId = $(this).find(".turntable").attr('id');
//
//         /* If the object is completely visible in the window, fade it in */
//         if (bottom_of_window > bottom_of_object) {
//             if ($('#' + turntableId + ' ul li.hc-end').length === 0) {
//
//
//                 var name = $(this).data('card');
//                 // var imgNum = new Array(23);//create a 45 element array
//
//                 for(var iNum=23; iNum>1; iNum--){
//                   $('#' + turntableId + ' ul').append('<li class="hc-end" data-img-src="static/assets/images/' + name + '/' + name + '-' + (iNum - 1) + '.jpg">');
//                 }
//                 $('#' + turntableId + ' ul').append('<li class="hc-end" data-img-src="static/assets/images/' + name + '/' + name + '-' + 23 + '.jpg">');
//
//                 $('#' + turntableId).turntable();
//             }
//         }
//     });
// });

$('.subtitles-btn').click(function() {
    if ($(this).hasClass('subtitles-off')) {
        $(this).removeClass('subtitles-off');
        $(this).addClass('subtitles-on');

        $('.playBtn').click(function() {
            if ($('.subtitles-btn').hasClass('subtitles-on')) {
                $('.subtitles').show();
            } else {
                $('.subtitles').hide();
            }
        });
    } else {
        $(this).removeClass('subtitles-on');
        $(this).addClass('subtitles-off');
        $('.subtitles').hide();
    }
});

$('.hc-card').hover(function() {
    $('.hover-icon, .hover-wrapper').fadeOut(1000);
    $('.title').delay(800).fadeIn(1000);
});

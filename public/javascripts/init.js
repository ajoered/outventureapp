$(document).ready(function(){
  $('.button-collapse').sideNav();
  $('select').material_select();
  $('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false, // Displays dropdown below the button
    alignment: 'right', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false // Stops event propagation
  }
);

  scaleVideoContainer();

  initBannerVideoSize('.video-container .poster img');
  initBannerVideoSize('.video-container .filter');
  initBannerVideoSize('.video-container video');

  $(window).on('resize', function() {
      scaleVideoContainer();
      scaleBannerVideoSize('.video-container .poster img');
      scaleBannerVideoSize('.video-container .filter');
      scaleBannerVideoSize('.video-container video');
  });

  initMap();
  checkScroll();
  scrollMagic();
});

function checkScroll(){
    var startY = $('.nav-wrapper-landing').height() * 1; //The point where the nav-wrapper changes in px

    if($(window).scrollTop() > startY){
        $('.nav-wrapper-landing').addClass("scrolled");
        document.getElementById("nav-landing-logo").src="https://res.cloudinary.com/dx1s7kdgz/image/upload/v1495057462/compundBlack_mlkuff.png";
    }else{
        $('.nav-wrapper-landing').removeClass("scrolled");
        document.getElementById("nav-landing-logo").src="https://res.cloudinary.com/dx1s7kdgz/image/upload/v1494986580/outventure_white-01_gofmj3.png";
    }
}

if($('.nav-wrapper-landing').length > 0){
    $(window).on("scroll load resize", function(){
        checkScroll();
    });
}

function scaleVideoContainer() {

    var height = $(window).height() + 5;
    var unitHeight = parseInt(height) + 'px';
    $('.homepage-hero-module').css('height',unitHeight);

}

function initBannerVideoSize(element){

    $(element).each(function(){
        $(this).data('height', $(this).height());
        $(this).data('width', $(this).width());
    });

    scaleBannerVideoSize(element);

}

function scaleBannerVideoSize(element){

    var windowWidth = $(window).width(),
    windowHeight = $(window).height() + 5,
    videoWidth,
    videoHeight;

    // console.log(windowHeight);

    $(element).each(function(){
        var videoAspectRatio = $(this).data('height')/$(this).data('width');

        $(this).width(windowWidth);

        if(windowWidth < 1000){
            videoHeight = windowHeight;
            videoWidth = videoHeight / videoAspectRatio;
            $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});

            $(this).width(videoWidth).height(videoHeight);
        }

        $('.homepage-hero-module .video-container video').addClass('fadeIn animated');

    });
}

// var text = ["happy", "healthy", "mindful", "fit"];
// var counter = 0;
// var elem = document.getElementById("text-change");
// setInterval(change, 1500);
// function change() {
//  elem.innerHTML = text[counter];
//     counter++;
//     if(counter >= text.length) { counter = 0; }
// }

function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

function scrollMagic() {
  var controller = new ScrollMagic.Controller();

  var sceneSearchNav = new ScrollMagic.Scene({triggerElement: "#search-nav"})
        .setPin("#search-nav")
        .addTo(controller);

  var offset = sceneSearchNav.offset();
  sceneSearchNav.offset(286);

  var mapFix =  new ScrollMagic.Scene({
      triggerElement: ".listings-wrapper",
      triggerHook: "onLeave",
      duration: 0
  }).setClassToggle(".map-container", "fixed").addTo(controller);


}

function readURL(input,output) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(output).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#file-image").change(function(){
    $(".file-input-holder").show();
    readURL(this,"#preview-image");
});

$(".picture-pub-in").click(function(){
  $("#file-image").click();
});

$(".youtube-video-in i").click(function(){
  $(".youtube-input-popup").fadeToggle(100);
});

$(".yt-in-url").change(function(){
  if ($(this).val().length < 5) {
    $(".youtube-preview").html("");
    return;
  };
  try{
    var code = $(this).val();
    var video = "";
    var a = code.split("?");
    var b = a[1];
    var c = b.split("&");
    for( var i=0 ; i<c.length; i++){
      var d = c[i].split("=");
      if (d[0] == "v") {
        video = d[1];
        break;
      };
    }
    $(".youtube-preview").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+video+'" frameborder="0" allowfullscreen></iframe>')
  }catch(err){
    $(".youtube-preview").html("");
  }
})

$(".popup-holder").click(function(){
    $(".popup-holder").fadeOut();
});
$(".popup").click(function(event){
    event.stopPropagation();
})

$(".notif").click(function(){
    $(".notif .upper-arrow").fadeToggle(0);
    $(".notification-holder").fadeToggle(0);
})


/* show title input */
$(".title-checkbox").click(function(){
    console.log("k")
    $(this).find("i").toggleClass("fa-check-square-o");
    $(this).find("i").toggleClass("fa-square-o");
    $("#pub-title-input").fadeToggle();
})
/* end show title input */

/* dropdown */
$(".dropdown").click(function(){
    $(this).toggleClass("clicked-dropdown")
})

$(".dropdown article").click(function(){
    $(".dropdown").fadeOut(0);
    $(".dropdown article").each(function(){
        $(this).addClass("hide");
    });
    $(this).removeClass("hide");
    $(".dropdown").slideDown(100); 
})

/* dots and plus */
$(".dots").click(function(){
    $(this).find(".upper-arrow").fadeToggle(0);
    $(this).find(".sub-menu").fadeToggle(0);
});


/* search holder */
$(".search").focus(function(){
    $(".header-center .upper-arrow").show();
    $(".recherche-results-holder").show();
});

$(".search").focusout(function(){
    $(".header-center .upper-arrow").hide();
    $(".recherche-results-holder").hide();
});
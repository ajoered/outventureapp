import axios from 'axios';

window.heartPlan = function (input) {
  if (!input) return
  const planId = $(input).val();
  const heartIcon = $('.heart' + planId)
  axios
    .post(`/api/plans/${planId}/heart`)
    .then(res => {
      console.log(res);
      if ($(heartIcon).hasClass( "primary-pink-text" )) {
        $(heartIcon).removeClass( "primary-pink-text" )
      } else {
        $(heartIcon).addClass( "primary-pink-text" )
      }
      $('.heart-count').html(res.data.hearts.length.toString());
    })
    .catch(function (error) {
      swal({
        title: 'LOGIN | SIGNUP',
        html:
          '<a style="" href="/auth/facebook" class="col s12 waves-effect waves-light btn-large social facebook light-blue darken-4"><i class="fa fa-facebook"></i>Facebook</a>' +
          '<a style="margin-top:10px;" href="/auth/facebook" class="col s12 waves-effect waves-light btn-large social google red darken-3"><i class="fa fa-google"></i>Google</a>' +
          '<a style="margin-top:10px;" href="/login" class="col s12 waves-effect waves-light btn-large social mail grey darken-3"><i class="fa fa-envelope"></i>Email</a>',
          showCloseButton: true,
          confirmButtonColor: '#2B3E50',
          confirmButtonText: 'Not now',
      })
    });
}

export default heartPlan;

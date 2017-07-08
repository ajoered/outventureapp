import axios from 'axios';

window.donePlan = function (input) {
  if (!input) return
  const planId = $(input).val();
  const doneIcon = $('.done' + planId)
  axios
    .post(`/api/plans/${planId}/done`)
    .then(res => {
      console.log(res);
      if ($(doneIcon).hasClass( "green-text" )) {
        $(doneIcon).removeClass( "green-text" )
      } else {
        $(doneIcon).addClass( "green-text" )
      }
      $('.done-count').html(res.data.dones.length.toString());
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

export default donePlan;

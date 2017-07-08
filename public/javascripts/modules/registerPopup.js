function registerPopup(input) {
  input.click(function() {
    swal({
      title: 'LOGIN | SIGNUP',
      html:
      '<a style="" href="/auth/facebook" class="col s12 waves-effect waves-light btn-large social facebook light-blue darken-4"><i class="fa fa-facebook"></i>Facebook</a>' +
      '<a style="margin-top:10px;" href="/auth/facebook" class="col s12 waves-effect waves-light btn-large social google red darken-3"><i class="fa fa-google"></i>Google</a>' +
      '<a style="margin-top:10px;" href="/register" class="col s12 waves-effect waves-light btn-large social mail grey darken-3"><i class="fa fa-envelope"></i>Email</a>',
      showCloseButton: true,
      showConfirmButton: false
    })
});
}

export default registerPopup;

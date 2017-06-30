import axios from 'axios';

window.heartPlan = function (input) {
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
    .catch(console.error);
}

export default heartPlan;

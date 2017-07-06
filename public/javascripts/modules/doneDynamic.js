import axios from 'axios';

window.donePlan = function (input) {
  const planId = $(input).val();
  const doneIcon = $('.done' + planId)
  axios
    .post(`/api/plans/${planId}/heart`)
    .then(res => {
      console.log(res);
      if ($(doneIcon).hasClass( "green-text" )) {
        $(doneIcon).removeClass( "green-text" )
      } else {
        $(doneIcon).addClass( "green-text" )
      }
      $('.done-count').html(res.data.hearts.length.toString());
    })
    .catch(console.error);
}

export default donePlan;

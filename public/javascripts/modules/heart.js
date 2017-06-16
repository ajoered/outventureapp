import axios from 'axios';

function ajaxHeart(e) {
  e.preventDefault();
  console.log('HEART ITTT!!!!!!!!!!!!!!!!');
  console.log(this);
  axios
  .post(this.action)
  .then(res => {
    console.log(this.heart);
    const isHearted = this.heart.firstChild.classList.toggle('primary-pink-text');
    $('.heart-count').html(res.data.hearts.length.toString());
  })
  .catch(console.error);
}

export default ajaxHeart;

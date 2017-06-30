import axios from 'axios';

function ajaxDone(e) {
  e.preventDefault();
  console.log('Done ITTT!!!!!!!!!!!!!!!!');
  console.log(this);
  axios
  .post(this.action)
  .then(res => {
    console.log(this.done);
    const isDone = this.done.firstChild.classList.toggle('green-text');
    // $('.heart-count').html(res.data.hearts.length.toString());
  })
  .catch(console.error);
}

export default ajaxDone;

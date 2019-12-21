function formatDate() {
  const d = new Date();
  const dayString = d.getDate();
  const monthString = d.getMonth() + 1;

  document.getElementById('updateButtonDay').value = dayString;
  document.getElementById('updateButtonMonth').value = monthString;
}

export default formatDate;

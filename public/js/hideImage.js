const hideJug = () => {
  const jug = document.getElementById('jug');
  jug.classList.add('hide');
  setTimeout(() => {
    jug.classList.remove('hide');
  }, 1000);
};

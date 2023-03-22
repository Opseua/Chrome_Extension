function clipboard(inf1) {
    const el = document.createElement('textarea');
    el.value = inf1;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  export default clipboard
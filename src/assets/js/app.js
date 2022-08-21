/* Disclaimer */
var isset_ub_hide_disclaimer = getCookie('ub_hide_disclaimer');

if (isset_ub_hide_disclaimer == '') {
  $('.js-disclaimer').show();
}

$('.js-hide-disclaimer').on('click', function () {
  acceptCookie();
});

function acceptCookie() {
  setCookie('ub_hide_disclaimer', 'hide', 30);
  $('.js-disclaimer').slideUp('fast');
}

function getCookie(w) {
  cName = "";
  pCOOKIES = new Array();
  pCOOKIES = document.cookie.split('; ');

  for (bb = 0; bb < pCOOKIES.length; bb++) {
    NmeVal = new Array();
    NmeVal = pCOOKIES[bb].split('=');

    if (NmeVal[0] == w) {
      cName = unescape(NmeVal[1]);
    }
  }

  return cName;
}

function setCookie(name, value, expires) {
  var today = new Date();
  var expr = new Date(today.getTime() + expires * 24 * 60 * 60 * 5000);
  document.cookie = "" + name + "=" + value + "; path=/; expires=" + expr.toGMTString();
  +";";
}

function clearCookie(d, b, c) {
  try {
    if (function (h) {
      var e = document.cookie.split(";"),
          a = "",
          f = "",
          g = "";

      for (i = 0; i < e.length; i++) {
        a = e[i].split("=");
        f = a[0].replace(/^\s+|\s+$/g, "");

        if (f == h) {
          if (a.length > 1) g = unescape(a[1].replace(/^\s+|\s+$/g, ""));
          return g;
        }
      }

      return null;
    }(d)) {
      b = b || document.domain;
      c = c || "/";
      document.cookie = d + "=; expires=" + new Date() + "; domain=" + b + "; path=" + c;
    }
  } catch (j) {}
};
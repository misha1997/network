var activeRouter = null;
var error = false;
$(".active-icon").click(function() {
  $(this).parent().toggleClass("active");
  activeRouter = $(this).parent();
});

$(".ip").keyup(function() {
  $(this).mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test($(this).val()) || $(this).val() == '') {  
    $(this).removeClass("error");
    error = false;
  } else {
    $(this).addClass("error");
    error = true;
  }
});

$(".mask").keyup(function() {
  $(this).mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });
  if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test($(this).val()) || $(this).val() == '') {  
    $(this).removeClass("error");
    error = false;
  } else {
    $(this).addClass("error");
    error = true;
  }
});

$("img.scheme").click(function() {
  $(".block").removeClass("active");
});

$("#generate").click(function() {
  if(error) {
    alert("Помилка вхідних даних!");
    return;
  }
  if(!activeRouter) {
    alert("Оберіть роутер!");
    return;
  }
  var result = $("textarea#result");
  result.empty();
  var typeRoute = $('input[name=typeRoute]:checked', '#typeRoute').val();
  if(typeRoute == 'static') {
    result.append(
      "Router>enable\n"+
      "Router#conf term\n"
    );
    if(activeRouter.attr('class').indexOf('r0') > -1) {
      result.append("Router(config)#ip route 192.168.30.0 255.255.255.0 192.168.2.2");
    }
    if(activeRouter.attr('class').indexOf('r1') > -1) {
      result.append("Router(config)#ip route 192.168.30.0 255.255.255.0 192.168.3.1");
    }
    if(activeRouter.attr('class').indexOf('r2') > -1) {
      result.append("Router(config)#ip route 192.168.10.0 255.255.255.0 gi0/0");
    }
  }
  if(typeRoute == 'dinamic') {
    var typeProtocol = $('input[name=typeProtocol]:checked', '#typeProtocol').val();
    result.append(
      "Router>enable\n"+
      "Router#conf term\n"
    );
    if(typeProtocol == 'rip') {
      result.append("Router(config)#router rip\n");
      var network1 = activeRouter.find(".network-1.ip").val();
      if(network1) {
        result.append("Router(config-router)#network " + network1.substring(0, network1.length - 1)+"0\n");
      }
      var network2 = activeRouter.find(".network-2.ip").val();
      if(network2) {
        result.append("Router(config-router)#network " + network2.substring(0, network2.length - 1)+"0\n");
      }
      var network3 = activeRouter.find(".network-3.ip").val();
      if(network3) {
        result.append("Router(config-router)#network " + network3.substring(0, network3.length - 1)+"0\n");
      }
      result.append(
        "Router(config-router)#exit\n"+
        "Router(config)#exit"
      );
    }
    if(typeProtocol == 'eigrp') {
      result.append("Router(config)#router eigrp 15\n");
      var network1 = activeRouter.find(".network-1.ip").val();
      if(network1) {
        result.append("Router(config-router)#network " + network1.substring(0, network1.length - 1)+"0\n");
      }
      var network2 = activeRouter.find(".network-2.ip").val();
      if(network2) {
        result.append("Router(config-router)#network " + network2.substring(0, network2.length - 1)+"0\n");
      }
      var network3 = activeRouter.find(".network-3.ip").val();
      if(network3) {
        result.append("Router(config-router)#network " + network3.substring(0, network3.length - 1)+"0\n");
      }
      result.append(
        "Router(config-router)#exit\n"+
        "Router(config)#exit"
      );
    }
    if(typeProtocol == 'osfp') {
      result.append("Router(config)#router ospf 10\n");
      var network1 = activeRouter.find(".network-1.ip").val();
      if(network1) {
        result.append("Router(config-router)#network " + network1.substring(0, network1.length - 1)+"0 0.0.0.255 area 0\n");
      }
      var network2 = activeRouter.find(".network-2.ip").val();
      if(network2) {
        result.append("Router(config-router)#network " + network2.substring(0, network2.length - 1)+"0 0.0.0.255 area 0\n");
      }
      var network3 = activeRouter.find(".network-3.ip").val();
      if(network3) {
        result.append("Router(config-router)#network " + network3.substring(0, network3.length - 1)+"0 0.0.0.255 area 0\n");
      }
      result.append(
        "Router(config-router)#"
      );
    }
  }
});

$('input[name=typeRoute]').change(function() {
  var typeRoute = $('input[name=typeRoute]:checked', '#typeRoute').val();
  if(typeRoute == 'dinamic') {
    $('#typeProtocol').show();
  }
  if(typeRoute == 'static') {
    $('#typeProtocol').hide();
  }
});

$("#copy").click(function() {
  var $temp = $("<textarea>");
  $("body").append($temp);
  $temp.val($("textarea#result").text()).select();
  document.execCommand("copy");
  $temp.remove();
});

$("#clear").click(function() {
  $("textarea#result").empty();
});
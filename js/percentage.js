function Percentage(type) {
  this.type = type;
  this.requestInterval = setInterval(this.update.bind(this), 3000);
  this.wrapper = $('#percentage-wrap');
  this.counter = $('#percentage');
  this.total = $('#total-visitors');
  this.currentValue = 0;
  this.currentTotal = 0;
  this.revealed = false;
};

Percentage.formatNumber = function(text) {
  return text.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};

Percentage.animateCount = function(element, value, current, usePercent) {
  $({count: current}).animate({count: value}, {
    duration: 500,
    step: function() {
      element.text(Percentage.formatNumber(String(parseInt(this.count, 10))) + (usePercent ? '%' : ''));
    }
  });
};

Percentage.prototype.setValue = function(value, total) {
  var percent = Math.round(value / total * 100);
  Percentage.animateCount(this.counter, percent, this.currentValue, true);
  Percentage.animateCount(this.total, total, this.currentTotal);
  this.currentValue = percent;
  this.currentTotal = total;
};

Percentage.prototype.readValue = function(data) {
  var path = this.type.split('.');
  var dest = data;

  while (path.length > 0) {
    dest = dest[path.shift()];
  }

  return dest;
};

Percentage.prototype.update = function() {
  var self = this;
  var request = new XMLHttpRequest;
  request.open('GET', 'http://api.chartbeat.com/cbtotal/?v=2', true);
  request.onreadystatechange = function() {
    if (request.status === 200 && request.readyState === 4) {
      self.render(JSON.parse(request.responseText));
    }
  };
  request.send(null);
};

Percentage.prototype.render = function(data) {
//  try {
    if (!this.revealed) {
      this.revealed = true;
      this.wrapper.on('transitionEnd webkitTransitionEnd oTransitionEnd otransitionend', $.proxy(function() {
        this.wrapper.addClass('done-transitioning');
      }, this));
      this.wrapper.removeClass('hidden');
      $('.icon').removeClass('loading');
      $('.citation').removeClass('hidden');
    }

    var value = this.readValue(data);
    var total = data.n;
    this.setValue(value, total);
//  } catch (e) {};
};

// 放大镜插件
var magnifier = (function(){
  // 放大镜 与 预览窗口尺寸成正比
  // 小图 与 大图 尺寸成正比
  
  // 默认参数
  Magnifier.DEFAULT = {
    srcW: 275,
    srcH: 200,      // 小图尺寸
    bigImgW: 800,   // 大图尺寸
    viewW: 400,     // 预览窗口尺寸
    magnifierW: 30, // 放大镜尺寸
    magnifierH: 20
  };
  function init(el, opts){
    opts = $.extend(true, Magnifier.DEFAULT, opts);
    new Magnifier(el, opts).init();
  }
  
  // 放大镜 构造函数
  function Magnifier(el, opts){
    this.$img = $(el);  //当前img 元素
    this.$el = this.$img.parent(".src_box");//当前img父元素
    this.$magnifier = this.$el.find(".magnifier"); // 放大镜元素
    this.$view =  this.$el.next(".view"); // 预览窗口元素
    this.$bigimg = this.$view.find("img"); // 大图元素
    
    this.opts = opts;
    // 比例值 放大镜/视口
    this.ratio = this.opts.magnifierW / this.opts.viewW;
    // 比例值 原图/大图
    this.img_ratio = this.opts.srcW / this.opts.bigImgW;
  }
  
  // 放大镜初始化
  Magnifier.prototype.init = function(){
    var me = this;
    this.img_src = this.$img.attr("src");
    
    // 小图赋值宽高
    this.$el.css({
      "width": this.opts.srcW,
      "height": this.opts.srcH
    });
    // 放大镜赋值宽高
     this.$magnifier.css({
       "width": this.opts.magnifierW,
       "height": this.opts.magnifierH
     });
     // 预览窗口赋值宽高
     this.$view.css({
       "width": this.opts.viewW,
       "height": this.opts.magnifierH / this.ratio
     });
     // 大图赋值宽高
     this.$bigimg.css({
       "width": this.opts.bigImgW,
       "height": this.elH / this.img_ratio
     });
     
     // 绑定事件
     this.bindEvent();
  }
  
   Magnifier.prototype.bindEvent = function(){
      var me = this;
      this.$mag_warp = this.$img.parents(".mag_wrap");
      
      this.$mag_warp.on("mouseover", ".src_box", function(ev){
        me.over(ev);
      }).on("mousemove", ".src_box", function(ev){
        me.move(ev);
      }).on("mouseout", ".src_box", function(ev){
        me.out(ev);
      })
   };
  
   Magnifier.prototype.over = function(ev){
   // 缓存
    var $mag_wrap = this.$mag_wrap;
    var $magnifier = this.$magnifier;
    var x = ev.clientX - $mag_wrap.offset().left - $magnifierW/2;
    var y = ev.clientY - $mag_wrap.offset().top - $magnifierH/2;
    
    $magnifier.css({
      "left": x,
      "top": y
    });
    $magnifier.show();
    this.$view.show();
   };
   
   Magnifier.prototype.move = function(ev){
    // 缓存
    var $mag_wrap = this.$mag_wrap;
    var $magnifier = this.$magnifier;
    var $magnifierW = $magnifier.outerWidth();
    var $magnifierH = $magnifier.outerHeight();
    var $el = this.$el;
    var $elW = this.opts.srcW;
    var $elH = this.opts.srcH;
    var x = ev.clientX - $mag_wrap.offset().left - $magnifierW/2;
    var y = ev.clientY - $mag_wrap.offset().top - $magnifierH/2;
    // 限定范围
    if(x<0){
      x = 0;
    }
    if(x> $elW - $magnifierW){
      x = $elW - $magnifierW
    }
    if(y<0){
      y = 0;
    }
    if(y> $elH - $magnifierH){
      y = $elH - $magnifierH
    }
    $magnifier.css({
      "left": x,
      "top": y
    });
    
    var precentX = x/($elW - $magnifierW);
    var precentY = y/($elH - $magnifierH);
    
    var bx = precentX * (this.$bigimg.outerWidth() - this.$view.outerWidth());
    var by = precentY * (this.$bigimg.outerHeight() - this.$view.outerHeight());
    
    this.$bigimg.css({
      "left": -bx,
      "top": -by
    });
   };
  
  Magnifier.prototype.out = function(){
    this.$magnifier.hide();
    this.$view.hide();
  }
  
  // 封装为Jquery插件
  $.fn.extend({
    magnifier: function(options){
      return this.each(function(){
        init(this,options)
      })
    }
  });
  
  return {
    init: init
  }
})();

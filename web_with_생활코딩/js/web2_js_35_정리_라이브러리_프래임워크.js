var Links = {
setColor:  function(color){
    // var alist = document.querySelectorAll('a');
    // var i = 0;
    // while(i < alist.length){
    // alist[i].style.color = color;
    // i = i + 1;
    // }
    // // jQuery를 이용해서 위 코드를 더 간단히 만들 수 있음.
    // $('a') 이 웹페이지에 있는 모든 a 코드를 jQuery로 제어하겠다.
    // jQuery를 이용해서 css 를 제어하고 싶으면 jQuery css 를 검색해 보자!
    $('a').css('color', color); // 'color'를 바꾸고 싶은데 매개변수 color를 이용해 들어온 값을 이용
}
}
var Body = {
    setColor: function(color){
        // document.querySelector('body').style.color = color;
        $('body').css('color',color);
    },
    setBackgroundColor: function(color){
        // document.querySelector('body').style.backgroundColor = color;
        $('body').css('backgroundColor', color);
    }
}

function nightDayHandler(self){
    
var target = document.querySelector('body');
    if(self.value === 'night'){
        Body.setBackgroundColor('black');
        Body.setColor('white');
        self.value = 'day';

        Links.setColor('powderblue');
    } else {
        Body.setBackgroundColor('white');
        Body.setColor('black');
        self.value = 'night';

        Links.setColor('blue');
    }
}
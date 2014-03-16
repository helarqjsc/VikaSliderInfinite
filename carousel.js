var carousel_item_width_ = []; var carousel_pos = []; var carousel_start_pos = [];  
var carousel_animate = []; var carousel_queue_n = []; var carousel_direction = []; 
var carousel_real_pos = []; var carousel_speed = []; var carousel_infinity = []; 
var item_width_ = []; var left_value = [];
var carousel_click_left = []; var carousel_dot_fast_click = [];


function resize_carousel(i) {
	division = 3;
	$('#carousel'+i+' #slides'+i).css('margin-left', 0);	
	all = ($('#carousel'+i+' #slides'+i+' .item').length / division+1) * $('#carousel'+i+' #slides'+i+' .item').eq(0).width();  				
	dif = $('#carousel'+i).offset().left;
	dif_ = $('.left-carousel'+i).offset().left;  	
	j = -all + (dif_ - dif);	
	
	s = $('#carousel'+i+' #slides'+i+' li').css('padding-right');	
	s = s.replace('px', '')*1;	

	f = $('#carousel'+i+' #slides'+i+' .item').length / division - 4;		
	j = j - (s*f);					

	$('#carousel'+i+' #slides'+i).css('margin-left', j);  	  	
}

function queue(i) {				
	if (carousel_queue_n[i] > 0) {						
		if (carousel_queue_n[i]>=1) { carousel_speed[i] = 300; }
		if (carousel_queue_n[i]>=2) { carousel_speed[i] = 200; }
		if (carousel_queue_n[i]>=3) { carousel_speed[i] = 100; }	 			
		if (carousel_queue_n[i]>=4) { carousel_speed[i] = 50; }	 				
		carousel_queue_n[i] = carousel_queue_n[i] - 1;
		if (carousel_queue_n[i] == 0) { carousel_speed[i] = 300; }		

		$('#buttons-'+i+' .'+carousel_direction[i]).click();			
	}
}

function moveto_while(n, i) {				
	if (carousel_animate[i] == false) {				
		k = n - carousel_real_pos[i]; 				
		if (k < 0) {
			k = k*-1;
			carousel_queue_n[i] = k;
			carousel_direction[i] = 'prev';			
			queue(i);
		} else
		{
			carousel_queue_n[i] = k;
			carousel_direction[i] = 'next';
			queue(i);	 			
		}
	}
}

function carouselInit() {		
	for (var i = 1; i <= 10; i++) {
		if ($('#carousel'+i).length <= 0) continue;
		all_carousel = i;
		carousel_pos[i] = 0; carousel_start_pos[i] = 0; carousel_animate[i] = false;
		carousel_queue_n[i] = 0; carousel_direction[i] = ''; carousel_real_pos[i] = 0; carousel_speed[i] = 300;
		if (carousel_click_left[i] == null) carousel_click_left[i] = -1000;
		if (carousel_dot_fast_click[i] == null) carousel_dot_fast_click[i] = false;

		var speed = 5000;		
		item_width_[i] = $('#carousel'+i+' #slides'+i+' li').outerWidth(); 
		left_value[i] = item_width_[i] * (-1); 		
		$("body").on("click", '#carousel'+i+' .item', function(){ 					
			i = $(this).closest('.slides').parent().data('carousel')*1;			
			if (carousel_animate[i] == false) { 			
				ind = $('#carousel'+i+' .item').index(this);   	 		
				k = ind - carousel_start_pos[i]; 					
				if (k <= carousel_click_left[i]) { return false; }

				if (k < 0) {
					k = k*-1;
					carousel_queue_n[i] = k;
					carousel_direction[i] = 'prev';	 			
					queue(i);
				} else
				{	 			
					carousel_queue_n[i] = k;
					carousel_direction[i] = 'next';	 			
					queue(i);	 			
				}				
			}
		});

		$("body").on("click", '.carousel-items-dot-'+i+' li', function(){
			i= $(this).parent().data('carousel');						
			ind = $('.carousel-items-dot-'+i+' li').index(this);  
			if (carousel_animate[i] == false) 			
				moveto_while(ind+1, i);
		}); 	

		$('.carousel-items-dot-'+i+' li').removeClass('active');		
		$('.carousel-items-dot-'+i+' li').eq(0).addClass('active');	 

		bf_ = "";   	
		a = 0;
		$('#carousel'+i+' #slides'+i+' li .item').each(function(){
			a++;
			$(this).attr('data-id', a);
			if (a == 1) {
				$(this).addClass('first-item');
			}
			$('.carousel-items-dot-'+i).append('<li></li>');
		});

		$('#carousel'+i+' #slides'+i+' li .item').eq(a-1).addClass('last-item');
		$('#carousel'+i+' #slides'+i+' ul li').eq(0).addClass('active');	 	

		$("#carousel"+i+" #slides"+i+" li").each(function(){  		  		  		
			bf_ = bf_+'<li class="copy">'+$(this).html()+'</li>';
		});

		carousel_pos[i] = a+1; 
		carousel_start_pos[i] = carousel_pos[i];
		carousel_real_pos[i] = 1;  			

		$('#carousel'+i+' #slides'+i+' ul').prepend(bf_);  	
		$('#carousel'+i+' #slides'+i+' ul').append(bf_);  	  	

		if (carousel_infinity[i] == false) {
			$('#carousel'+i+' #slides'+i+' .copy').css('visibility', 'hidden');				
			$('#buttons-'+i+' .prev').addClass('no');				
			$('#carousel'+i+' .copy .item').html('');							
		}

		resize_carousel(i);  	

		$('#carousel'+i+' #slides'+i+' li:first').before($('#slides'+i+' li:last'));  
		$('#carousel'+i+' #slides'+i+' ul').css({'left' : left_value});		
}        

  $('.buttons .prev').click(function() {
    	i = $(this).closest('.buttons').data('carousel')*1;   	
    	if (carousel_animate[i] == true) 
    		return false;

    	division = 3;
    	if (carousel_infinity[i] == false) {
    		if (carousel_real_pos[i] == 1) {  			
    			return false;
    		}
    		if (carousel_real_pos[i] <= 2) {
    			$('#buttons-'+i+' .prev').addClass('no');
    		}
    	}
    	if (carousel_animate[i] == false) {
    		$('#buttons-'+i+' .next').removeClass('no');
    		carousel_animate[i] = true;    		

    		left_indent = parseInt($('#carousel'+i+' #slides'+i+' ul').css('left')) + item_width_[i];

    		carousel_pos[i] = carousel_pos[i] - 1;
    		if (carousel_pos[i] < 1) { carousel_pos[i] = $('#carousel'+i+' .item').length; }	    

    		carousel_real_pos[i] = carousel_real_pos[i] - 1;
    		if (carousel_real_pos[i] < 1) { carousel_real_pos[i] = $('#carousel'+i+' .item').length / division; }	    

			if (carousel_dot_fast_click == true){
    			$('.carousel-items-dot-'+i+' li').removeClass('active');
    			j = carousel_real_pos[i] - (carousel_queue_n[i]+1);
    			$('.carousel-items-dot-'+i+' li').eq(j).addClass('active');	       			
			} else {
    			$('.carousel-items-dot-'+i+' li').removeClass('active');
    			$('.carousel-items-dot-'+i+' li').eq(carousel_real_pos[i]-1).addClass('active');	            	            
			}
    
    		move_carousel_start(i,carousel_real_pos[i]);    		
    		if (carousel_queue_n[i] == 0) {
    			$('#carousel'+i+' #slides'+i+' ul li').removeClass('active');		
    			$('#carousel'+i+' #slides'+i+' ul li').eq($('#carousel'+i+' .slides ul li').length / division).addClass('active');	        			
    			move_carousel_end(i,carousel_real_pos[i]-1);
    		}

    		$('#carousel'+i+' #slides'+i+' ul').animate({'left' : left_indent}, carousel_speed[i],function(){    
    			i = $(this).parent().parent().data('carousel');
    			$('#carousel'+i+' #slides'+i+' li:first').before($('#carousel'+i+' .slides li:last'));           

    			$('#carousel'+i+' #slides'+i+' ul').css({'left' : 0});
    			carousel_animate[i] = false;
    			queue(i);

    		});
    	}    
    	return false;
    });



    $('.buttons .next').click(function() {  	               

    	i = $(this).closest('.buttons').data('carousel')*1;   	
    	if (carousel_animate[i] == true) 
    		return false;
    	division = 3;    	    	
    	
    	if (carousel_infinity[i] == false) {    		
    		if (carousel_real_pos[i] == $('#carousel'+i+' #slides'+i+' ul li').length / division) {  			
    			return false;
    		}
    		if (carousel_real_pos[i] >= $('#carousel'+i+' #slides'+i+' ul li').length / division - 1) {    			
    			$('#buttons-'+i+' .next').addClass('no');
    		}
    	}    	

    	if (carousel_animate[i] == false) {	    		

    		$('#buttons-'+i+' .prev').removeClass('no');
    		carousel_animate[i] = true;

    		left_indent = parseInt($('#carousel'+i+' #slides'+i+' ul').css('left')) - item_width_[i];

    		carousel_pos[i] = carousel_pos[i] + 1;
    		if (carousel_pos[i] > $('#carousel'+i+' .item').length ) { carousel_pos[i] = 1; }	    

    		carousel_real_pos[i] = carousel_real_pos[i] + 1;	    
    		if (carousel_real_pos[i] > $('#carousel'+i+' .item').length / division) { carousel_real_pos[i] = 1; }	    

			move_carousel_start(i,carousel_real_pos[i]);  			
    		if (carousel_queue_n[i] == 0) {    			
    			$('#carousel'+i+' #slides'+i+' ul li').removeClass('active');	    			
    			k = Math.ceil($('#carousel'+i+' #slides'+i+' ul li').length / division + 2);    			    			    			
    			$('#carousel'+i+' #slides'+i+' ul li').eq(k).addClass('active');	   
    			move_carousel_end(i,carousel_real_pos[i]-1); 			
    		}
    		
			if (carousel_dot_fast_click == true){
    			$('.carousel-items-dot-'+i+' li').removeClass('active');
    			j = carousel_real_pos[i]-1 + (carousel_queue_n[i]);

    			$('.carousel-items-dot-'+i+' li').eq(j).addClass('active');	       			
			} else {
    			$('.carousel-items-dot-'+i+' li').removeClass('active');
    			$('.carousel-items-dot-'+i+' li').eq(carousel_real_pos[i]-1).addClass('active');	            	            
			}

    		$('#carousel'+i+' #slides'+i+' ul').animate({'left' : left_indent}, carousel_speed[i], function () {
    			i = $(this).parent().parent().data('carousel');
    			$('#carousel'+i+' #slides'+i+' li:last').after($('#carousel'+i+' #slides'+i+' li:first'));                  	      	     	     

    			$('#carousel'+i+' #slides'+i+' ul').css({'left' : 0});
    			carousel_animate[i] = false;
    			queue(i);
    		}); 
    	}
    	return false;
    });        

	$( window ).resize(function() { 
	for (var i = 1; i <= 10; i++) {
	if ($('#carousel'+i).length <= 0) continue;
		resize_carousel(i);					
	}		
	});

}


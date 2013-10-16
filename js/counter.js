(function($){
	if($('meta[name=description]').attr("content").toLowerCase() == "redmine"){
		var EnumMessages = {
			RESET: "Are you sure that wish to RESET the time?",
			CLOCK: "00:00:00"
		}		
		var EnumState = {
			START:"Start",
			STOP:"Stop",
			RESET:"Reset",
			START_CLASS:"bt bt-start",
			STOP_CLASS:"bt bt-stop",
			RESET_CLASS:"bt bt-reset"
		}
		var $timeInput = $("#time_entry_hours");		
		if($timeInput.length){
			//configs
			var timerFunction, $clock, $stopStart, $reset;
			//has time-tracker? if not, insert a html to start/stop timer, and show the time
			if(!$("#time-tracker-cnt").length){
				$timeInput.parent().append('<div id="time-tracker-cnt"><div id="time-tracker-clk" class="clk">'+EnumMessages.CLOCK+'</div><a id="time-tracker-btn" class="'+EnumState.START_CLASS+'">'+EnumState.START+'</a><a id="time-tracker-rst" class="'+EnumState.RESET_CLASS+'">'+EnumState.RESET+'</a></div>');
				$clock = $('#time-tracker-clk');
			}

			$(document).on("click", "#time-tracker-btn", function(e){
				e.preventDefault();
				$stopStart = $(this);
				var isStarted = $stopStart.attr("data-started"), newState;
				if(!isStarted || isStarted == "false"){
					startTime();
				}else{
					stopTime();
				}
			});

			$(document).on("click", "#time-tracker-rst", function(e){
				e.preventDefault();
				resetTime();
			});


			function secondsToHms(t) {
				var t = parseInt(t, 10);
			    var h   = Math.floor(t / 3600);
			    var m = Math.floor((t - (h * 3600)) / 60);
			    var s = t - (h * 3600) - (m * 60);
			    h = h < 10 ? "0"+h : h;
			    m = m < 10 ? "0"+m : m;
			    s = s < 10 ? "0"+s : s;
    			return h+':'+m+':'+s;
			}

			function startTime(){
				if($stopStart){
					$stopStart.attr("data-started", true);
					//set new value to fild
					var value = parseFloat($timeInput.val());					
					var seconds = value ? (value*3600) : 0;
					atualizeClock(seconds);
					timerFunction = setInterval(function(){
						seconds++;
						atualizeClock(seconds);
					}, 1000);
					//change button
					$stopStart.html(EnumState.STOP);
					$stopStart.attr("class", EnumState.STOP_CLASS);
				}
			}

			function atualizeClock(s){				
				var hoursFormatted = (s/3600).toFixed(4);
				$timeInput.val(hoursFormatted);
				//atualize clock
				if($clock){
					$clock.html(secondsToHms(s));
				}
			}

			function stopTime(){
				if($stopStart){
					$stopStart.attr("data-started", false);
					clearInterval(timerFunction);
					$stopStart.html(EnumState.START);
					$stopStart.attr("class", EnumState.START_CLASS);
				}
			}

			function resetTime(){
				if($clock && $stopStart){
					var resp = confirm(EnumMessages.RESET);
					if(resp==true){
						stopTime();
						$clock.html(EnumMessages.CLOCK);
						$timeInput.val("");
					}
				}
			}

		}
	}
})(jQuery);

	

	//clearInterval(int)

	//inserir o contador e enviar pro plugin qual tarefa foi iniciada
	/*
	//localStorage.setItem("x", 1);
	chrome.extension.sendRequest({useskill: "getStorage"}, function(response) {
		if (callback && typeof(callback) === "function") {
			callback.call(this, response);
		}
	});
	*/

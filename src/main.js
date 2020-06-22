import ms from 'ms';
import lunchtime from './lunchtime.js';
import millisecondsUntil from './millisecondsUntil.js';



const leds = [
[0,1,2,3,4,5,6,7],
[0,1,2,3,4,5,6,7],
[0,1,2,3,4,5,6,7],
[0,1,2,3,4,5,6,7],
[0,1,2,3,4,5,6,7],
[0,1,2,3,4,5,6,7],
[0,1,2,3,4,5,6,7],
[0,1,2,3,4,5,6,7]
]

d3.select("#container").selectAll(".led-row")
  .data(leds)
  .enter()
  .append("div")
  .attr("class","led-row")
  .each(function(d,i){
    d3.select(this).selectAll(".led")
      .data(d)
      .enter()
      .append("div")
      .attr("class","led")
      .attr("id",(_,j)=>`${i}-${j}`)
  })




export default function howLongUntilLunch(hours, minutes) {
	// lunch is at 12.30
	if (hours === undefined) hours = 12;
	if (minutes === undefined) minutes = 30;

	var millisecondsUntilLunchTime = millisecondsUntil(lunchtime(hours, minutes));
	return ms(millisecondsUntilLunchTime, { long: true });
}



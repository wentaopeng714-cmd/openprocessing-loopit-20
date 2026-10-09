// A slider with labels for its title and value.
function SliderLayout(label, minValue, maxValue, defaultValue, steps, posx, posy) {
  
  this.label = label;
  this.slider = createSlider(minValue, maxValue, defaultValue, steps);
  this.slider.position(posx, posy);
  
  this.display = function() {
    var sliderPos = this.slider.position();
    
    noStroke();
    fill(labelColor);
    textSize(15);
    text(this.label, sliderPos.x, sliderPos.y-10);

    fill(labelColor);
    text(this.slider.value(), sliderPos.x+this.slider.width+10, sliderPos.y+10);
  }
}
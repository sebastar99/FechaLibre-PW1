export class Slider {
  constructor(sliderContainer, autoPlayInterval = 5000) {
    this.container = sliderContainer;
    this.autoPlayInterval = autoPlayInterval;
    this.slides = this.container.querySelectorAll('.slide');
    this.dots = this.container.querySelectorAll('.dot');
    this.currentSlide = 0;
    this.autoPlayIntervalId = null;
    this.init();
  }

  init() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.stopAutoPlay();
        this.showSlide(index);
        this.startAutoPlay();
      });
    });
    this.startAutoPlay();
  }

  showSlide(index) {
    this.currentSlide = index;
    this.slides.forEach(slide => {
      slide.classList.remove('active');
    });
    this.dots.forEach(dot => {
      dot.classList.remove('active');
    });
    this.slides[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide].classList.add('active');
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  startAutoPlay() {
    this.autoPlayIntervalId = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.autoPlayIntervalId) {
      clearInterval(this.autoPlayIntervalId);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.slider-container');
  if (container) {
    new Slider(container, 5000);
  }
});

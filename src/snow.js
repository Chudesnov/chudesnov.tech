import { getSeason } from "./season.js";

window.onload = function () {
  class SnowfallWorker {
    constructor(canvas) {
      // Transfer the offscreen canvas to the worker and start rendering
      const offscreenCanvas = canvas.transferControlToOffscreen();
      this.worker = new Worker("snow-worker.js");
      this.worker.postMessage({ type: "canvas", canvas: offscreenCanvas }, [offscreenCanvas]);

      this.resize(); // Worker
    }

    start() {
      this.worker.postMessage({ type: "start" });

    }

    stop() {
      this.worker.postMessage({ type: "stop" });
    }

    resize() {
      const { innerWidth, innerHeight } = window;
      this.worker.postMessage({ type: "resize", window: { innerWidth, innerHeight } });
    }
  }

  function throttle(func, wait) {
    let waiting = false;
    return function () {
      if (!waiting) {
        func.apply(this, arguments);
        waiting = true;
        setTimeout(() => { waiting = false; }, wait);
      }
    };
  }

  function changeSnowAnimation(animationName) {
    if (animationName === "none") {
      snowfall.stop();
      document.title = pageTitle;
    } else if (animationName === "snowfall") {
      snowfall.start();
      document.title = "❄️ " + pageTitle;
    }
  }

  const canvas = document.getElementById("snowCanvas");
  const snowToggle = document.querySelector(".snow-toggle");
  const snowfall = new SnowfallWorker(canvas);
  const pageTitle = document.title;
  const storageKey = "snow";

  const isWinter = getSeason() === "Winter";

  let currentStorage = localStorage.getItem(storageKey);

  if (isWinter && currentStorage) {
    console.debug("Restoring snow animation from storage:", currentStorage);
    snowToggle.querySelector(
      `.snow-toggle__control[value='${currentStorage}']`
    ).checked = true;
    changeSnowAnimation(currentStorage);
  } else if (isWinter) {
    console.debug("It's winter, enabling snowfall by default.");
    snowToggle.querySelector(
      `.snow-toggle__control[value='snowfall']`
    ).checked = true;
    changeSnowAnimation("snowfall");
  } else {
    console.debug("No snow animation enabled by default. Season is", getSeason());
  }

  snowToggle.hidden = !isWinter;

  window.addEventListener("storage", () => {
    changeSnowAnimation(localStorage.getItem(storageKey));
  });

  document.querySelectorAll('input[name="snow"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
      const value = event.target.value;
      localStorage.setItem(storageKey, event.target.value);
      changeSnowAnimation(value);
    });
  });

  window.addEventListener(
    "resize",
    throttle(() => {
      snowfall.resize();
    }, 33)
  );
};

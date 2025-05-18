document.addEventListener("mousemove", (e) => {
  const circle = document.getElementById("cursorCircle");
  circle.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});
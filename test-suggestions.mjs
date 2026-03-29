const res = await fetch("http://localhost:4000/api/decks/slides/suggestions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    deckSlug: "priyoshop-exec",
    slideId: "test-id",
    image: null,
    currentSlide: { frontmatter: {}, content: "Hello world" },
    previousSlide: null,
    nextSlide: null,
    toc: []
  })
});
console.log("Status:", res.status);
const data = await res.text();
console.log("Response:", data);

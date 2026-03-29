import fs from 'fs';
async function run() {
  const payload = {
    deckSlug: "priyoshop-exec",
    slideId: "test-id",
    image: null,
    currentSlide: { frontmatter: { title: "Test" }, content: "Hello world" },
    previousSlide: null,
    nextSlide: null,
    toc: []
  };
  const res = await fetch("http://localhost:4000/api/decks/slides/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  console.log("Status:", res.status);
  const data = await res.text();
  console.log("Raw Response:", data);
}
run();

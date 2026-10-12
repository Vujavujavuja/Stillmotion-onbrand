# Carousel / Figma-import combiner

Pattern for one self-contained HTML holding many panels (for stacked PDF or Figma import):
1. Inline `tokens.css` once at the top.
2. For each panel HTML: extract its `<style>`, **prefix every selector with `#dN-wrap`** (convert
   `body`/`:root`/`*` rules to the wrapper), and wrap its `<body>` in `<section id="dN-wrap"
   data-layer="...">`.
3. Stack the sections in a centered flex column; render to verify no style collisions.
Write the selector-scoper once as a small Python script and keep it in `scripts/` for reuse.

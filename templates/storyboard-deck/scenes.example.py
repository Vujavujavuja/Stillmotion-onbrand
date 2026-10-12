"""scenes.py - copy next to deck.py as scenes.py and edit. One tuple per frame, in slide order.

name  = the frame's HTML file without .html (shapes.mjs picks up every NN-*.html in this folder)
label = scene label shown in the speaker notes
beat  = the voiceover line or beat description for that scene
"""
SLUG = "my-video_scene-by-scene"      # output: out/<SLUG>_EDITABLE.pptx
TITLE = "My video - scene by scene"

SCENES = [
    ("01-title",   "Scene 1 - Title",   "Opening line of the voiceover."),
    ("02-problem", "Scene 2 - Problem", "The line this frame illustrates."),
]

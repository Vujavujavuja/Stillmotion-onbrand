# Whisper models — install on demand (NOT committed)

Speech-to-text models (whisper.cpp `*.bin` format) for **video transcription / understanding**.
The model files are large (~465 MB) and **gitignored** — they are not in the repo. Install only when a job
needs them.

## When you need this
- The user asks for a **transcript** of a video/audio.
- You need to **understand spoken content** — e.g. match b-roll to a voiceover, caption a clip, or
  summarize a reference video.

## Install the model
```bash
# small English model (~465 MB) into this folder:
curl -L -o system/whisper-models/ggml-small.en.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en.bin
```
Other sizes (same URL pattern): `ggml-base.en.bin` (faster/smaller), `ggml-medium.en.bin` (slower/more accurate).

## Use it (whisper.cpp)
```bash
brew install whisper-cpp                                  # one-time (macOS)
ffmpeg -i input.mp4 -ar 16000 -ac 1 audio.wav            # extract 16kHz mono audio
whisper-cli -m system/whisper-models/ggml-small.en.bin -f audio.wav -otxt   # -> audio.txt transcript
```

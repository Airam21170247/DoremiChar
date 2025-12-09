import string

import numpy as np
import simpleaudio as sa

SAMPLE_RATE = 11025
DURATION = 0.2  # time per letter
SPACE_SILENCE = 1.0  # silence for space

# All letters a-z; each one rises a semitone.
LETTER_SET = list(string.ascii_lowercase)
BASE_FREQ = 196.0  # G3 as base


def letter_freq(letter: str) -> float:
	idx = LETTER_SET.index(letter.lower())
	return BASE_FREQ * 2 ** (idx / 12)


def tone(freq: float, duration: float = DURATION, sample_rate: int = SAMPLE_RATE) -> np.ndarray:
	t = np.linspace(0, duration, int(sample_rate * duration), False)
	wave = np.sign(np.sin(2 * np.pi * freq * t))  # square wave
	audio = (wave * 0.35 * (2**7 - 1)).astype(np.int8)
	return audio


def silence(duration: float, sample_rate: int = SAMPLE_RATE) -> np.ndarray:
	return np.zeros(int(sample_rate * duration), dtype=np.int8)


def play_text(text: str) -> None:
	chunks: list[np.ndarray] = []
	for ch in text:
		if ch == " ":
			chunks.append(silence(SPACE_SILENCE))
		elif ch.lower() in LETTER_SET:
			chunks.append(tone(letter_freq(ch)))
			chunks.append(silence(0.05))
	if not chunks:
		return
	audio = np.concatenate(chunks)
	play_obj = sa.play_buffer(audio, 1, 1, SAMPLE_RATE)
	play_obj.wait_done()


if __name__ == "__main__":
	sample = "hello world"  # example with letters a-z and spaces
	play_text(sample)

#!/bin/bash

ffmpeg -f concat -safe 0 -i <(for f in file*.wav; do echo "file '$f'"; done) -c copy output.wav

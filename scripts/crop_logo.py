from pathlib import Path

from PIL import Image

source = Path("public/aktua-home-logo.png")
target = Path("public/aktua-home-logo-cropped.png")

image = Image.open(source).convert("RGBA")
pixels = image.load()
width, height = image.size
xs: list[int] = []
ys: list[int] = []

for y in range(height):
    for x in range(width):
        red, green, blue, alpha = pixels[x, y]
        if alpha > 10 and not (red > 245 and green > 245 and blue > 245):
            xs.append(x)
            ys.append(y)

padding = 18
box = (
    max(0, min(xs) - padding),
    max(0, min(ys) - padding),
    min(width, max(xs) + padding + 1),
    min(height, max(ys) + padding + 1),
)

cropped = image.crop(box)
cropped.save(target)
print(f"{source}: {image.size} -> {target}: {cropped.size}, box={box}")

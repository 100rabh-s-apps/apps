
from PIL import Image
import os

def crop_planets(image_path):
    """
    Crops a 3x3 grid of planets from a single image and saves them as separate files.
    """
    try:
        img = Image.open(image_path)
        width, height = img.size
    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return

    grid_size = 3
    cell_width = width // grid_size
    cell_height = height // grid_size

    planets = [
        "mercury", "venus", "earth",
        "mars", "jupiter", "saturn",
        "uranus", "neptune", "pluto"
    ]

    output_dir = "planets"
    os.makedirs(output_dir, exist_ok=True)

    for i in range(grid_size):
        for j in range(grid_size):
            left = j * cell_width
            top = i * cell_height
            right = left + cell_width
            bottom = top + cell_height

            planet_image = img.crop((left, top, right, bottom))
            planet_name = planets[i * grid_size + j]
            planet_image.save(os.path.join(output_dir, f"{planet_name}.jpg"))
            print(f"Saved {planet_name}.jpg")

if __name__ == "__main__":
    crop_planets("planets.jpg")

from PIL import Image, ImageDraw, ImageFont
import os

def create_og_image(app_name, description, bg_color, text_color, output_path):
    img = Image.new('RGB', (1200, 630), color = bg_color)
    d = ImageDraw.Draw(img)

    try:
        # Try to use a common font
        font_title = ImageFont.truetype("arial.ttf", 120)
        font_desc = ImageFont.truetype("arial.ttf", 60)
    except IOError:
        # Fallback to default font if arial.ttf is not found
        font_title = ImageFont.load_default()
        font_desc = ImageFont.load_default()
        print("Warning: arial.ttf not found, using default font.")

    d.text((600, 250), app_name, fill=text_color, font=font_title, anchor="mm")
    d.text((600, 370), description, fill=text_color, font=font_desc, anchor="mm")

    img.save(output_path)

app_name = "Free Personality Test"
description = "Myers-Briggs Type Indicator (MBTI)"
bg_color = "#f0e6fa"
text_color = "#8a2be2"
output_path = "/home/the100rabh/code/personal/apps/personalitytest/og-image.png"

create_og_image(app_name, description, bg_color, text_color, output_path)
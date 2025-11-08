
import re

# Read the content of the SVG file
with open('/home/the100rabh/code/personal/apps/statesofindia/in.svg', 'r') as f:
    svg_content = f.read()

# Read the content of the HTML file
with open('/home/the100rabh/code/personal/apps/statesofindia/index.html', 'r') as f:
    html_content = f.read()

# Extract paths from the SVG file
paths = re.findall(r'<path[^>]*d="([^"]*)"[^>]*id="IN[^"]*"[^>]*name="([^"]*)"', svg_content)

state_paths = {name: d for d, name in paths}

# Combine Jammu and Kashmir and Ladakh
if 'Jammu and Kashmir' in state_paths and 'Ladakh' in state_paths:
    state_paths['Jammu and Kashmir'] = state_paths['Jammu and Kashmir'] + ' ' + state_paths.pop('Ladakh')

# Rename Orissa to Odisha and Uttaranchal to Uttarakhand
if 'Orissa' in state_paths:
    state_paths['Odisha'] = state_paths.pop('Orissa')
if 'Uttaranchal' in state_paths:
    state_paths['Uttarakhand'] = state_paths.pop('Uttaranchal')

# Function to replace the d attribute
def replace_path_d(match):
    path_id = match.group(1)
    state_name = match.group(2)
    if state_name in state_paths:
        return f'<path id="{path_id}" class="state" data-state="{state_name}" d="{state_paths[state_name]}">'
    return match.group(0)

# Replace the placeholder paths in the HTML content
updated_html_content = re.sub(r'<path id="([^"]*)" class="state" data-state="([^"]*)" d="[^"]*">', replace_path_d, html_content)


with open('/home/the100rabh/code/personal/apps/statesofindia/index.html', 'w') as f:
    f.write(updated_html_content)

print("index.html has been updated successfully.")

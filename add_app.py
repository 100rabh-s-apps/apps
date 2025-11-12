
import sys
from bs4 import BeautifulSoup

def get_input(prompt, default=None):
    """Gets user input with an optional default value."""
    response = input(f"{prompt} (default: {default}): ").strip()
    return response if response else default

def main():
    """Interactively collects app information and adds it to the index.html file."""

    print("Welcome to the App Link Generator!")
    print("Please provide the following details for the new app.")

    # --- Collect App Information ---
    title = get_input("Enter the app title")
    if not title:
        print("Title is required. Exiting.")
        sys.exit(1)

    description = get_input("Enter a brief description of the app")
    link = get_input("Enter the full URL for the app")
    icon_class = get_input("Enter the Bootstrap icon class (e.g., 'bi-star-fill')", "bi-app-indicator")
    
    print("Select a category:")
    print("1. Games for Kids")
    print("2. Misc Applications")
    category_choice = get_input("Enter the category number (1 or 2)", "1")

    if category_choice == "1":
        category = "Games for Kids"
    elif category_choice == "2":
        category = "Misc Applications"
    else:
        print("Invalid category choice. Please enter 1 or 2. Exiting.")
        sys.exit(1)

    card_bg_color = get_input("Enter the card background color (hex or name)", "#f8f9fa")
    btn_bg_color = get_input("Enter the button background color (hex or name)", "#007bff")
    btn_text_color = get_input("Enter the button text color (hex or name)", "#ffffff")

    # --- Generate HTML Snippet ---
    html_snippet = f"""
<div class="col-md-6 col-lg-5">
    <div class="card h-100" style="background-color: {card_bg_color};">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">
                <i class="bi {icon_class}"></i> {title}
            </h5>
            <p class="card-text flex-grow-1">{description}</p>
            <a href="{link}" class="btn mt-3 align-self-start" target="_blank"
                rel="noopener noreferrer"
                style="background-color: {btn_bg_color}; border-color: {btn_bg_color}; color: {btn_text_color}; font-weight: 500;">Visit
                App <i class="bi bi-arrow-up-right-square-fill ms-1"></i></a>
        </div>
    </div>
</div>
"""

    # --- Add to index.html ---
    try:
        with open("index.html", "r+", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
            
            if category == "Games for Kids":
                target_div = soup.find("div", {"id": "games"})
            else:
                target_div = soup.find("div", {"id": "misc"})

            if not target_div:
                print(f"Error: Could not find the '{category}' section in index.html.")
                sys.exit(1)
            
            # Find the row to append to
            row = target_div.find("div", {"class": "row"})
            if not row:
                print(f"Error: Could not find the row in the '{category}' section.")
                sys.exit(1)

            row.append(BeautifulSoup(html_snippet, "html.parser"))
            
            f.seek(0)
            f.write(str(soup))
            f.truncate()

        print("\nSuccessfully added the new app to index.html!")
        print("Generated HTML snippet:")
        print(html_snippet)

    except FileNotFoundError:
        print("Error: index.html not found. Make sure you are in the correct directory.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

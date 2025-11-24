#!/usr/bin/env python3
"""
Script to validate that all referenced assets exist in each app.
"""
import os
from pathlib import Path
import re
import urllib.parse

def find_html_files(app_dir):
    """Find all HTML files in an app directory."""
    html_files = []
    for root, dirs, files in os.walk(app_dir):
        for file in files:
            if file.endswith('.html') or file.endswith('.htm'):
                html_files.append(os.path.join(root, file))
    return html_files

def extract_asset_references(html_file_path):
    """Extract all asset references from an HTML file."""
    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    assets = []
    
    # Find all href/src attributes that reference a file
    patterns = [
        r'href\s*=\s*["\']([^"\']*(?:\.(?:css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)[^"\']*))["\']',  # href
        r'src\s*=\s*["\']([^"\']*(?:\.(?:js|png|jpg|jpeg|gif|svg|ico|webp|mp3|wav|ogg|woff|woff2|ttf|eot|json|xml)[^"\']*))["\']',  # src
        r'content\s*=\s*["\']([^"\']*(?:\.(?:png|jpg|jpeg|gif|svg|webp)[^"\']*))["\']',  # og:image, twitter:image
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            # Skip external URLs
            if not match.startswith('http') and not match.startswith('//'):
                # Remove query parameters and fragments
                clean_path = match.split('?')[0].split('#')[0]
                assets.append(clean_path)
    
    # Also check for @import statements in CSS content within HTML
    css_imports = re.findall(r'@import\s+["\']([^"\']*(?:\.(?:css)[^"\']*))["\']', content, re.IGNORECASE)
    for import_path in css_imports:
        if not import_path.startswith('http') and not import_path.startswith('//'):
            clean_path = import_path.split('?')[0].split('#')[0]
            assets.append(clean_path)
    
    # Check for dynamically loaded resources in JavaScript within HTML
    js_resources = re.findall(r'["\']([^"\'\s]*(?:\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|mp3|wav|ogg|json|xml)[^"\'\s]*))["\']', content, re.IGNORECASE)
    for resource in js_resources:
        if not resource.startswith('http') and not resource.startswith('//'):
            clean_path = resource.split('?')[0].split('#')[0]
            assets.append(clean_path)
    
    return assets

def validate_assets_in_app(app_path):
    """Validate that all assets referenced in an app exist."""
    print(f"\nValidating assets in {app_path}...")
    
    html_files = find_html_files(app_path)
    if not html_files:
        print(f"  No HTML files found in {app_path}")
        return []
    
    all_assets = []
    for html_file in html_files:
        assets = extract_asset_references(html_file)
        all_assets.extend(assets)
    
    # Remove duplicates
    all_assets = list(set(all_assets))
    
    # Check if each asset exists relative to the app directory
    missing_assets = []
    for asset in all_assets:
        # Handle relative paths
        asset_path = os.path.join(app_path, asset)
        
        # Normalize the path to resolve any relative navigation
        asset_path = os.path.normpath(asset_path)
        
        if not os.path.exists(asset_path):
            missing_assets.append(asset)
    
    if missing_assets:
        print(f"  Missing assets in {app_path}:")
        for asset in missing_assets:
            print(f"    - {asset}")
    else:
        print(f"  All assets in {app_path} exist.")
    
    return missing_assets

def main():
    base_path = Path("/home/the100rabh/code/personal/apps")
    
    # Get all subdirectories that represent apps
    app_dirs = [d for d in base_path.iterdir() if d.is_dir() and d.name not in ['.git', '.vscode', 'venv']]
    
    all_missing_assets = {}
    
    print("Validating assets in all apps...")
    
    for app_dir in app_dirs:
        missing_assets = validate_assets_in_app(str(app_dir))
        if missing_assets:
            all_missing_assets[app_dir.name] = missing_assets
    
    print("\n" + "="*50)
    print("SUMMARY:")
    if all_missing_assets:
        print("Missing assets found in the following apps:")
        for app, assets in all_missing_assets.items():
            print(f"\n{app}:")
            for asset in assets:
                print(f"  - {asset}")
    else:
        print("All asset references are valid across all apps!")
    
    return len(all_missing_assets) == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)